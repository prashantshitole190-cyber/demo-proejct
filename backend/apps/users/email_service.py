from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_password_reset_email(user, reset_url):
    """Send password reset email to user"""
    subject = 'Reset Your Password - Medium Clone'
    
    message = f"""
Hello {user.username},

We received a request to reset your password for your Medium Clone account.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

© 2024 Medium Clone. All rights reserved.
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Password reset email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        print(f"Email error: {e}")
        return False

def send_welcome_email(user):
    """Send welcome email to new user"""
    subject = 'Welcome to Medium Clone!'
    
    message = f"""
Hello {user.username}!

Thank you for joining Medium Clone. We're excited to have you as part of our community.

You can now:
- Write and publish your stories
- Follow other writers
- Engage with content through claps and comments
- Build your reading list

Start your writing journey today!

© 2024 Medium Clone. All rights reserved.
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Welcome email sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email to {user.email}: {str(e)}")
        print(f"Welcome email error: {e}")
        return False