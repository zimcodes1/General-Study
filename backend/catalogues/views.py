from rest_framework import viewsets, status, viewsets as drf_viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Avg, Count
from datetime import timedelta

from .models import Catalogue, Topic, CatalogueProgress, TopicQuizAttempt, QuizQuestion
from progress.models import Progress
from resources.models import Review
from .serializers import (
    CatalogueDetailSerializer,
    CatalogueListSerializer,
    TopicSerializer,
    CatalogueProgressSerializer,
    TopicQuizAttemptSerializer,
)


class CatalogueViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for catalogues with learning content"""
    queryset = Catalogue.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CatalogueDetailSerializer
        return CatalogueListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get catalogue with all topics and user's progress"""
        catalogue = self.get_object()
        
        # Get or create user's progress for this catalogue
        progress, _ = CatalogueProgress.objects.get_or_create(
            user=request.user,
            catalogue=catalogue
        )
        
        # Update last accessed time
        progress.last_accessed_at = timezone.now()
        progress.save(update_fields=['last_accessed_at'])
        
        # Serialize catalogue
        serializer = self.get_serializer(catalogue)
        data = serializer.data
        
        # Add progress info
        data['user_progress'] = {
            'completed_topics': progress.completed_topics,
            'current_topic_index': progress.current_topic_index,
            'points_earned': progress.points_earned,
            'completion_percent': progress.completion_percent,
        }
        
        return Response(data)

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """
        Rate a catalogue (1-5 stars). Stored as a rating on the linked resource.
        Expects: { "rating": 1-5 }
        """
        rating = request.data.get('rating')
        try:
            rating_value = int(rating)
        except (TypeError, ValueError):
            rating_value = None

        if rating_value is None or rating_value < 1 or rating_value > 5:
            return Response(
                {'detail': 'rating must be an integer between 1 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )

        catalogue = self.get_object()
        resource = catalogue.resource

        review, created = Review.objects.get_or_create(
            user=request.user,
            resource=resource,
            defaults={'rating': rating_value}
        )

        if not created and review.rating != rating_value:
            review.rating = rating_value
            review.save(update_fields=['rating'])

        aggregates = Review.objects.filter(resource=resource).aggregate(
            avg=Avg('rating'),
            count=Count('id')
        )
        resource.rating_avg = float(aggregates['avg'] or 0)
        resource.rating_count = aggregates['count'] or 0
        resource.save(update_fields=['rating_avg', 'rating_count'])

        return Response(
            {
                'rating_avg': resource.rating_avg,
                'rating_count': resource.rating_count,
                'user_rating': review.rating,
            },
            status=status.HTTP_200_OK
        )


class TopicDetailView:
    """Get a specific topic with quiz questions"""
    
    @staticmethod
    def get_topic(topic_id: str, user):
        """Fetch topic with all quiz questions"""
        try:
            topic = Topic.objects.get(id=topic_id)
            
            # Verify user has access to this topic's catalogue
            catalogue = topic.catalogue
            CatalogueProgress.objects.get_or_create(
                user=user,
                catalogue=catalogue
            )
            
            serializer = TopicSerializer(topic)
            return Response(serializer.data)
        except Topic.DoesNotExist:
            return Response(
                {'detail': 'Topic not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CatalogueProgressViewSet(drf_viewsets.GenericViewSet):
    """ViewSet for managing user's catalogue progress"""
    permission_classes = [IsAuthenticated]
    queryset = CatalogueProgress.objects.none()  # Required for GenericViewSet
    
    @action(detail=False, methods=['get'])
    def current_catalogue(self, request):
        """Get user's current catalogue progress"""
        catalogue_id = request.query_params.get('catalogue_id')
        
        if not catalogue_id:
            return Response(
                {'detail': 'catalogue_id query parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            progress = CatalogueProgress.objects.get(
                user=request.user,
                catalogue_id=catalogue_id
            )
            serializer = CatalogueProgressSerializer(progress)
            return Response(serializer.data)
        except CatalogueProgress.DoesNotExist:
            return Response(
                {'detail': 'Progress not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def submit_quiz(self, request):
        """
        Submit quiz answers and update progress.
        Expects: {
            'catalogue_id': 'uuid',
            'topic_id': 'uuid',
            'answers': {'question_id': 'answer_text', ...}
        }
        """
        catalogue_id = request.data.get('catalogue_id')
        topic_id = request.data.get('topic_id')
        answers = request.data.get('answers', {})
        
        if not all([catalogue_id, topic_id, answers]):
            return Response(
                {'detail': 'catalogue_id, topic_id, and answers required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get progress
            progress = CatalogueProgress.objects.get(
                user=request.user,
                catalogue_id=catalogue_id
            )
            
            topic = Topic.objects.get(id=topic_id, catalogue_id=catalogue_id)
            questions = QuizQuestion.objects.filter(topic=topic).order_by('order')
            
            # Grade the quiz
            score = 0
            total_questions = questions.count()
            
            for question in questions:
                user_answer = answers.get(str(question.id))
                if user_answer and user_answer.strip().lower() == question.correct_answer.strip().lower():
                    score += 1
            
            # Calculate points (5 points per correct answer)
            points_earned = score * 5
            
            # Create quiz attempt record
            quiz_attempt = TopicQuizAttempt.objects.create(
                user=request.user,
                topic=topic,
                catalogue_progress=progress,
                answers=answers,
                score=score,
                total_questions=total_questions,
                points_earned=points_earned
            )
            
            # Update progress
            completed_topics = progress.completed_topics or []
            if str(topic_id) not in completed_topics:
                completed_topics.append(str(topic_id))
            
            # Update current topic index
            all_topics = list(topic.catalogue.topics.values_list('id', flat=True))
            next_index = min(progress.current_topic_index + 1, len(all_topics))
            
            # Calculate completion percentage
            completion_percent = (len(completed_topics) / len(all_topics)) * 100 if all_topics else 0
            
            # Add points to user
            request.user.points += points_earned
            request.user.save(update_fields=['points'])
            
            # Update progress
            progress.completed_topics = completed_topics
            progress.current_topic_index = next_index
            progress.points_earned += points_earned
            progress.completion_percent = completion_percent
            
            # Mark as completed if all topics done
            if completion_percent == 100:
                progress.completed_at = timezone.now()
            
            progress.save()

            # Sync to general progress for dashboard stats
            self._sync_progress_record(
                user=request.user,
                catalogue=topic.catalogue,
                completed_topics=completed_topics,
                current_topic_index=next_index,
                completion_percent=completion_percent,
                score_delta=score,
            )
            
            # Return quiz attempt with score
            serializer = TopicQuizAttemptSerializer(quiz_attempt)
            return Response(
                {
                    'quiz_attempt': serializer.data,
                    'progress': CatalogueProgressSerializer(progress).data,
                    'message': f"Quiz completed! You earned {points_earned} points."
                },
                status=status.HTTP_201_CREATED
            )
        
        except CatalogueProgress.DoesNotExist:
            return Response(
                {'detail': 'Progress not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Topic.DoesNotExist:
            return Response(
                {'detail': 'Topic not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def complete_topic(self, request):
        """
        Mark a topic as completed without a quiz.
        Expects: {
            'catalogue_id': 'uuid',
            'topic_id': 'uuid'
        }
        """
        catalogue_id = request.data.get('catalogue_id')
        topic_id = request.data.get('topic_id')

        if not all([catalogue_id, topic_id]):
            return Response(
                {'detail': 'catalogue_id and topic_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            progress = CatalogueProgress.objects.get(
                user=request.user,
                catalogue_id=catalogue_id
            )

            topic = Topic.objects.get(id=topic_id, catalogue_id=catalogue_id)

            completed_topics = progress.completed_topics or []
            if str(topic_id) not in completed_topics:
                completed_topics.append(str(topic_id))

            all_topics = list(topic.catalogue.topics.values_list('id', flat=True))
            next_index = min(progress.current_topic_index + 1, len(all_topics))
            completion_percent = (len(completed_topics) / len(all_topics)) * 100 if all_topics else 0

            progress.completed_topics = completed_topics
            progress.current_topic_index = next_index
            progress.completion_percent = completion_percent

            if completion_percent == 100:
                progress.completed_at = timezone.now()

            progress.save()

            # Sync to general progress for dashboard stats
            self._sync_progress_record(
                user=request.user,
                catalogue=topic.catalogue,
                completed_topics=completed_topics,
                current_topic_index=next_index,
                completion_percent=completion_percent,
                score_delta=0,
            )

            return Response(
                {
                    'progress': CatalogueProgressSerializer(progress).data,
                    'message': 'Topic marked as completed.'
                },
                status=status.HTTP_200_OK
            )

        except CatalogueProgress.DoesNotExist:
            return Response(
                {'detail': 'Progress not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Topic.DoesNotExist:
            return Response(
                {'detail': 'Topic not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _sync_progress_record(
        self,
        user,
        catalogue,
        completed_topics,
        current_topic_index,
        completion_percent,
        score_delta=0,
    ):
        progress_record, _ = Progress.objects.get_or_create(
            user=user,
            catalogue=catalogue,
        )
        progress_record.completed_subtopics = completed_topics
        progress_record.current_index = current_topic_index
        progress_record.completion_percent = completion_percent
        if score_delta:
            progress_record.score = (progress_record.score or 0) + score_delta
        progress_record.save()
