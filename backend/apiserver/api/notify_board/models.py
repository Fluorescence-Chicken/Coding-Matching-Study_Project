from django.db import models


class NotificationBoardPosts(models.Model):
    """
    This class represents the notification board posts which only admin can write
    """
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('api.User', on_delete=models.DO_NOTHING)


class NotificationBoardComments(models.Model):
    """
    This class represents the notification board comments which only admin can write
    """
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('api.User', on_delete=models.DO_NOTHING)
    post = models.ForeignKey('notify_board.NotificationBoardPosts', related_name="comments" , on_delete=models.CASCADE)


class QnaBoardPosts(models.Model):
    """
    This class represents the qna board posts which only admin can write
    """
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('api.User', on_delete=models.DO_NOTHING)


class QnaBoardComments(models.Model):
    """
    This class represents the qna board comments which only admin can write
    """
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey('api.User', on_delete=models.DO_NOTHING)
    post = models.ForeignKey('notify_board.QnaBoardPosts', related_name="comments", on_delete=models.CASCADE)
