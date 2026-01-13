from rest_framework import serializers
from .models import Article, Tag
from apps.users.serializers import UserSerializer

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ArticleSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'author', 'tags', 'tag_names',
                 'status', 'featured_image', 'read_time', 'views_count', 'created_at', 
                 'updated_at', 'published_at']
        read_only_fields = ['slug', 'views_count', 'published_at', 'read_time']

    def create(self, validated_data):
        tag_names = validated_data.pop('tag_names', [])
        article = Article.objects.create(**validated_data)
        
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(name=tag_name.lower())
            article.tags.add(tag)
        
        return article

class ArticleListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'excerpt', 'author', 'tags', 'featured_image',
                 'read_time', 'views_count', 'created_at', 'published_at']