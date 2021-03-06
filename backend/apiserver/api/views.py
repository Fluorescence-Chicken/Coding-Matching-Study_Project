from django.shortcuts import render
from rest_framework import generics, permissions, mixins, status, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action

from api.models import User
from api.serializers import UserSerializer, UserWithoutPasswordSerializer
from config.permissions import AllowGetOnly


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
    permission_classes = [AllowGetOnly, ]
    serializer_class = UserWithoutPasswordSerializer
    queryset = User.objects.all()

    def partial_update(self, request, *args, **kwargs):
        """
        Update the user's profile.
        This endpoint is available only to the user himself and admin.
        """
        user = self.get_queryset().filter(id=kwargs['pk']).first()
        if user != request.user or not user.is_admin:
            return Response(status=status.HTTP_403_FORBIDDEN, data={'detail': 'You are not allowed to update this user.'})
        # check user's password is valid to request's password
        # NullCheck password
        if user == request.user and request.data.get('password') is None:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'detail': 'Password is required.'})
        if user == request.user and not user.check_password(request.data['password']):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'password': 'Invalid password'})
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
        data = self.serializer_class(get_object_or_404(User, id=kwargs['pk'])).data
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
