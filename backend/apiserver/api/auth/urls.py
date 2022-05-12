from django.urls import path

from dj_rest_auth import views as auth_views
from . import views
# Url pattern for auth API

urlpatterns = [
    # Login
    path('login/', auth_views.LoginView.as_view(), name='rest_login'),
    # Logout
    path('logout/', auth_views.LogoutView.as_view(), name='rest_logout'),
    # Social login


]