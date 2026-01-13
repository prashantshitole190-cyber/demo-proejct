from celery import shared_task
from .models import Notification
from apps.users.models import User, Follow
from apps.articles.models import Article

@shared_task
def create_follow_notification(follower_id, following_id):
    try:
        follower = User.objects.get(id=follower_id)
        following = User.objects.get(id=following_id)
        
        Notification.objects.create(
            recipient=following,
            sender=follower,
            notification_type='follow',
            message=f'{follower.username} started following you'
        )
    except User.DoesNotExist:
        pass

@shared_task
def create_article_notification(article_id):
    try:
        article = Article.objects.get(id=article_id)
        followers = Follow.objects.filter(following=article.author)
        
        for follow in followers:
            Notification.objects.create(
                recipient=follow.follower,
                sender=article.author,
                notification_type='article',
                message=f'{article.author.username} published a new article: {article.title}',
                article=article
            )
    except Article.DoesNotExist:
        pass

@shared_task
def create_comment_notification(comment_id):
    from apps.comments.models import Comment
    try:
        comment = Comment.objects.get(id=comment_id)
        
        if comment.author != comment.article.author:
            Notification.objects.create(
                recipient=comment.article.author,
                sender=comment.author,
                notification_type='comment',
                message=f'{comment.author.username} commented on your article: {comment.article.title}',
                article=comment.article,
                comment=comment
            )
    except Comment.DoesNotExist:
        pass