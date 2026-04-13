from django.urls import path
from . import views

urlpatterns = [
    path('article/<slug:slug>/', views.CommentListCreateView.as_view(), name='article-comments'),
    path('<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('<int:pk>/like/', views.like_comment, name='comment-like'),
]