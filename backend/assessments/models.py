from django.db import models
from users.models import User
from resources.models import Resource
import uuid

class Assessment(models.Model):
    TYPE_CHOICES = [
        ('quiz', 'Quiz'),
        ('exam', 'Exam'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assessments')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='assessments')
    
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    questions_json = models.JSONField()
    
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.type} on {self.resource.title}"
