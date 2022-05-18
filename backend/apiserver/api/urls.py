from django.urls import path, include
from rest_framework import routers
from api import views

router = routers.SimpleRouter()
router.register(r'user', views.NormalUserManageView, basename='api')

urlpatterns = [
    # User signup API URLs
    path('signup/', views.UserCreateView.as_view(), name='signup'),
    path('auth/', include('api.auth.urls')),
    path('me/', views.RetriveSelfDataView.as_view(), name='me'),
]

urlpatterns += router.urls
