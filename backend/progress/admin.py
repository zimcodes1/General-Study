from django.contrib import admin
from .models import Progress

@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'catalogue', 'completion_percent', 'score', 'updated_at']
    list_filter = ['completion_percent', 'updated_at']
    search_fields = ['user__full_name', 'catalogue__title']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('User & Catalogue', {
            'fields': ('user', 'catalogue')
        }),
        ('Progress Details', {
            'fields': ('completed_subtopics', 'current_index', 'score', 'completion_percent')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
