from django.urls import path, include
from rest_framework.routers import SimpleRouter

from api.ticket import views

userticket_router = SimpleRouter()
userticket_router.register(r'', views.ReportUserTicketViews)

urlpatterns = [
    path(r'user/', include((userticket_router.urls, 'api.ticket'), namespace='userticket')),
]