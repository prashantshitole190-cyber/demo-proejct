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

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        # Check if request contains avatar file
        elif 'avatar' in self.request.FILES:
            return AvatarUpdateSerializer
        else:
            return UserUpdateSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            # Return full user data with counts
            return Response(UserSerializer(instance).data)
        else:
            print("Profile update errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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