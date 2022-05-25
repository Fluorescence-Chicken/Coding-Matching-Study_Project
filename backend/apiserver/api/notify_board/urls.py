from django.urls import path, include
from rest_framework.routers import SimpleRouter

from . import views

notification_post_router = SimpleRouter()
notification_post_router.register(r'', views.NotifyBoardViews)

notification_comment_router = SimpleRouter()
notification_comment_router.register(r'', views.NotifyBoardCommentViews)

urlpatterns = [
    path(r'post/', include((notification_post_router.urls, 'api.notify_board'), namespace='notify_board')),
    path(r'comment/', include((notification_comment_router.urls, 'api.notify_board'), namespace='notify_board_comment')),
]
