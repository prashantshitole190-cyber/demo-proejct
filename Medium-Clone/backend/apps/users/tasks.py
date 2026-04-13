from celery import shared_task
from django.contrib.auth import get_user_model
from .email_service import send_password_reset_email, send_welcome_email

User = get_user_model()

@shared_task
def send_password_reset_email_task(user_id, reset_url):
    """Send password reset email asynchronously"""
    try:
        user = User.objects.get(id=user_id)
        return send_password_reset_email(user, reset_url)
    except User.DoesNotExist:
        return False

@shared_task
def send_welcome_email_task(user_id):
    """Send welcome email asynchronously"""
    try:
        user = User.objects.get(id=user_id)
        return send_welcome_email(user)
    except User.DoesNotExist:
        return False