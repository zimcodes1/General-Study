from django.db import models
from users.models import User
from users.faculty_models import Faculty, Department
import uuid

class Resource(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('document', 'Document'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    course_code = models.CharField(max_length=50)
    course_name = models.CharField(max_length=255)
    
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='resources')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='resources')
    level = models.CharField(max_length=3)
    
    file_url = models.URLField(max_length=500)
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES)
    cover_image = models.URLField(max_length=500, blank=True, null=True)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_resources')
    attribution = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    rating_avg = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['faculty', 'status']),
            models.Index(fields=['department', 'status']),
            models.Index(fields=['level', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.course_code}"

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'resource']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.resource.title} ({self.rating}★)"

class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='bookmarked_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'resource']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.full_name} bookmarked {self.resource.title}"
