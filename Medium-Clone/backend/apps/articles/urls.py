from django.urls import path
from . import views

urlpatterns = [
    path('', views.ArticleListCreateView.as_view(), name='article-list-create'),
    path('tags/', views.TagListView.as_view(), name='tag-list'),
    path('user/stories/', views.user_stories, name='user-stories'),
    path('search/', views.search_articles, name='search-articles'),
    path('<slug:slug>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('<slug:slug>/publish/', views.publish_article, name='publish-article'),
    path('<slug:slug>/schedule/', views.schedule_article, name='schedule-article'),
]