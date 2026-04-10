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
]
