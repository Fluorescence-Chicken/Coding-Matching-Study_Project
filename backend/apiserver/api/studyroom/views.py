from django.shortcuts import render
from rest_framework import viewsets, permissions, mixins, status
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from api.studyroom.models import StudyRoom, Tag, TechnologyStack, Posts, StudySchedule
from api.studyroom.serializers import StudyRoomSerializer, TagSerializer, TechnologyStackSerializer, \
    StudyroomPostsSerializer, StudyScheduleSerializer
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
        # search by user's id
        if query_params.get('user', None):
            study_rooms = study_rooms.filter(users=query_params.get('user'))
        # search by technology stack
        if query_params.get('technology_stack', None):
            study_rooms = study_rooms.filter(technology_stack=query_params.get('technology_stack'))
        # search by current user's not joined study room
        if query_params.get('exclude_joined', None):
            study_rooms = study_rooms.exclude(users=request.user)
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
        # increase point of mentor
        request.user.point += 10
        request.user.save()
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
        serializer = self.serializer_class(tags, many=True)
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


class TechnologyStackViews(viewsets.GenericViewSet,
                           mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           mixins.ListModelMixin):
    """
    View class that represents TechnologyStack model
    Create, delete, Retrieve, List is supported.
    """
    # viewset variables
    queryset = TechnologyStack.objects.all()
    serializer_class = TechnologyStackSerializer
    permission_classes = [custom_permissions.AllowGetOnly]

    def get_queryset(self):
        """
        Get queryset of TechnologyStack objects.
        """
        return TechnologyStack.objects.all()

    # this endpoint is available to all users include non-authenticated users
    def list(self, request: Request, *args, **kwargs):
        """
        List all TechnologyStack objects.
        """
        # Get query string parameters
        query_params = request.query_params
        # Get all TechnologyStack objects
        technology_stacks = self.get_queryset()
        # Filter TechnologyStack objects by query string parameters
        technology_stacks = technology_stacks.filter(
            name__icontains=query_params.get('name', ''),
        )
        # Serialize TechnologyStack objects
        serializer = self.serializer_class(technology_stacks, many=True)
        return Response(serializer.data)

    # this endpoint is only allowed to users who have 'is_mentor' permission
    def create(self, request, *args, **kwargs):
        """
        Create a TechnologyStack object.
        """
        # check if user is mentor
        if not request.user.is_admin:
            return Response(status=403, data={'detail': 'You are not allowed to create TechnologyStack objects.'})
        # extract data from request
        data = request.data
        # create TechnologyStack object
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a TechnologyStack object.
        """
        # check if user is admin
        if not request.user.is_admin:
            return Response(status=403, data={'detail': 'You are not allowed to delete TechnologyStack objects.'})
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyroomPostViews(viewsets.GenericViewSet,
                         viewsets.mixins.CreateModelMixin,
                         viewsets.mixins.DestroyModelMixin,
                         viewsets.mixins.ListModelMixin):
    """
    View class that represents StudyroomPost model
    Create, delete, Retrieve, List is supported.
    """
    # viewset variables
    queryset = Posts.objects.all()
    serializer_class = StudyroomPostsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Get queryset of StudyroomPost objects.
        """
        return Posts.objects.all()

    # this endpoint is available to all users
    def list(self, request: Request, *args, **kwargs):
        """
        List all StudyroomPost objects.
        """
        # Get query string parameters
        query_params = request.query_params
        # Get all StudyroomPost objects
        studyroom_posts = self.get_queryset()
        # Filter StudyroomPost objects by query string parameters
        studyroom_posts = studyroom_posts.filter(
            title__icontains=query_params.get('title', ''),
            content__icontains=query_params.get('content', ''),
        )
        # filter StudyroomPost objects by studyroom id
        if query_params.get('studyroom', None):
            studyroom_posts = studyroom_posts.filter(studyRoom__in=query_params.get('studyroom'))
        # Serialize StudyroomPost objects, without content column
        serializer = self.serializer_class(studyroom_posts, many=True)
        response_data = serializer.data

        return Response(response_data)

    # this endpoint is only allowed to users who is registered as study member

    # this endpoint is only allowed to users who is registered as study member
    def create(self, request, *args, **kwargs):
        """
        Create a StudyroomPost object.
        """
        # check request has studyroom id
        if not request.data.get('studyRoom', None):
            return Response(status=400, data={'detail': 'Studyroom id is required.'})
        # check user is in the studyroom
        if StudyRoom.objects.filter(
            id=request.data.get('studyRoom'),
            users__in=[request.user.id]
        ).count() == 0:
            return Response(status=403, data={'detail': "You can't create post where you're not assigned."})
        # increase points of user
        request.user.point += 2
        request.user.save()
        # create Post object
        data = request.data
        data['author'] = request.user.id
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a StudyroomPost object.
        """
        # get Post object from pk
        post = self.get_queryset().get(pk=kwargs['pk'])
        # get Studyroom object from post
        studyroom = post.studyRoom
        # check user is writer of the post or mentor of the studyroom
        if post.author != request.user and studyroom.mentor != request.user:
            return Response(status=403, data={'detail': "You can't delete this post."})
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyroomScheduleView(viewsets.GenericViewSet,
                            mixins.ListModelMixin,
                            mixins.CreateModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,):
    """
    StudyroomScheduleView
    """
    queryset = StudySchedule.objects.all()
    serializer_class = StudyScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    # this endpoint is available to all users
    def list(self, request: Request, *args, **kwargs):
        """
        List all StudyroomSchedule objects.
        """
        # Get query string parameters
        query_params = request.query_params
        # Get all StudyroomSchedule objects
        studyroom_schedules = self.get_queryset()
        # filter StudyroomSchedule objects by studyroom id
        if query_params.get('studyroom', None):
            studyroom_schedules = studyroom_schedules.filter(studyRoom__in=query_params.get('studyroom'))
        # Serialize StudyroomSchedule objects, without content column
        serializer = self.serializer_class(studyroom_schedules, many=True)
        response_data = serializer.data

        return Response(response_data)

    # this endpoint is only allowed to users who is registered as study member

    # this endpoint is only allowed to users who are mentor of studyroom
    def create(self, request, *args, **kwargs):
        """
        Create a StudyroomSchedule object.
        """
        # check request has studyroom id
        if not request.data.get('studyRoom', None):
            return Response(status=400, data={'detail': 'Studyroom id is required.'})
        # Get studyroom object from request
        studyroom = StudyRoom.objects.get(pk=request.data.get('studyRoom'))
        # check requested user is mentor of the studyroom
        if studyroom.mentor != request.user:
            return Response(status=403, data={'detail': "You can't create schedule where you're not assigned."})
        # create StudyroomSchedule object - request json is array of objects
        try:
            for week_schedules in request.data['week_schedules']:
                for schedules in week_schedules['schedules']:
                    data = {
                        'studyRoom': request.data['studyRoom'],
                        'week': week_schedules['week'],
                        'study_num': schedules['study_num'],
                        'time': schedules['time'],
                        'content': schedules['content'],
                        'title': schedules['title'],
                    }
                    serializer = self.serializer_class(data=data)
                    if serializer.is_valid():
                        serializer.save()
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=400, data={'detail': str(e)})
        return Response(status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Update a StudyroomSchedule object.
        """
        # get StudyroomSchedule object from pk
        schedule = self.get_queryset().get(pk=kwargs['pk'])
        # get Studyroom object from schedule
        studyroom = schedule.studyRoom
        # check user is mentor of the studyroom
        if studyroom.mentor != request.user:
            return Response(status=403, data={'detail': "You can't update this schedule."})
        # update StudyroomSchedule object
        instance = self.get_object()
        # Should limit the update to only the fields that are allowed to be updated: time, content
        data = request.data
        data.pop('studyRoom', None)
        data.pop('week', None)
        data.pop('study_num', None)
        serializer = self.serializer_class(instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a StudyroomSchedule object.
        """
        # get StudyroomSchedule object from pk
        schedule = self.get_queryset().get(pk=kwargs['pk'])
        # get Studyroom object from schedule
        studyroom = schedule.studyRoom
        # check user is joined on studyroom
        if studyroom.users.filter(id=request.user.id).count() == 0:
            return Response(status=403, data={'detail': "You can't retrieve this schedule."})
        # Serialize StudyroomSchedule object
        serializer = self.serializer_class(schedule)
        return Response(serializer.data)
