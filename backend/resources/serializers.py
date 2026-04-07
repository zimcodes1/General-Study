"""
DRF Serializers for Resource and Catalogue models.
"""

from rest_framework import serializers
from resources.models import Resource, Bookmark
from catalogues.models import Catalogue
from users.models import User


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user serializer for resource uploads."""

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']
        read_only_fields = ['id', 'full_name', 'email']


class CatalogueSerializer(serializers.ModelSerializer):
    """Serializer for Catalogue objects."""

    resource_title = serializers.CharField(source='resource.title', read_only=True)

    class Meta:
        model = Catalogue
        fields = [
            'id',
            'resource_title',
            'title',
            'summary',
            'content_json',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'resource_title',
            'title',
            'summary',
            'content_json',
            'created_at',
            'updated_at',
        ]


class ResourceListSerializer(serializers.ModelSerializer):
    """Serializer for listing resources."""

    uploaded_by = UserMinimalSerializer(read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True, allow_null=True)

    class Meta:
        model = Resource
        fields = [
            'id',
            'title',
            'course_code',
            'course_name',
            'faculty_name',
            'department_name',
            'level',
            'file_type',
            'status',
            'rating_avg',
            'rating_count',
            'uploaded_by',
            'created_at',
        ]
        read_only_fields = fields


class ResourceUploadSerializer(serializers.ModelSerializer):
    """Serializer for uploading new resources."""

    file = serializers.FileField(required=True, allow_empty_file=False)

    class Meta:
        model = Resource
        fields = [
            'file',
            'title',
            'course_code',
            'course_name',
            'faculty',
            'department',
            'level',
            'attribution',
        ]
        required_fields = [
            'file',
            'title',
            'course_code',
            'course_name',
            'faculty',
            'level',
        ]

    def validate_file(self, value):
        """Validate uploaded file."""
        max_size = 50 * 1024 * 1024  # 50MB
        if value.size > max_size:
            raise serializers.ValidationError(f"File size exceeds 50MB limit")

        # Check file extension
        allowed_extensions = {
            'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt',
            'jpg', 'jpeg', 'png', 'gif', 'webp'
        }
        filename = value.name.lower()
        if '.' not in filename:
            raise serializers.ValidationError("File must have an extension")

        ext = filename.split('.')[-1]
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"File type .{ext} not supported. Allowed: {', '.join(sorted(allowed_extensions))}"
            )

        return value

    def validate_title(self, value):
        """Validate title."""
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters")
        if len(value) > 255:
            raise serializers.ValidationError("Title must be at most 255 characters")
        return value

    def validate_level(self, value):
        """Validate level is numeric."""
        try:
            int(value)
        except ValueError:
            raise serializers.ValidationError("Level must be numeric")
        return value

    def create(self, validated_data):
        """Create resource and determine file type."""
        file_obj = validated_data.pop('file')
        filename = file_obj.name.lower()
        ext = filename.split('.')[-1]

        # Map extension to file_type
        extension_map = {
            'pdf': 'pdf',
            'doc': 'doc',
            'docx': 'docx',
            'ppt': 'ppt',
            'pptx': 'pptx',
            'txt': 'txt',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'gif': 'image',
            'webp': 'image',
        }

        resource = Resource.objects.create(
            file=file_obj,
            file_type=extension_map.get(ext, 'other'),
            status='processing',
            **validated_data
        )
        return resource


class ResourceDetailSerializer(serializers.ModelSerializer):
    """Serializer for resource details including catalogue."""

    uploaded_by = UserMinimalSerializer(read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True, allow_null=True)
    catalogue = serializers.SerializerMethodField()

    def get_catalogue(self, obj):
        """Get catalogue data if it exists."""
        try:
            catalogue = Catalogue.objects.get(resource=obj)
            return CatalogueSerializer(catalogue).data
        except Catalogue.DoesNotExist:
            return None

    class Meta:
        model = Resource
        fields = [
            'id',
            'title',
            'course_code',
            'course_name',
            'faculty_name',
            'department_name',
            'level',
            'file_type',
            'cover_image',
            'attribution',
            'status',
            'processing_error',
            'rating_avg',
            'rating_count',
            'uploaded_by',
            'catalogue',
            'created_at',
        ]
        read_only_fields = fields


class ResourceStatusSerializer(serializers.ModelSerializer):
    """Serializer for status polling endpoint."""

    progress_percent = serializers.SerializerMethodField()

    def get_progress_percent(self, obj):
        """Calculate progress based on status."""
        status_map = {
            'processing': 50,
            'pending': 100,
            'approved': 100,
            'rejected': 0,
            'failed': 0,
        }
        return status_map.get(obj.status, 50)

    class Meta:
        model = Resource
        fields = [
            'id',
            'status',
            'progress_percent',
            'processing_error',
            'processing_completed_at',
        ]
        read_only_fields = fields


class BookmarkSerializer(serializers.ModelSerializer):
    """Serializer for bookmarks."""
    
    resource_title = serializers.CharField(source='resource.title', read_only=True)
    resource_course_code = serializers.CharField(source='resource.course_code', read_only=True)
    resource_file_type = serializers.CharField(source='resource.file_type', read_only=True)
    resource_cover_image = serializers.CharField(source='resource.cover_image', read_only=True, allow_null=True)
    resource_rating_avg = serializers.FloatField(source='resource.rating_avg', read_only=True)
    
    class Meta:
        model = Bookmark
        fields = [
            'id',
            'resource',
            'resource_title',
            'resource_course_code',
            'resource_file_type',
            'resource_cover_image',
            'resource_rating_avg',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
