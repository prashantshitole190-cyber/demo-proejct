from rest_framework import serializers
from .models import Feed
from apps.articles.serializers import ArticleListSerializer

class FeedSerializer(serializers.ModelSerializer):
    article = ArticleListSerializer(read_only=True)

    class Meta:
        model = Feed
        fields = ['id', 'article', 'created_at']