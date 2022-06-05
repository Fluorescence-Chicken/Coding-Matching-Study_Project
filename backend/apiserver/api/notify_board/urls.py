from django.urls import path, include
from rest_framework.routers import SimpleRouter

from . import views

notification_post_router = SimpleRouter()
notification_post_router.register(r'', views.NotifyBoardViews)

notification_comment_router = SimpleRouter()
notification_comment_router.register(r'', views.NotifyBoardCommentViews)

qna_post_router = SimpleRouter()
qna_post_router.register(r'', views.QnaBoardViews)

qna_comment_router = SimpleRouter()
qna_comment_router.register(r'', views.QnaBoardCommentViews)

urlpatterns = [
    path(r'post/', include((notification_post_router.urls, 'api.notify_board'), namespace='notify_board')),
    path(r'comment/', include((notification_comment_router.urls, 'api.notify_board'), namespace='notify_board_comment')),
    path(r'qna/', include((qna_post_router.urls, 'api.notify_board'), namespace='qna_board')),
    path(r'qna_comment/', include((qna_comment_router.urls, 'api.notify_board'), namespace='qna_board_comment')),
]
