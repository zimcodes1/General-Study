from django.db import models
from users.models import User
from catalogues.models import Catalogue
import uuid

class Progress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE, related_name='user_progress')
    
    completed_subtopics = models.JSONField(default=list)
    current_index = models.IntegerField(default=0)
    
    score = models.IntegerField(default=0)
    completion_percent = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'catalogue']
        ordering = ['-updated_at']
        verbose_name_plural = 'Progress'
    
    def __str__(self):
        return f"{self.user.full_name} - {self.catalogue.title} ({self.completion_percent}%)"
