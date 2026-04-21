from django.contrib import admin
from .models import Gamification

@admin.register(Gamification)
class GamificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_points', 'streak', 'last_activity_date', 'updated_at']
    list_filter = ['streak', 'last_activity_date']
    search_fields = ['user__full_name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-total_points']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Gamification Stats', {
            'fields': ('total_points', 'streak', 'last_activity_date')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
