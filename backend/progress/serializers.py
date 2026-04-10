from rest_framework import serializers
from progress.models import Progress
from resources.models import Resource


class ProgressResourceSerializer(serializers.ModelSerializer):
    """Minimal resource info for progress display"""
    file_type = serializers.CharField(source='catalogue.resource.file_type')
    course_code = serializers.CharField(source='catalogue.resource.course_code')
    
    class Meta:
        model = Resource
        fields = ['id', 'title', 'file_type', 'course_code']


class ProgressSerializer(serializers.ModelSerializer):
    """Serializer for user progress on catalogues"""
    resource_id = serializers.CharField(source='catalogue.resource.id', read_only=True)
    resource_title = serializers.CharField(source='catalogue.resource.title', read_only=True)
    resource_file_type = serializers.CharField(source='catalogue.resource.file_type', read_only=True)
    resource_course_code = serializers.CharField(source='catalogue.resource.course_code', read_only=True)
    resource_faculty_name = serializers.CharField(source='catalogue.resource.faculty.name', read_only=True)
    
    class Meta:
        model = Progress
        fields = [
            'id',
            'resource_id',
            'resource_title',
            'resource_file_type',
            'resource_course_code',
            'resource_faculty_name',
            'completion_percent',
            'updated_at',
        ]
        read_only_fields = fields
