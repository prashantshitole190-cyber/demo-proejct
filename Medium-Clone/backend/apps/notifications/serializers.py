from rest_framework import serializers
from .models import Notification
from apps.users.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'notification_type', 'message', 'article', 'comment', 'is_read', 'created_at']