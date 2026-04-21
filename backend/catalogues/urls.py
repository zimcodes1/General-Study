from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import CatalogueViewSet, CatalogueProgressViewSet

router = SimpleRouter()
router.register(r'catalogues', CatalogueViewSet, basename='catalogue')

# Create explicit URLs for progress actions instead of using router
progress_view = CatalogueProgressViewSet.as_view({
    'get': 'current_catalogue',
    'post': 'submit_quiz'
})

urlpatterns = [
    path('progress/current_catalogue/', CatalogueProgressViewSet.as_view({'get': 'current_catalogue'}), name='current-catalogue'),
    path('progress/submit_quiz/', CatalogueProgressViewSet.as_view({'post': 'submit_quiz'}), name='submit-quiz'),
    path('progress/complete_topic/', CatalogueProgressViewSet.as_view({'post': 'complete_topic'}), name='complete-topic'),
]

# Add router-generated catalogue URLs
urlpatterns += router.urls
