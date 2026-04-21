# This will make sure the Celery app is loaded when Django starts
from .redis import app as celery

__all__ = ('celery',)
