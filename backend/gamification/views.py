from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users.models import User
from .serializers import UserStatsSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """
    Get current user's statistics and gamification data.
    
    Returns:
    - total_points: Total gamification points
    - current_streak: Current login/activity streak
    - last_active_date: Last activity date
    - completed_catalogues: Number of completed learning paths
    - average_score: Average assessment score
    - total_reviews: Number of reviews given
    - total_bookmarks: Number of bookmarked resources
    - courses_enrolled: Number of courses user enrolled in
    """
    user = request.user
    serializer = UserStatsSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

