from rest_framework import serializers
from users.models import User
from gamification.models import Gamification
from progress.models import Progress
from assessments.models import Assessment
from django.db.models import Avg


class UserStatsSerializer(serializers.Serializer):
    """Serializer for user statistics and gamification data."""
    
    total_points = serializers.SerializerMethodField()
    current_streak = serializers.SerializerMethodField()
    last_active_date = serializers.SerializerMethodField()
    completed_catalogues = serializers.SerializerMethodField()
    average_score = serializers.SerializerMethodField()
    total_bookmarks = serializers.SerializerMethodField()
    courses_enrolled = serializers.SerializerMethodField()
    
    def get_total_points(self, obj):
        """Get total points from user."""
        return obj.points
    
    def get_current_streak(self, obj):
        """Get current streak from user."""
        return obj.streak
    
    def get_last_active_date(self, obj):
        """Get last active date from user."""
        return obj.last_active_date
    
    def get_completed_catalogues(self, obj):
        """Count completed catalogues (100% completion)."""
        return Progress.objects.filter(
            user=obj,
            completion_percent=100.0
        ).count()
    
    def get_average_score(self, obj):
        """Calculate average score from assessments."""
        avg = Assessment.objects.filter(
            user=obj,
            completed=True
        ).aggregate(avg_score=Avg('score'))['avg_score']
        
        return round(avg, 2) if avg else 0.0
    
    def get_total_bookmarks(self, obj):
        """Count total bookmarks."""
        return obj.bookmarks.count()
    
    def get_courses_enrolled(self, obj):
        """Get number of courses user is enrolled in."""
        return len(obj.courses) if obj.courses else 0
