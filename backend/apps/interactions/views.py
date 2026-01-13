from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.articles.models import Article
from .models import Clap, Bookmark

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clap_article(request, slug):
    print(f"Clap request received for slug: {slug}, user: {request.user}")
    try:
        article = Article.objects.get(slug=slug)
        print(f"Article found: {article.title}")
        clap, created = Clap.objects.get_or_create(
            user=request.user, 
            article=article,
            defaults={'count': 1}
        )
        if not created and clap.count < 50:
            clap.count += 1
            clap.save()
        
        # Create notification
        if article.author != request.user:
            try:
                from apps.notifications.models import Notification
                notification = Notification.objects.create(
                    recipient=article.author,
                    sender=request.user,
                    notification_type='like',
                    message=f'{request.user.username} clapped your article: {article.title}',
                    article=article
                )
                print(f"Notification created: ID={notification.id} for {article.author.username}")
            except Exception as e:
                print(f"Error creating notification: {e}")
        
        print(f"Clap successful: count={clap.count}, created={created}")
        return Response({'claps': clap.count, 'message': 'Clapped successfully'})
    except Article.DoesNotExist:
        print(f"Article not found for slug: {slug}")
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in clap_article: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def bookmark_article(request, slug):
    print(f"Bookmark request received for slug: {slug}, user: {request.user}, method: {request.method}")
    try:
        article = Article.objects.get(slug=slug)
        print(f"Article found: {article.title}")
        
        if request.method == 'POST':
            bookmark, created = Bookmark.objects.get_or_create(
                user=request.user, 
                article=article
            )
            print(f"Bookmark successful: created={created}")
            return Response({'bookmarked': True, 'message': 'Bookmarked successfully'})
        
        elif request.method == 'DELETE':
            deleted_count = Bookmark.objects.filter(user=request.user, article=article).delete()[0]
            print(f"Bookmark removed: deleted_count={deleted_count}")
            return Response({'bookmarked': False, 'message': 'Bookmark removed'})
            
    except Article.DoesNotExist:
        print(f"Article not found for slug: {slug}")
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in bookmark_article: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def clap_status(request, slug):
    try:
        article = Article.objects.get(slug=slug)
        clap = Clap.objects.filter(user=request.user, article=article).first()
        return Response({'count': clap.count if clap else 0})
    except Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookmark_status(request, slug):
    try:
        article = Article.objects.get(slug=slug)
        bookmarked = Bookmark.objects.filter(user=request.user, article=article).exists()
        return Response({'bookmarked': bookmarked})
    except Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_articles(request):
    try:
        bookmarks = Bookmark.objects.filter(user=request.user).order_by('-created_at')
        articles = [bookmark.article for bookmark in bookmarks]
        from apps.articles.serializers import ArticleListSerializer
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)