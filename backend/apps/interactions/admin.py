from django.contrib import admin
from .models import Clap, Bookmark

@admin.register(Clap)
class ClapAdmin(admin.ModelAdmin):
    list_display = ['user', 'article', 'count', 'created_at']
    list_filter = ['created_at']

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'article', 'created_at']
    list_filter = ['created_at']