from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from progress.models import Progress
from progress.serializers import ProgressSerializer


class ProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving user's learning progress.
    Returns the user's progress on catalogues they're currently reading.
    """
    serializer_class = ProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return progress for the current user, ordered by most recent updates"""
        return Progress.objects.filter(user=self.request.user).order_by('-updated_at')
    
    def list(self, request, *args, **kwargs):
        """Override list to support custom pagination."""
        limit = int(request.query_params.get('limit', 10))
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
