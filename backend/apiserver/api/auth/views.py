from rest_framework import status, permissions, exceptions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
import requests as http_request

from api.models import User
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

