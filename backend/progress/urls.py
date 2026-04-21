from django.urls import path, include
from rest_framework.routers import DefaultRouter
from progress.views import ProgressViewSet

router = DefaultRouter()
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
