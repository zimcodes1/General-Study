# your_project/celery.py
import os
from celery import Celery

# Set default settings and configure Celery to use Redis
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Explicitly autodiscover tasks from all apps
app.autodiscover_tasks(['users', 'resources', 'catalogues', 'processing'])
