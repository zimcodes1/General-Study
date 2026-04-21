from django.contrib import admin
from .models import Assessment

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'resource', 'type', 'score', 'total_questions', 'completed', 'created_at']
    list_filter = ['type', 'completed', 'created_at']
    search_fields = ['user__full_name', 'resource__title']
    readonly_fields = ['id', 'created_at', 'completed_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'resource', 'type')
        }),
        ('Questions', {
            'fields': ('questions_json',),
            'classes': ('collapse',)
        }),
        ('Results', {
            'fields': ('score', 'total_questions', 'completed')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'completed_at')
        }),
    )
