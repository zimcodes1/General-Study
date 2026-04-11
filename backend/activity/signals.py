from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

from resources.models import Resource, Bookmark
from users.models import User
from assessments.models import Assessment
from .models import UserAction


@receiver(post_save, sender=Resource)
def track_resource_upload(sender, instance, created, **kwargs):
    """Create UserAction when a resource is uploaded or approved"""
    if created:
        # Track resource upload only if successfully created
        UserAction.objects.create(
            user=instance.uploaded_by,
            action_type='resource_upload',
            resource=instance,
            metadata={'file_type': instance.file_type, 'course_code': instance.course_code}
        )
        # Award points for upload
        instance.uploaded_by.points += 10
        instance.uploaded_by.save(update_fields=['points'])
    
    # Track resource approval (status change to approved)
    if instance.status == 'approved' and not created:
        # Check if approval action was already recorded
        if not UserAction.objects.filter(
            user=instance.uploaded_by,
            action_type='resource_approved',
            resource=instance
        ).exists():
            UserAction.objects.create(
                user=instance.uploaded_by,
                action_type='resource_approved',
                resource=instance,
                metadata={'course_code': instance.course_code}
            )
            # Award bonus points for approval
            instance.uploaded_by.points += 5
            instance.uploaded_by.save(update_fields=['points'])


@receiver(post_save, sender=Bookmark)
def track_bookmark_add(sender, instance, created, **kwargs):
    """Create UserAction when a resource is bookmarked"""
    if created:
        UserAction.objects.create(
            user=instance.user,
            action_type='bookmark_add',
            resource=instance.resource,
            metadata={'resource_title': instance.resource.title}
        )
        # Update last active date (streak will be updated on next login)
        today = timezone.now().date()
        if instance.user.last_active_date != today:
            instance.user.last_active_date = today
            instance.user.save(update_fields=['last_active_date'])


@receiver(post_delete, sender=Bookmark)
def track_bookmark_remove(sender, instance, **kwargs):
    """Create UserAction when a bookmark is removed"""
    UserAction.objects.create(
        user=instance.user,
        action_type='bookmark_remove',
        resource=instance.resource,
        metadata={'resource_title': instance.resource.title}
    )


@receiver(post_save, sender=Assessment)
def track_assessment_completion(sender, instance, created, **kwargs):
    """Create UserAction when assessment is completed"""
    if created:
        UserAction.objects.create(
            user=instance.user,
            action_type='assessment_start',
            resource=instance.resource,
            metadata={'assessment_type': instance.type}
        )
    else:
        # Track completion if score was just added
        if instance.score is not None and not UserAction.objects.filter(
            user=instance.user,
            action_type='assessment_complete',
            resource=instance.resource,
            metadata__contains={'assessment_id': str(instance.id)}
        ).exists():
            UserAction.objects.create(
                user=instance.user,
                action_type='assessment_complete',
                resource=instance.resource,
                metadata={
                    'assessment_type': instance.type,
                    'score': instance.score,
                    'total_questions': instance.total_questions,
                    'assessment_id': str(instance.id)
                }
            )
            
            # Award points based on score
            points = int((instance.score / instance.total_questions) * 20)  # Max 20 points
            instance.user.points += points
            
            # Update last_active_date (streak managed at login, not on every activity)
            today = timezone.now().date()
            if instance.user.last_active_date != today:
                instance.user.last_active_date = today
                instance.user.save(update_fields=['points', 'last_active_date'])
            else:
                instance.user.save(update_fields=['points'])
