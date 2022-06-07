from django.shortcuts import render

from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import action

from api.notify_board.models import NotificationBoardPosts, NotificationBoardComments, QnaBoardPosts, QnaBoardComments, \
    EmploymentPost, EmploymentComment, EventComment, EventPost
from api.notify_board.serializers import NotificationBoardSerializer, NotificationBoardCommentSerializer, \
    QnaBoardSerializer, QnaBoardCommentSerializer, EmploymentPostSerializer, EmploymentCommentSerializer, \
    EventCommentSerializer, EventSerializer
from config.permissions import AllowGetOnly
from rest_framework.response import Response


class NotifyBoardViews(viewsets.GenericViewSet,
                       mixins.ListModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.CreateModelMixin, ):
    """
    Notification Board API
    """
    serializer_class = NotificationBoardSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()

    def get_queryset(self):
        """
        Get the Notifications posts.
        """
        return NotificationBoardPosts.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Notifications posts.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve the Notifications posts.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Notifications posts.
        """
        # if request.user.is_admin is false, return error
        if not request.user.is_admin:
            return Response(status=400, data={'message': 'You are not admin'})
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class NotifyBoardCommentViews(viewsets.GenericViewSet,
                              mixins.ListModelMixin,
                              mixins.RetrieveModelMixin,
                              mixins.CreateModelMixin, ):
    """
    Notification Board Post comments API
    """
    serializer_class = NotificationBoardCommentSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()

    def get_queryset(self):
        """
        Get the Notifications posts' comments.
        """
        return NotificationBoardComments.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Notifications posts' comments. should get query string that indicates post that comment will retrieve.
        """
        queryset = self.get_queryset()
        # get query string - post
        post = request.query_params.get('post', None)
        if post is None:
            return Response(status=400, data={'message': 'query error: post is required'})
        # filter comments by post
        queryset = queryset.filter(post=post)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve the Notifications posts' comments.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Notifications posts' comments.
        """
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add poins to requested user
        request.user.point += 1
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class QnaBoardViews(viewsets.GenericViewSet,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.CreateModelMixin, ):
    """
    Qna Board API
    """
    serializer_class = QnaBoardSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()
    lookup_field = 'pk'

    def get_queryset(self):
        """
        Get the Qna posts.
        """
        return QnaBoardPosts.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Qna posts.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve the Qna posts.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Qna posts.
        """
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 2
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class QnaBoardCommentViews(viewsets.GenericViewSet,
                           mixins.ListModelMixin,
                           mixins.CreateModelMixin, ):
    """
    Qna Board Post comments API
    """
    serializer_class = QnaBoardCommentSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()

    def get_queryset(self):
        """
        Get the Qna posts' comments.
        """
        return QnaBoardComments.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Qna posts' comments. should get query string that indicates post that comment will retrieve.
        """
        queryset = self.get_queryset()
        # get query string - post
        post = request.query_params.get('post', None)
        if post is None:
            return Response(status=400, data={'message': 'query error: post is required'})
        # filter comments by post
        queryset = queryset.filter(post=post)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Qna posts' comments.
        """
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 1
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class EmploymentBoardViews(viewsets.GenericViewSet,
                           mixins.ListModelMixin,
                           mixins.RetrieveModelMixin,
                           mixins.CreateModelMixin, ):
    """
    Employment Board API
    """
    serializer_class = EmploymentPostSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()
    lookup_field = 'pk'

    def get_queryset(self):
        """
        Get the Employment posts.
        """
        return EmploymentPost.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Employment posts.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve the Employment posts.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Employment posts.
        """
        # Check user is mentor or admin
        if request.user.role != 'mentor' and request.user.role != 'admin':
            return Response(status=403, data={'message': 'You are not allowed to create employment posts'})
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 2
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class EmploymentBoardCommentViews(viewsets.GenericViewSet,
                                  mixins.ListModelMixin,
                                  mixins.CreateModelMixin, ):
    """
    Employment Board Post comments API
    """
    serializer_class = EmploymentCommentSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()

    def get_queryset(self):
        """
        Get the Employment posts' comments.
        """
        return EmploymentComment.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Employment posts' comments. should get query string that indicates post that comment will retrieve.
        """
        queryset = self.get_queryset()
        # get query string - post
        post = request.query_params.get('post', None)
        if post is None:
            return Response(status=400, data={'message': 'query error: post is required'})
        # filter comments by post
        queryset = queryset.filter(post=post)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Employment posts' comments.
        """
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 1
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class EventPostViews(viewsets.GenericViewSet,
                     mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.CreateModelMixin, ):
    """
    Event Board API
    """
    serializer_class = EventSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()
    lookup_field = 'pk'

    def get_queryset(self):
        """
        Get the Event posts.
        """
        return EventPost.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Event posts.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve the Event posts.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Event posts.
        """
        # Check user is mentor or admin
        if request.user.role != 'mentor' and request.user.role != 'admin':
            return Response(status=403, data={'message': 'You are not allowed to create event posts'})
        data = request.data
        # add user to uploaded_by field
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 2
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)


class EventBoardCommentViews(viewsets.GenericViewSet,
                             mixins.ListModelMixin,
                             mixins.CreateModelMixin, ):
    """
    Event Board Post comments API
    """
    serializer_class = EventCommentSerializer
    permission_classes = [AllowGetOnly, ]
    queryset = NotificationBoardPosts.objects.all()

    def get_queryset(self):
        """
        Get the Event posts' comments.
        """
        return EventComment.objects.all()

    def list(self, request, *args, **kwargs):
        """
        List the Event posts' comments. should get query string that indicates post that comment will retrieve.
        """
        queryset = self.get_queryset()
        # get query string - post
        post = request.query_params.get('post', None)
        if post is None:
            return Response(status=400, data={'message': 'query error: post is required'})
        # filter comments by post
        queryset = queryset.filter(post=post)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create the Event posts' comments.
        """
        data = request.data
        # add user to uploaded_by field
        request.user.point += 1
        data['uploaded_by'] = request.user.id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # add point to requested user
        request.user.point += 1
        request.user.save()
        return Response(serializer.data, status=201, headers=headers)
