"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import SimpleRouter
from resources.views import ResourceViewSet
from resources import admin_views

# Setup DRF router for resource endpoints
router = SimpleRouter()
router.register(r'resources', ResourceViewSet, basename='resource')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/users/', include('users.urls')),
    path('api/', include('activity.urls')),
    path('api/', include('catalogues.urls')),
    # NOTE: keep catalogues before progress so /api/progress/submit_quiz/ and
    # /api/progress/current_catalogue/ are not swallowed by the progress router.
    path('api/', include('progress.urls')),
    path('api/users/', include('gamification.urls')),

    # Admin-specific endpoints
    path('api/admin/stats/', admin_views.admin_stats, name='admin_stats'),
    path('api/admin/resources/', admin_views.admin_resource_list, name='admin_resource_list'),
    path('api/admin/resources/<uuid:resource_id>/approve/', admin_views.admin_approve_resource, name='admin_approve_resource'),
    path('api/admin/resources/<uuid:resource_id>/reject/', admin_views.admin_reject_resource, name='admin_reject_resource'),
    path('api/admin/resources/<uuid:resource_id>/delete/', admin_views.admin_delete_resource, name='admin_delete_resource'),
    path('api/admin/resource-analytics/', admin_views.admin_resource_analytics, name='admin_resource_analytics'),
    path('api/admin/reports/', admin_views.admin_report_list, name='admin_report_list'),
    path('api/admin/reports/<uuid:report_id>/dismiss/', admin_views.admin_dismiss_report, name='admin_dismiss_report'),
    path('api/admin/reports/<uuid:report_id>/remove-resource/', admin_views.admin_resolve_report_remove_resource, name='admin_resolve_report_remove_resource'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
