from django.db import models
from users.models import User
import uuid

class Gamification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='gamification')
    
    total_points = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-total_points']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.total_points} points"
