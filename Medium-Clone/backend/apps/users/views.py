from django.contrib.auth import authenticate
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User, Follow, PasswordResetToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, UserUpdateSerializer, AvatarUpdateSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
    except:
        pass
    return Response({'message': 'Logged out successfully'})

class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        
        # Handle avatar separately if present
        if 'avatar' in request.FILES:
            instance.avatar = request.FILES['avatar']
            instance.save()
        
        # Update other fields
        for field in ['first_name', 'last_name', 'bio', 'website', 'twitter', 'linkedin', 'github']:
            if field in request.data:
                setattr(instance, field, request.data[field])
        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'email'
    
    def get_object(self):
        email = self.kwargs['email']
        return User.objects.get(email=email)

class UserArticlesView(generics.ListAPIView):
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        from apps.articles.serializers import ArticleListSerializer
        return ArticleListSerializer
    
    def get_queryset(self):
        from apps.articles.models import Article
        email = self.kwargs['email']
        user = User.objects.get(email=email)
        return Article.objects.filter(author=user, status='published').order_by('-created_at')

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def follow_user(request, email):
    try:
        user_to_follow = User.objects.get(email=email)
        
        if request.method == 'POST':
            follow, created = Follow.objects.get_or_create(
                follower=request.user,
                following=user_to_follow
            )
            if created:
                # Create notification
                from apps.notifications.models import Notification
                notification = Notification.objects.create(
                    recipient=user_to_follow,
                    sender=request.user,
                    notification_type='follow',
                    message=f'{request.user.username} started following you'
                )
                print(f"Follow notification created: ID={notification.id} for {user_to_follow.username}")
                
            return Response({'following': True})
        
        elif request.method == 'DELETE':
            Follow.objects.filter(
                follower=request.user,
                following=user_to_follow
            ).delete()
            
            return Response({'following': False})
            
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_following(request):
    following_users = User.objects.filter(
        id__in=Follow.objects.filter(follower=request.user).values_list('following_id', flat=True)
    )
    serializer = UserSerializer(following_users, many=True)
    return Response(serializer.data)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def block_user(request, email):
    try:
        user_to_block = User.objects.get(email=email)
        
        if user_to_block == request.user:
            return Response({'error': 'Cannot block yourself'}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == 'POST':
            from .models import Block
            block, created = Block.objects.get_or_create(
                blocker=request.user,
                blocked=user_to_block
            )
            return Response({'blocked': True})
        
        elif request.method == 'DELETE':
            from .models import Block
            Block.objects.filter(blocker=request.user, blocked=user_to_block).delete()
            return Response({'blocked': False})
            
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def report_content(request):
    from .models import Report
    
    report_type = request.data.get('report_type')
    description = request.data.get('description')
    reported_user_email = request.data.get('reported_user')
    article_slug = request.data.get('article')
    comment_id = request.data.get('comment')
    
    report_data = {
        'reporter': request.user,
        'report_type': report_type,
        'description': description,
    }
    
    if reported_user_email:
        try:
            report_data['reported_user'] = User.objects.get(email=reported_user_email)
        except User.DoesNotExist:
            pass
    
    if article_slug:
        from apps.articles.models import Article
        try:
            report_data['article'] = Article.objects.get(slug=article_slug)
        except Article.DoesNotExist:
            pass
    
    if comment_id:
        from apps.comments.models import Comment
        try:
            report_data['comment'] = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            pass
    
    report = Report.objects.create(**report_data)
    return Response({'message': 'Report submitted successfully', 'id': report.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_bookmarks(request):
    from apps.interactions.models import Bookmark
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('article')
    
    data = []
    for bookmark in bookmarks:
        data.append({
            'title': bookmark.article.title,
            'url': f'/article/{bookmark.article.slug}',
            'author': bookmark.article.author.username,
            'notes': bookmark.notes,
            'bookmarked_at': bookmark.created_at.isoformat(),
        })
    
    return Response({'bookmarks': data, 'count': len(data)})
