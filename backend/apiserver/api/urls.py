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
    path('board/', include('api.studyroom.urls')),
    path('profile_image/', views.UserUploadProfileImageView.as_view(), name='profile_image'),
    path('notify_board/', include('api.notify_board.urls'), name='notify_board'),
]

urlpatterns += router.urls
