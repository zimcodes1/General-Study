import uuid
from django.db import models
from users.models import User
from resources.models import Resource


class UserAction(models.Model):
    """Track user actions for activity log (uploads, bookmarks, reviews, quiz completions, etc.)"""
    
    ACTION_TYPES = [
        ('resource_upload', 'Resource Upload'),
        ('resource_approved', 'Resource Approved'),
        ('bookmark_add', 'Added Bookmark'),
        ('bookmark_remove', 'Removed Bookmark'),
        ('review_create', 'Created Review'),
        ('review_update', 'Updated Review'),
        ('assessment_start', 'Assessment Started'),
        ('assessment_complete', 'Assessment Completed'),
        ('catalogue_complete', 'Catalogue Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_actions')
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    resource = models.ForeignKey(
        Resource, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='user_actions'
    )
    
    # Extra metadata for specific actions
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action_type', '-created_at']),
        ]
    
    def __str__(self):
        resource_info = f" - {self.resource.title}" if self.resource else ""
        return f"{self.user.full_name} {self.get_action_type_display()}{resource_info}"
