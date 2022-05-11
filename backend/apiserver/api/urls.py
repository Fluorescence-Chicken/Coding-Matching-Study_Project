from django.urls import path, include

from api import views

urlpatterns = [
    # User signup API URLs
    path('signup/', views.UserCreateView.as_view(), name='signup'),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
]
