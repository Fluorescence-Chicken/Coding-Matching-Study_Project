from django.urls import path

from dj_rest_auth import views as auth_views
from rest_framework.authtoken import views as rest_framework_token_views
from . import views
# Url pattern for auth API

urlpatterns = [
    path('login/', views.TokenLoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    # Social login


]