from django.utils import timezone
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .models import Article, Tag
from .serializers import ArticleSerializer, ArticleListSerializer, TagSerializer

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.filter(status='published')
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ArticleListSerializer
        return ArticleSerializer
    
    def get_queryset(self):
        return Article.objects.filter(status='published').order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method == 'GET':
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def publish_article(request, slug):
    try:
        article = Article.objects.get(slug=slug, author=request.user)
        article.status = 'published'
        article.published_at = timezone.now()
        article.save()
        return Response({'message': 'Article published successfully'})
    except Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stories(request):
    status_filter = request.GET.get('status', 'all')
    articles = Article.objects.filter(author=request.user)
    
    if status_filter != 'all':
        articles = articles.filter(status=status_filter)
    
    serializer = ArticleListSerializer(articles, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_articles(request):
    query = request.GET.get('q', '')
    if not query:
        return Response([])
    
    articles = Article.objects.filter(
        Q(title__icontains=query) | Q(content__icontains=query) | Q(excerpt__icontains=query),
        status='published'
    ).order_by('-created_at')
    
    serializer = ArticleListSerializer(articles, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def schedule_article(request, slug):
    try:
        article = Article.objects.get(slug=slug, author=request.user)
        scheduled_at = request.data.get('scheduled_at')
        
        if not scheduled_at:
            return Response({'error': 'scheduled_at is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        article.status = 'scheduled'
        article.scheduled_at = scheduled_at
        article.save()
        return Response({'message': 'Article scheduled successfully'})
    except Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)