from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from apps.articles.models import Article
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer
from common.permissions import IsAuthorOrReadOnly

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        article_slug = self.kwargs.get('slug')
        return Comment.objects.filter(article__slug=article_slug, parent=None)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        article_slug = self.kwargs.get('slug')
        article = Article.objects.get(slug=article_slug)
        serializer.save(author=self.request.user, article=article)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]