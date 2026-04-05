from django.db import models
from resources.models import Resource
import uuid

class Catalogue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.OneToOneField(Resource, on_delete=models.CASCADE, related_name='catalogue')
    
    title = models.CharField(max_length=255)
    content_json = models.JSONField()
    summary = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Catalogue: {self.title}"
