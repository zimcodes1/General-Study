from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count, Q
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer, FacultySerializer, DepartmentSerializer
from .faculty_models import Faculty, Department
from .models import User
from progress.models import Progress
from resources.models import Resource
from resources.serializers import ResourceListSerializer


def update_user_streak(user):
    """
    Update user's streak based on login activity.
    
    Streak Logic:
    - If last_active_date is None (never active before): Set streak to 1
    - If last_active_date is today: Don't change streak (already counted)
    - If last_active_date is yesterday: Increment streak (consecutive days)
    - If last_active_date > 1 day ago: Reset streak to 1 (streak broken)
    - Always update last_active_date to today
    
    Args:
        user: User instance to update
    """
    today = timezone.now().date()
    
    if user.last_active_date is None:
        # First login ever
        user.streak = 1
        user.last_active_date = today
    elif user.last_active_date < today:
        # User logged in on a different day
        yesterday = today - timedelta(days=1)
        
        if user.last_active_date == yesterday:
            # Consecutive day - increment streak
            user.streak += 1
        else:
            # Streak was broken - reset to 1
            user.streak = 1
        
        user.last_active_date = today
    # else: same day login, don't change streak or last_active_date
    
    return user

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    from django.contrib.auth import authenticate
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=email, password=password)
    
    if user:
        # Update streak on login
        user = update_user_streak(user)
        user.save(update_fields=['streak', 'last_active_date'])
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response({'error': 'Invalid credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_faculties(request):
    faculties = Faculty.objects.all()
    serializer = FacultySerializer(faculties, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_departments(request):
    faculty_id = request.query_params.get('faculty_id')
    if faculty_id:
        departments = Department.objects.filter(faculty_id=faculty_id)
    else:
        departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get dashboard statistics for the current user.
    Returns: active_catalogues, total_points, avg_score, completed_count
    """
    user = request.user
    
    # Get user's progress records
    progress_queryset = Progress.objects.filter(user=user)
    
    # Active Catalogues: count of progress records with completion < 100
    active_catalogues = progress_queryset.filter(completion_percent__lt=100).count()
    
    # Completed: count of progress records with completion >= 100
    completed_count = progress_queryset.filter(completion_percent__gte=100).count()
    
    # Average Score: average of all scores
    avg_score_result = progress_queryset.aggregate(avg_score=Avg('score'))
    avg_score = int(avg_score_result['avg_score'] or 0)
    
    # Total Points: user's accumulated points
    total_points = user.points
    
    return Response({
        'active_catalogues': active_catalogues,
        'total_points': total_points,
        'avg_score': avg_score,
        'completed': completed_count,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_resources(request):
    """
    Get resources recommended for the user based on their faculty.
    Only returns high-rated approved resources (rating >= 4.0).
    Query params: limit (default 3), offset (default 0)
    """
    user = request.user
    limit = int(request.query_params.get('limit', 3))
    offset = int(request.query_params.get('offset', 0))
    
    # If user has a faculty, get resources from their faculty with high ratings
    if user.faculty:
        resources = Resource.objects.filter(
            faculty=user.faculty,
            status='approved',
            rating_avg__gte=4.0
        ).order_by('-rating_avg', '-created_at')
    else:
        # If no faculty, get top-rated resources from any faculty
        resources = Resource.objects.filter(
            status='approved',
            rating_avg__gte=4.0
        ).order_by('-rating_avg', '-created_at')
    
    total_count = resources.count()
    paginated_resources = resources[offset:offset + limit]
    
    serializer = ResourceListSerializer(paginated_resources, many=True)
    
    return Response({
        'count': total_count,
        'limit': limit,
        'offset': offset,
        'results': serializer.data
    }, status=status.HTTP_200_OK)
