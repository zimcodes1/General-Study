from rest_framework import serializers
from .models import UserAction
from resources.models import Resource


class UserActionSerializer(serializers.ModelSerializer):
    """Serialize user actions for activity feed"""
    
    action_display = serializers.CharField(source='get_action_type_display', read_only=True)
    resource_title = serializers.CharField(source='resource.title', read_only=True, allow_null=True)
    resource_id = serializers.CharField(source='resource.id', read_only=True, allow_null=True)
    resource_file_type = serializers.CharField(source='resource.file_type', read_only=True, allow_null=True)
    
    class Meta:
        model = UserAction
        fields = ['id', 'action_type', 'action_display', 'resource_id', 'resource_title', 'resource_file_type', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']
