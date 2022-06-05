from rest_framework import serializers

from api.notify_board.models import NotificationBoardPosts, NotificationBoardComments, QnaBoardPosts, QnaBoardComments


class NotificationBoardSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationBoardPosts model
    """
    comment_amount = serializers.SerializerMethodField()

    class Meta:
        model = NotificationBoardPosts
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']

    def get_comment_amount(self, obj):
        """
        Get the comments number of the post
        """
        return obj.comments.count()


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
    # field for comments number
    comment_amount = serializers.SerializerMethodField()

    class Meta:
        model = QnaBoardPosts
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']

    def get_comment_amount(self, obj):
        """
        Get the comments number of the post
        """
        return obj.comments.count()


class QnaBoardCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for QnaBoardComments model
    """

    class Meta:
        model = QnaBoardComments
        fields = '__all__'
        write_only_fields = ['created_at', 'uploaded_by']
