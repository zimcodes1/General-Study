from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('me/', views.get_profile, name='profile'),
    path('update/', views.update_profile, name='update_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('faculties/', views.get_faculties, name='faculties'),
    path('departments/', views.get_departments, name='departments'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('recommended-resources/', views.recommended_resources, name='recommended_resources'),

    # Admin user management
    path('admin/users/', views.admin_user_list, name='admin_user_list'),
    path('admin/users/<uuid:user_id>/disable/', views.admin_disable_user, name='admin_disable_user'),
    path('admin/users/<uuid:user_id>/enable/', views.admin_enable_user, name='admin_enable_user'),
    path('admin/user-analytics/', views.admin_user_analytics, name='admin_user_analytics'),
]
