from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'school', 'department', 'degree_level', 'current_level', 'points', 'streak']
    list_filter = ['degree_level', 'current_level', 'school', 'department']
    search_fields = ['email', 'full_name', 'school', 'department']
    readonly_fields = ['id', 'created_at', 'last_active_date']
