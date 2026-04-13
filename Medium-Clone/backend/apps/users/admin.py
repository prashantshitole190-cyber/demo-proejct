from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Follow

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'get_followers_count', 'get_following_count']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['email']
    
    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()
    get_followers_count.short_description = 'Followers'
    
    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()
    get_following_count.short_description = 'Following'

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['follower', 'following', 'created_at']
    list_filter = ['created_at']
    search_fields = ['follower__username', 'following__username']