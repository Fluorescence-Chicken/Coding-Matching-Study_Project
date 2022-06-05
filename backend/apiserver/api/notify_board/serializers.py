from rest_framework import serializers

from api.notify_board.models import NotificationBoardPosts, NotificationBoardComments, QnaBoardPosts, QnaBoardComments


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


class QnaBoardSerializer(serializers.ModelSerializer):
    """
    Serializer for QnaBoardPosts model
    """
    class Meta:
        model = QnaBoardPosts
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']


class QnaBoardCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for QnaBoardComments model
    """
    class Meta:
        model = QnaBoardComments
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']