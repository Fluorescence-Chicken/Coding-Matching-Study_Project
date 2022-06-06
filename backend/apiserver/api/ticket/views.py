from django.shortcuts import render
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from api.ticket.models import ReportUserTicket
from api.ticket.serializers import ReportUserTicketSerializer


class ReportUserTicketViews(viewsets.GenericViewSet,
                            mixins.ListModelMixin,
                            mixins.CreateModelMixin):
    """
    This API represents the ReportUserTicket.
    User can create, admin can read.
    """
    queryset = ReportUserTicket.objects.all()
    serializer_class = ReportUserTicketSerializer

    def get_queryset(self):
        """
        get_queryset method for ReportUserTicket
        """
        return ReportUserTicket.objects.all()

    def list(self, request, *args, **kwargs):
        """
        GET method for ReportUserTicket
        """
        # check user is admin
        if not request.user.is_admin:
            return Response({"detail": "You are not admin."}, status=403)
        queryset = self.get_queryset()
        return Response(self.serializer_class(queryset, many=True).data)

    def post(self, request, *args, **kwargs):
        """
        POST method for ReportUserTicket
        """
        # author is authenticated user
        data = request.data
        data['author'] = request.user.id
        # create ReportUserTicket
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    @action(detail=True, methods=['post'], url_path='close')
    def set_closed(self, request, *args, pk=None):
        """
        Set ReportUserTicket status to closed
        """
        # check user is admin
        if not request.user.is_admin:
            return Response({"detail": "You are not admin."}, status=403)
        # check pk
        if not pk:
            return Response({"detail": "pk is required."}, status=400)
        # check id is integer
        try:
            id = int(pk)
        except:
            return Response({"detail": "id is not integer."}, status=400)
        # check id is exist
        try:
            report_ticket = ReportUserTicket.objects.get(id=id)
        except:
            return Response({"detail": "id is not exist."}, status=400)
        # set closed
        report_ticket.report_ticket_status = ReportUserTicket.ReportTicketStatus.CLOSED
        report_ticket.save()
        return Response({"detail": "success"})
