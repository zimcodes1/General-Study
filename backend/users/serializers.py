from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'school', 
                  'department', 'degree_level', 'current_level', 'courses']
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'school', 'department', 
                  'degree_level', 'current_level', 'courses', 'points', 'streak', 
                  'last_active_date', 'created_at']
        read_only_fields = ['id', 'points', 'streak', 'last_active_date', 'created_at']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone', 'school', 'department', 
                  'degree_level', 'current_level', 'courses']
