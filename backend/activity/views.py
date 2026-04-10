from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import UserAction
from .serializers import UserActionSerializer


class UserActionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving user activity logs.
    
    List user's own activity or admin can view other users' activity
    """
    serializer_class = UserActionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return activities for the current user"""
        user = self.request.user
        queryset = UserAction.objects.filter(user=user).order_by('-created_at')
        
        # Optional filtering by action type
        action_type = self.request.query_params.get('action_type')
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """Override list to support custom pagination."""
        limit = int(request.query_params.get('limit', 20))
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
