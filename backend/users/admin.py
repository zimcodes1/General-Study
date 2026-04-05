from django.contrib import admin
from .models import User
from .faculty_models import Faculty, Department

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'school', 'faculty', 'department', 'degree_level', 'current_level', 'points', 'streak']
    list_filter = ['degree_level', 'current_level', 'school', 'faculty', 'department']
    search_fields = ['email', 'full_name', 'school']
    readonly_fields = ['id', 'created_at', 'last_active_date']

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'faculty', 'created_at']
    list_filter = ['faculty']
    search_fields = ['name', 'faculty__name']
