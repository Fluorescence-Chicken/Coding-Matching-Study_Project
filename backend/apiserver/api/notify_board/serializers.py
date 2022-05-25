from rest_framework import serializers

from api.notify_board.models import NotificationBoardPosts, NotificationBoardComments


class NotificationBoardSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationBoardPosts model
    """
    class Meta:
        model = NotificationBoardPosts
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']


class NotificationBoardCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationBoardPosts model
    """
    class Meta:
        model = NotificationBoardComments
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']
