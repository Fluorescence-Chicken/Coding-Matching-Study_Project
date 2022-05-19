from pytz import unicode
from rest_framework import status, permissions, exceptions, parsers, renderers
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
import requests as http_request
from rest_framework.views import APIView

from api.models import User
from . import serializers
from config import constants
from enum import Enum

class TokenProvider(Enum):
    GOOGLE = 'google'
    KAKAO = 'kakao'


class SocialLoginView(GenericAPIView):
    """
    API Endpoint for social login.
    """
    permission_classes = [permissions.AllowAny,]


class TokenLoginView(APIView):
    """
    API Endpoint for token login.
    """
    permission_classes = [permissions.AllowAny,]

    def post(self, request: Request, *args, **kwargs):
        """
        Validate the user's login request and return data
        """
        serializer = serializers.TokenAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': unicode(token.key),
        })
