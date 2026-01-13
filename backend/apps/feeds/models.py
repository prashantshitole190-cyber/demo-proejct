from django.db import models
from django.contrib.auth import get_user_model
from apps.articles.models import Article

User = get_user_model()

class Feed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feeds')
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'article')

    def __str__(self):
        return f'Feed for {self.user.username}: {self.article.title}'
