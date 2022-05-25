from django.shortcuts import render
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.studyroom.models import StudyRoom, Tag
from api.studyroom.serializers import StudyRoomSerializer, TagSerializer
from config import permissions as custom_permissions


class StudyRoomView(viewsets.GenericViewSet,
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.ListModelMixin):
    """
    View class that represents StudyRoom model.
    Create, list, retrieve, delete StudyRoom objects.
    """
    # viewset variables
    queryset = StudyRoom.objects.all()
    serializer_class = StudyRoomSerializer
    permission_classes = [custom_permissions.AllowGetOnly]

    def get_queryset(self):
        """
        Get queryset of StudyRoom objects.
        """
        return StudyRoom.objects.all()

    # this endpoint is available to all users include non-authenticated users
    def list(self, request: Request, *args, **kwargs):
        """
        List all StudyRoom objects.
        """
        # Get query string parameters
        query_params = request.query_params
        # Get all StudyRoom objects
        study_rooms = self.get_queryset()
        # Filter StudyRoom objects by query string parameters
        study_rooms = study_rooms.filter(
            name__icontains=query_params.get('name', ''),
            mentor__username__contains=query_params.get('mentor', ''),
            description__icontains=query_params.get('description', ''),
        )
        # if tag is specified, filter by tag
        for tag_id in query_params.getlist('tag_and[]'):
            study_rooms = study_rooms.filter(tags__id=tag_id)
        if query_params.getlist('tag_or[]', None):
            study_rooms = study_rooms.filter(tags__id__in=query_params.getlist('tag_or[]'))
        # increase the count of search_count on Tag model for each tag element
        # duplicated search is deleted
        for tag_id in list(dict.fromkeys(query_params.getlist('tag_and[]') + query_params.getlist('tag_or[]'))):
            tag = Tag.objects.get(id=tag_id)
            tag.search_count += 1
            tag.save()
        # Serialize StudyRoom objects
        serializer = self.get_serializer(study_rooms, many=True)
        return Response(serializer.data)

    # this endpoint is available to all users include non-authenticated users
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a StudyRoom object.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # this endpoint is only allowed to users who have 'is_mentor' permission
    # this api uses StudyRoomCreateSerializer to validate request data
    def create(self, request, *args, **kwargs):
        """
        Create a StudyRoom object.
        """
        # check if user is mentor
        if not request.user.is_mentor:
            return Response(status=403, data={'detail': 'You are not allowed to create StudyRoom objects.'})
        # extract data from request
        data = request.data
        # mentor field is user who requested the StudyRoom object creation
        data['mentor'] = request.user.id
        # name field is required
        if 'name' not in data:
            return Response(status=400, data={'detail': 'Name field is required.'})
        data['name'] = data['name']
        # enter mentor to the StudyRoom object's users field
        data['users'] = [request.user.id]
        # create StudyRoom object
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # this endpoint is only allowed to users who have 'is_admin' permission
    def destroy(self, request, *args, **kwargs):
        """
        Delete a StudyRoom object.
        """
        # check if user is admin
        if not request.user.is_admin:
            return Response(status=403, data={'detail': 'You are not allowed to delete StudyRoom objects.'})
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


# API endpoint for signup to studyroom
class StudyRoomSignupView(APIView):
    """
    View class that handles signup to studyroom.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        """
        Signup to studyroom.
        """
        # get StudyRoom object from id of path variable
        study_room = get_object_or_404(StudyRoom, id=kwargs['pk'])
        # check if user already signed up
        if request.user.id in study_room.users.all():
            return Response(status=400, data={'detail': 'You have already signed up to this study room.'})
        # add user to StudyRoom object's users field
        study_room.users.add(request.user.id)
        return Response(status=status.HTTP_201_CREATED, data={'detail': 'You have successfully signed up to this study room.'})


class TagView(viewsets.GenericViewSet,
              mixins.CreateModelMixin,
              mixins.DestroyModelMixin,
              mixins.RetrieveModelMixin,
              mixins.ListModelMixin):
    """
    View class that represents Tag model
    Create, delete, Retrieve, List is supported.
    """
    # viewset variables
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [custom_permissions.AllowGetOnly]

    def get_queryset(self):
        """
        Get queryset of Tag objects.
        """
        return Tag.objects.all()

    # this endpoint is available to all users include non-authenticated users
    def list(self, request: Request, *args, **kwargs):
        """
        List all Tag objects.
        """
        # Get query string parameters
        query_params = request.query_params
        # Get all Tag objects
        tags = self.get_queryset()
        # Filter Tag objects by query string parameters
        tags = tags.filter(
            name__icontains=query_params.get('name', ''),
        )
        # Serialize Tag objects
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)

    # this endpoint is only allowed to users who have 'is_mentor' permission
    def create(self, request, *args, **kwargs):
        """
        Create a Tag object.
        """
        # check if user is mentor
        if not request.user.is_mentor:
            return Response(status=403, data={'detail': 'You are not allowed to create Tag objects.'})
        # extract data from request
        data = request.data
        # create Tag object
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a Tag object.
        """
        # check if user is admin
        if not request.user.is_admin:
            return Response(status=403, data={'detail': 'You are not allowed to delete Tag objects.'})
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


