from django.db import models
from resources.models import Resource
from users.models import User
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


class Topic(models.Model):
    """Topics within a catalogue (corresponds to subtopics in content_json)"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE, related_name='topics')
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    summary = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['catalogue', 'order']
        unique_together = ['catalogue', 'order']
    
    def __str__(self):
        return f"{self.catalogue.title} - {self.title}"


class QuizQuestion(models.Model):
    """Quiz questions for a topic"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='quiz_questions')
    
    question = models.TextField()
    options = models.JSONField()  # ['Option A', 'Option B', 'Option C', 'Option D']
    correct_answer = models.CharField(max_length=500)  # The correct option text
    explanation = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['topic', 'order']
    
    def __str__(self):
        return f"Question: {self.question[:50]}..."


class CatalogueProgress(models.Model):
    """User's progress on a catalogue"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='catalogue_progress')
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE, related_name='progress_records')
    
    completed_topics = models.JSONField(default=list)  # List of completed topic IDs
    current_topic_index = models.IntegerField(default=0)
    points_earned = models.IntegerField(default=0)
    completion_percent = models.FloatField(default=0.0)
    
    started_at = models.DateTimeField(auto_now_add=True)
    last_accessed_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'catalogue']
        ordering = ['-last_accessed_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.catalogue.title}"


class TopicQuizAttempt(models.Model):
    """Records of user's quiz attempts for a topic"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='quiz_attempts')
    catalogue_progress = models.ForeignKey(CatalogueProgress, on_delete=models.CASCADE, related_name='quiz_attempts')
    
    answers = models.JSONField()  # {'question_id': 'answer_text', ...}
    score = models.IntegerField()  # Number of correct answers
    total_questions = models.IntegerField()
    points_earned = models.IntegerField()  # 5 points per correct answer
    
    attempted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-attempted_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.topic.title} ({self.score}/{self.total_questions})"
