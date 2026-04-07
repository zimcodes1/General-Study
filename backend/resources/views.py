"""
API Views for resource upload and status tracking.
"""

import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from resources.models import Resource, Bookmark
from resources.serializers import (
    ResourceUploadSerializer,
    ResourceDetailSerializer,
    ResourceListSerializer,
    ResourceStatusSerializer,
    BookmarkSerializer,
)
from processing.tasks import process_resource_upload

logger = logging.getLogger(__name__)


class ResourceViewSet(viewsets.ModelViewSet):
    """ViewSet for resource management."""

    queryset = Resource.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return ResourceUploadSerializer
        elif self.action == 'retrieve':
            return ResourceDetailSerializer
        elif self.action == 'status':
            return ResourceStatusSerializer
        return ResourceListSerializer

    def get_queryset(self):
        """Filter resources based on user role and query parameters."""
        if self.request.user.is_staff:
            # Admin sees all resources
            queryset = Resource.objects.all().order_by('-created_at')
        else:
            # Regular users see approved resources + their own
            queryset = Resource.objects.filter(status='approved') | Resource.objects.filter(
                uploaded_by=self.request.user
            )
        
        # Filter by uploaded_by parameter (for My Resources)
        uploaded_by = self.request.query_params.get('uploaded_by')
        if uploaded_by == 'me':
            queryset = queryset.filter(uploaded_by=self.request.user)
        
        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        """Override list to support custom pagination."""
        limit = int(request.query_params.get('limit', 9))
        offset = int(request.query_params.get('offset', 0))
        
        queryset = self.get_queryset()
        total_count = queryset.count()
        
        # Manually paginate
        paginated = queryset[offset:offset + limit]
        serializer = self.get_serializer(paginated, many=True)
        
        return Response(
            {
                "count": total_count,
                "limit": limit,
                "offset": offset,
                "results": serializer.data
            },
            status=status.HTTP_200_OK,
        )

    def perform_create(self, serializer):
        """Save resource and trigger async processing."""
        try:
            logger.warning(f"[API] ⚠️  Creating resource upload for user {self.request.user.id}")

            # Set uploaded_by to current user
            resource = serializer.save(uploaded_by=self.request.user)
            logger.warning(f"[API] ✅ Resource created: {resource.id} - Title: {resource.title}")

            # Trigger async processing pipeline
            logger.warning(f"[API] 📤 Triggering async task for resource {resource.id}")
            task = process_resource_upload.delay(str(resource.id))
            logger.warning(f"[API] ✅ Task enqueued successfully: {task.id}")

        except Exception as e:
            logger.error(f"[API] ❌ Error creating resource: {e}", exc_info=True)
            raise

    def create(self, request, *args, **kwargs):
        """Override create to return 202 Accepted instead of 201."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                "id": str(serializer.instance.id),
                "status": serializer.instance.status,
                "message": "Resource upload accepted. Processing in background.",
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def status(self, request, pk=None):
        """
        Get resource processing status.

        Returns status object with progress percentage.
        """
        try:
            resource = self.get_object()

            # Check permissions - user can view own resources or admin can view all
            if resource.uploaded_by != request.user and not request.user.is_staff:
                return Response(
                    {"detail": "You don't have permission to view this resource."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serializer = self.get_serializer(resource)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Resource.DoesNotExist:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Admin action to approve a resource."""
        if not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to approve resources."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            resource = self.get_object()
            resource.status = 'approved'
            resource.save(update_fields=['status'])
            
            logger.info(f"Resource {resource.id} approved by admin {request.user.id}")
            return Response(
                {"detail": f"Resource '{resource.title}' approved."},
                status=status.HTTP_200_OK,
            )
        except Resource.DoesNotExist:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Admin action to reject a resource."""
        if not request.user.is_staff:
            return Response(
                {"detail": "You don't have permission to reject resources."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            resource = self.get_object()
            reason = request.data.get('reason', 'No reason provided')
            
            resource.status = 'rejected'
            resource.processing_error = f"Admin rejection: {reason}"
            resource.save(update_fields=['status', 'processing_error'])
            
            logger.info(f"Resource {resource.id} rejected by admin {request.user.id}")
            return Response(
                {"detail": f"Resource '{resource.title}' rejected. Reason: {reason}"},
                status=status.HTTP_200_OK,
            )
        except Resource.DoesNotExist:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, pk=None):
        """
        Add or remove a bookmark for a resource.
        POST: Add bookmark
        DELETE: Remove bookmark
        """
        try:
            resource = self.get_object()
            user = request.user
            
            if request.method == 'POST':
                # Add bookmark
                bookmark, created = Bookmark.objects.get_or_create(
                    user=user,
                    resource=resource
                )
                if created:
                    logger.info(f"User {user.id} bookmarked resource {resource.id}")
                    return Response(
                        {"detail": f"Resource '{resource.title}' bookmarked."},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"detail": "Resource already bookmarked."},
                        status=status.HTTP_200_OK,
                    )
            
            elif request.method == 'DELETE':
                # Remove bookmark
                bookmark = Bookmark.objects.filter(
                    user=user,
                    resource=resource
                ).first()
                
                if bookmark:
                    bookmark.delete()
                    logger.info(f"User {user.id} removed bookmark for resource {resource.id}")
                    return Response(
                        {"detail": f"Resource '{resource.title}' bookmark removed."},
                        status=status.HTTP_200_OK,
                    )
                else:
                    return Response(
                        {"detail": "Bookmark not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
        
        except Resource.DoesNotExist:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def is_bookmarked(self, request, pk=None):
        """Check if current user has bookmarked this resource."""
        try:
            resource = self.get_object()
            is_bookmarked = Bookmark.objects.filter(
                user=request.user,
                resource=resource
            ).exists()
            
            return Response(
                {"is_bookmarked": is_bookmarked},
                status=status.HTTP_200_OK,
            )
        except Resource.DoesNotExist:
            return Response(
                {"detail": "Resource not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def bookmarks(self, request):
        """
        Get current user's bookmarked resources with pagination.
        Query params: limit (default 9), offset (default 0)
        """
        limit = int(request.query_params.get('limit', 9))
        offset = int(request.query_params.get('offset', 0))
        
        # Get user's bookmarks
        bookmarks = Bookmark.objects.filter(
            user=request.user
        ).order_by('-created_at')
        
        # Get total count
        total_count = bookmarks.count()
        
        # Paginate
        paginated_bookmarks = bookmarks[offset:offset + limit]
        
        # Serialize the resources from bookmarks
        resources = [bookmark.resource for bookmark in paginated_bookmarks]
        serializer = ResourceListSerializer(resources, many=True)
        
        return Response(
            {
                "count": total_count,
                "limit": limit,
                "offset": offset,
                "results": serializer.data
            },
            status=status.HTTP_200_OK,
        )
