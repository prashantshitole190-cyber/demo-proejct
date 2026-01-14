from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('following/', views.user_following, name='user-following'),
    path('export-bookmarks/', views.export_bookmarks, name='export-bookmarks'),
    path('report/', views.report_content, name='report-content'),
    path('<str:email>/', views.UserDetailView.as_view(), name='user-detail'),
    path('<str:email>/articles/', views.UserArticlesView.as_view(), name='user-articles'),
    path('<str:email>/follow/', views.follow_user, name='follow-user'),
    path('<str:email>/block/', views.block_user, name='block-user'),
]