from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from apps.articles.models import Article
from .models import Comment, CommentLike
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
        comment = serializer.save(author=self.request.user, article=article)
        
        # Create notification for article author
        if article.author != self.request.user:
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=article.author,
                sender=self.request.user,
                notification_type='comment',
                message=f'{self.request.user.username} commented on your article',
                article=article
            )

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def like_comment(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
        
        if request.method == 'POST':
            like, created = CommentLike.objects.get_or_create(
                user=request.user,
                comment=comment
            )
            if created:
                comment.likes_count += 1
                comment.save()
            return Response({'liked': True, 'likes_count': comment.likes_count})
        
        elif request.method == 'DELETE':
            CommentLike.objects.filter(user=request.user, comment=comment).delete()
            comment.likes_count = max(0, comment.likes_count - 1)
            comment.save()
            return Response({'liked': False, 'likes_count': comment.likes_count})
            
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)