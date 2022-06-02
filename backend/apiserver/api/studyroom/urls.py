from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

studyroom_router = SimpleRouter()
studyroom_router.register(r'', views.StudyRoomView)

tag_router = SimpleRouter()
tag_router.register(r'', views.TagView)

stack_router = SimpleRouter()
stack_router.register(r'', views.TechnologyStackViews)

posts_router = SimpleRouter()
posts_router.register(r'', views.StudyroomPostViews)

schedule_router = SimpleRouter()
schedule_router.register(r'', views.StudyroomScheduleView)

urlpatterns = [
    path(r'studyroom/', include((studyroom_router.urls, 'api.studyroom'), namespace='studyroom')),
    path(r'tag/', include((tag_router.urls, 'api.studyroom'), namespace='tag')),
    path(r'stack/', include((stack_router.urls, 'api.studyroom'), namespace='technology_stack')),
    path(r'register/studyroom/<int:pk>', views.StudyRoomSignupView.as_view(), name='studyroom_signup'),
    path(r'posts/', include((posts_router.urls, 'api.studyroom'), namespace='posts')),
    path(r'schedule/', include((schedule_router.urls, 'api.studyroom'), namespace='schedule')),
]
