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
        queryset = UserAction.objects.filter(user=user)
        
        # Optional filtering by action type
        action_type = self.request.query_params.get('action_type')
        if action_type:
            queryset = queryset.filter(action_type=action_type)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_activity(self, request):
        """Get current user's activity"""
        queryset = self.get_queryset()
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
