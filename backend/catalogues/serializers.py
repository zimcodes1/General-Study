from rest_framework import serializers
from .models import Catalogue, Topic, QuizQuestion, CatalogueProgress, TopicQuizAttempt


class QuizQuestionSerializer(serializers.ModelSerializer):
    """Serializer for quiz questions"""
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question', 'options', 'explanation', 'order', 'correct_answer']
        read_only_fields = ['id']


class TopicSerializer(serializers.ModelSerializer):
    """Serializer for topics with quiz questions"""
    quiz_questions = QuizQuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Topic
        fields = ['id', 'title', 'content', 'summary', 'order', 'quiz_questions']
        read_only_fields = fields


class CatalogueDetailSerializer(serializers.ModelSerializer):
    """Serializer for catalogue with all topics"""
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = Catalogue
        fields = ['id', 'title', 'summary', 'topics', 'created_at', 'updated_at']
        read_only_fields = fields


class CatalogueListSerializer(serializers.ModelSerializer):
    """Serializer for listing catalogues"""
    class Meta:
        model = Catalogue
        fields = ['id', 'title', 'summary', 'created_at']
        read_only_fields = fields


class TopicQuizAttemptSerializer(serializers.ModelSerializer):
    """Serializer for quiz attempt submissions"""
    class Meta:
        model = TopicQuizAttempt
        fields = ['id', 'answers', 'score', 'total_questions', 'points_earned', 'attempted_at']
        read_only_fields = ['id', 'score', 'points_earned', 'attempted_at']


class CatalogueProgressSerializer(serializers.ModelSerializer):
    """Serializer for user's catalogue progress"""
    quiz_attempts = TopicQuizAttemptSerializer(many=True, read_only=True)
    
    class Meta:
        model = CatalogueProgress
        fields = [
            'id', 'catalogue', 'completed_topics', 'current_topic_index',
            'points_earned', 'completion_percent', 'started_at',
            'last_accessed_at', 'completed_at', 'quiz_attempts'
        ]
        read_only_fields = [
            'id', 'started_at', 'last_accessed_at', 'completed_at', 'quiz_attempts'
        ]
