from django.urls import path
from . import views

urlpatterns = [
    path('', views.PersonalizedFeedView.as_view(), name='personalized-feed'),
]
