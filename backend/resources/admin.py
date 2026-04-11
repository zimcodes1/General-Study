from django.contrib import admin
from .models import Resource, Bookmark

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'course_code', 'faculty', 'department', 'level', 'uploaded_by', 'status', 'rating_avg', 'created_at']
    list_filter = ['status', 'faculty', 'department', 'level', 'file_type']
    search_fields = ['title', 'course_code', 'course_name', 'uploaded_by__full_name']
    readonly_fields = ['id', 'rating_avg', 'rating_count', 'created_at', 'updated_at']
    list_editable = ['status']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'course_code', 'course_name')
        }),
        ('Academic Details', {
            'fields': ('faculty', 'department', 'level')
        }),
        ('File Information', {
            'fields': ('file_url', 'file_type', 'cover_image')
        }),
        ('Upload Details', {
            'fields': ('uploaded_by', 'attribution', 'status')
        }),
        ('Ratings', {
            'fields': ('rating_avg', 'rating_count')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'resource', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__full_name', 'resource__title']
    readonly_fields = ['id', 'created_at']
