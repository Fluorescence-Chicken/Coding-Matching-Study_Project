"""apiserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.template.defaulttags import url
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

from apiserver import settings


schema_url_patterns = [
    path('api/', include('api.urls')),
]

schema_view_v1 = get_schema_view(
    openapi.Info(
        title="Coding Study Matching platform - Backend API",
        default_version='api/',
        description="클라우드프로그래밍 팀프로젝트 과제에 사용한 백엔드 API 입니다.",
        terms_of_service="https://www.google.com/policies/terms/",
    ),
    public=True,
    permission_classes=(AllowAny,),
    patterns=schema_url_patterns,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path(r'swagger(?P<format>\.json|\.yaml)', schema_view_v1.without_ui(cache_timeout=0), name='schema-json'),
    path(r'swagger/', schema_view_v1.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path(r'redoc/', schema_view_v1.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

]

# add media url
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

