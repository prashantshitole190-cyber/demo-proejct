from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Follow
import re

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        
        has_letter = bool(re.search(r'[a-zA-Z]', value))
        has_number_or_special = bool(re.search(r'[\d!@#$%^&*(),.?":{}|<>]', value))
        
        if not has_letter:
            raise serializers.ValidationError("Password must contain at least one letter")
        if not has_number_or_special:
            raise serializers.ValidationError("Password must contain at least one number or special character")
            
        return value

    def create(self, validated_data):
        # Use email as username
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'avatar', 
                 'website', 'twitter', 'linkedin', 'github', 'followers_count', 'following_count']
    
    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()
    
    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'bio', 'website', 'twitter', 'linkedin', 'github']
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AvatarUpdateSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=True)
    
    class Meta:
        model = User
        fields = ['avatar']
        
    def update(self, instance, validated_data):
        instance.avatar = validated_data['avatar']
        instance.save()
        return instance