from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from .serializers import UserRegistrationSerializer, UserSerializer, UserUpdateSerializer, FacultySerializer, DepartmentSerializer
from .faculty_models import Faculty, Department
from .models import User


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
