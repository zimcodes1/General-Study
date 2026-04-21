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


# ──────────────────────────────────────────────
# Admin User Management
# ──────────────────────────────────────────────

def _require_staff(request):
    if not request.user.is_staff:
        return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
    return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_user_list(request):
    """
    Paginated list of all users with optional search and status filter.
    Query params: search, status (all|active|disabled), limit, offset
    """
    err = _require_staff(request)
    if err:
        return err

    search = request.query_params.get('search', '').strip()
    filter_status = request.query_params.get('status', 'all')
    limit = int(request.query_params.get('limit', 20))
    offset = int(request.query_params.get('offset', 0))

    queryset = User.objects.select_related('faculty', 'department').order_by('-created_at')

    if filter_status == 'active':
        queryset = queryset.filter(is_active=True)
    elif filter_status == 'disabled':
        queryset = queryset.filter(is_active=False)

    if search:
        queryset = queryset.filter(
            Q(full_name__icontains=search) | Q(email__icontains=search)
        )

    total_count = queryset.count()
    paginated = queryset[offset: offset + limit]

    data = [
        {
            'id': str(u.id),
            'full_name': u.full_name,
            'email': u.email,
            'department': u.department.name if u.department else '',
            'faculty': u.faculty.name if u.faculty else '',
            'degree_level': u.degree_level,
            'current_level': u.current_level,
            'status': 'active' if u.is_active else 'disabled',
            'joined': u.created_at.strftime('%-d %b, %Y'),
            'last_active': u.last_active_date.strftime('%-d %b, %Y') if u.last_active_date else None,
        }
        for u in paginated
    ]

    return Response(
        {'count': total_count, 'limit': limit, 'offset': offset, 'results': data},
        status=status.HTTP_200_OK,
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_disable_user(request, user_id):
    """Disable (deactivate) a user account."""
    err = _require_staff(request)
    if err:
        return err

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    user.is_active = False
    user.save(update_fields=['is_active'])
    return Response({'detail': f'User {user.full_name} disabled.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_enable_user(request, user_id):
    """Re-enable a user account."""
    err = _require_staff(request)
    if err:
        return err

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    user.is_active = True
    user.save(update_fields=['is_active'])
    return Response({'detail': f'User {user.full_name} enabled.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_user_analytics(request):
    """
    Return user analytics:
    - Total, active (last 30 days), new this week
    - Weekly signups for the last 8 weeks
    - Breakdown by degree level
    """
    err = _require_staff(request)
    if err:
        return err

    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)
    week_start = now - timedelta(days=7)

    total_users = User.objects.count()
    active_users = User.objects.filter(last_active_date__gte=thirty_days_ago.date()).count()
    new_this_week = User.objects.filter(created_at__gte=week_start).count()

    # Weekly signups — last 8 weeks
    weekly_signups = []
    for i in range(7, -1, -1):
        ws = now - timedelta(weeks=i + 1)
        we = now - timedelta(weeks=i)
        count = User.objects.filter(created_at__gte=ws, created_at__lt=we).count()
        weekly_signups.append({'week': ws.strftime('%-d %b'), 'count': count})

    # Degree level breakdown
    degree_counts = (
        User.objects.values('degree_level')
        .annotate(count=Count('id'))
        .order_by('degree_level')
    )
    degree_breakdown = {item['degree_level']: item['count'] for item in degree_counts}

    return Response(
        {
            'total_users': total_users,
            'active_users': active_users,
            'new_this_week': new_this_week,
            'weekly_signups': weekly_signups,
            'degree_breakdown': degree_breakdown,
        },
        status=status.HTTP_200_OK,
    )
