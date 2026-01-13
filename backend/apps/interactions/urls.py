from django.urls import path
from . import views

urlpatterns = [
    path('clap/<slug:slug>/', views.clap_article, name='clap-article'),
    path('clap/<slug:slug>/status/', views.clap_status, name='clap-status'),
    path('bookmark/<slug:slug>/', views.bookmark_article, name='bookmark-article'),
    path('bookmark/<slug:slug>/status/', views.bookmark_status, name='bookmark-status'),
    path('saved/', views.saved_articles, name='saved-articles'),
]