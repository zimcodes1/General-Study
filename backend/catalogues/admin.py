from django.contrib import admin
from .models import Catalogue, Topic, QuizQuestion, CatalogueProgress, TopicQuizAttempt


@admin.register(Catalogue)
class CatalogueAdmin(admin.ModelAdmin):
    list_display = ['title', 'resource', 'created_at']
    search_fields = ['title', 'resource__title', 'summary']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('resource', 'title', 'summary')
        }),
        ('Content', {
            'fields': ('content_json',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'catalogue', 'order', 'created_at']
    list_filter = ['catalogue', 'created_at']
    search_fields = ['title', 'catalogue__title', 'content']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['catalogue', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('catalogue', 'title', 'order')
        }),
        ('Content', {
            'fields': ('content', 'summary')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['question_preview', 'topic', 'order']
    list_filter = ['topic__catalogue', 'created_at']
    search_fields = ['question', 'topic__title']
    readonly_fields = ['id', 'created_at']
    ordering = ['topic', 'order']
    
    def question_preview(self, obj):
        return obj.question[:50] + "..." if len(obj.question) > 50 else obj.question
    question_preview.short_description = 'Question'


@admin.register(CatalogueProgress)
class CatalogueProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'catalogue', 'completion_percent', 'points_earned', 'last_accessed_at']
    list_filter = ['catalogue', 'started_at', 'completed_at']
    search_fields = ['user__full_name', 'user__email', 'catalogue__title']
    readonly_fields = ['id', 'started_at', 'last_accessed_at']


@admin.register(TopicQuizAttempt)
class TopicQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'topic', 'score_display', 'points_earned', 'attempted_at']
    list_filter = ['topic__catalogue', 'attempted_at']
    search_fields = ['user__full_name', 'user__email', 'topic__title']
    readonly_fields = ['id', 'attempted_at']
    
    def score_display(self, obj):
        return f"{obj.score}/{obj.total_questions}"
    score_display.short_description = 'Score'

