from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Feed
from .serializers import FeedSerializer
from apps.articles.models import Article
from apps.users.models import Follow

class PersonalizedFeedView(generics.ListAPIView):
    serializer_class = FeedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get articles from followed users
        following_users = Follow.objects.filter(follower=user).values_list('following', flat=True)
        articles = Article.objects.filter(
            author__in=following_users,
            status='published'
        ).order_by('-created_at')
        
        # Create or get feed entries
        feeds = []
        for article in articles:
            feed, created = Feed.objects.get_or_create(
                user=user,
                article=article,
                defaults={'created_at': article.created_at}
            )
            feeds.append(feed)
        
        return Feed.objects.filter(user=user).order_by('-created_at')