from django.db import models


class ReportUserTicket(models.Model):
    """
    This model represents the ReportTicket.
    created when a user reports a mentor/mentee
    """
    class ReportTicketStatus(models.TextChoices):
        OPEN = 'open', '열림'
        CLOSED = 'closed', '닫힘'

    # types of report
    class ReportType(models.TextChoices):
        MENTOR = 'mentor', '멘토'
        MENTEE = 'mentee', '멘티'

    # fields: id, title, content, created_at, updated_at, studyRoom(n:1), author(n:1)
    created_at = models.DateTimeField(auto_now_add=True)
    report_ticket_status = models.CharField(max_length=20, choices=ReportTicketStatus.choices, default=ReportTicketStatus.OPEN)
    report_type = models.CharField(max_length=20, choices=ReportType.choices, default=ReportType.MENTOR)
    author = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='report_tickets')
    reported_user = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='reported_tickets')

