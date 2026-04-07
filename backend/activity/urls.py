from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserActionViewSet

router = DefaultRouter()
router.register(r'activities', UserActionViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
]
