"""
Test cases for the streak system.
Run with: python manage.py test users.test_streak
"""

from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from .models import User
from .views import update_user_streak


class StreakSystemTestCase(TestCase):
    """Test the streak update logic"""
    
    def setUp(self):
        """Create a test user"""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            full_name='Test User',
            school='Test School',
            degree_level='undergraduate',
            current_level='100'
        )
    
    def test_first_login_sets_streak_to_one(self):
        """First login should set streak to 1"""
        # User has no last_active_date
        self.assertIsNone(self.user.last_active_date)
        self.assertEqual(self.user.streak, 0)
        
        # Update streak
        update_user_streak(self.user)
        
        # Should now have streak of 1 and today's date
        self.assertEqual(self.user.streak, 1)
        self.assertEqual(self.user.last_active_date, timezone.now().date())
    
    def test_same_day_login_does_not_change_streak(self):
        """Logging in multiple times on the same day shouldn't change streak"""
        today = timezone.now().date()
        self.user.last_active_date = today
        self.user.streak = 5
        self.user.save()
        
        # Update streak (same day)
        update_user_streak(self.user)
        
        # Streak should remain 5
        self.assertEqual(self.user.streak, 5)
        self.assertEqual(self.user.last_active_date, today)
    
    def test_consecutive_day_login_increments_streak(self):
        """Logging in on consecutive days should increment streak"""
        yesterday = timezone.now().date() - timedelta(days=1)
        self.user.last_active_date = yesterday
        self.user.streak = 5
        self.user.save()
        
        # Update streak (next day)
        update_user_streak(self.user)
        
        # Streak should increment to 6
        self.assertEqual(self.user.streak, 6)
        self.assertEqual(self.user.last_active_date, timezone.now().date())
    
    def test_broken_streak_resets_to_one(self):
        """If streak is broken (gap > 1 day), should reset to 1"""
        two_days_ago = timezone.now().date() - timedelta(days=2)
        self.user.last_active_date = two_days_ago
        self.user.streak = 10
        self.user.save()
        
        # Update streak (after 2+ day gap)
        update_user_streak(self.user)
        
        # Streak should reset to 1
        self.assertEqual(self.user.streak, 1)
        self.assertEqual(self.user.last_active_date, timezone.now().date())
    
    def test_login_returns_updated_user(self):
        """Update streak should return the user object"""
        updated_user = update_user_streak(self.user)
        
        self.assertEqual(updated_user.id, self.user.id)
        self.assertEqual(updated_user.streak, 1)
