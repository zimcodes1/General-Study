from rest_framework import serializers
from .models import User
from .faculty_models import Faculty, Department

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    faculty_id = serializers.UUIDField(source='faculty.id', read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'faculty_id', 'faculty_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    faculty_id = serializers.UUIDField(write_only=True)
    department_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'school', 
                  'faculty_id', 'department_id', 'degree_level', 'current_level', 'courses']
    
    def create(self, validated_data):
        faculty_id = validated_data.pop('faculty_id')
        department_id = validated_data.pop('department_id')
        
        faculty = Faculty.objects.get(id=faculty_id)
        department = Department.objects.get(id=department_id)
        
        user = User.objects.create_user(
            **validated_data,
            faculty=faculty,
            department=department
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'school', 'faculty', 'department', 
                  'degree_level', 'current_level', 'courses', 'points', 'streak', 
                  'last_active_date', 'created_at']
        read_only_fields = ['id', 'points', 'streak', 'last_active_date', 'created_at']

class UserUpdateSerializer(serializers.ModelSerializer):
    faculty_id = serializers.UUIDField(write_only=True, required=False)
    department_id = serializers.UUIDField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'school', 'faculty_id', 'department_id',
                  'degree_level', 'current_level', 'courses']
    
    def update(self, instance, validated_data):
        faculty_id = validated_data.pop('faculty_id', None)
        department_id = validated_data.pop('department_id', None)
        
        if faculty_id:
            instance.faculty = Faculty.objects.get(id=faculty_id)
        if department_id:
            instance.department = Department.objects.get(id=department_id)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
