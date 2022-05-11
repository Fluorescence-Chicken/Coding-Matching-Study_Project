from django.shortcuts import render
from rest_framework import generics, permissions

from api.models import User
from api.serializers import UserSerializer


class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    """Create a new user in the system"""
    serializer_class = UserSerializer
    queryset = User.objects.all()
