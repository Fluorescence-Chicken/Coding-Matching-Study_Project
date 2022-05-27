from django.shortcuts import render
from rest_framework import generics, permissions, mixins, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action

from api.models import User
from api.serializers import UserSerializer, UserWithoutPasswordSerializer


class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    """Create a new user in the system"""
    serializer_class = UserSerializer
    queryset = User.objects.all()


class UserUploadProfileImageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        user = request.user
        user.profile_image = request.FILES['profile_image']
        user.save()
        return Response(status=status.HTTP_200_OK)


class NormalUserManageView(viewsets.GenericViewSet,
                           mixins.RetrieveModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin):
    """
    Manage the user's profile.
    This endpoint is available only to the user himself except retrieve.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserWithoutPasswordSerializer
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        """
        Update the user's profile.
        This endpoint is available only to the user himself.
        """
        user = self.get_object()
        if user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Delete the user's profile.
        This endpoint is available only to the user himself.
        """
        user = self.get_object()
        if user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        # First delete the current session
        request.user.auth_token.delete()
        # and then delete the user
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """
        Get the user's profile.
        This endpoint is available to all users.
        """
        data = self.serializer_class(request.user).data
        return Response(data)


class RetrieveSelfDataView(APIView):
    """
    Check if the user is authenticated
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserWithoutPasswordSerializer

    def get(self, request: Request) -> Response:
        """
        Get the user's self data.
        """
        data = self.serializer_class(request.user).data
        return Response(data)
