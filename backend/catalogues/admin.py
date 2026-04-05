from django.contrib import admin
from .models import Catalogue

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
