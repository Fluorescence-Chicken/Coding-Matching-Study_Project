from rest_framework import serializers

from api.ticket.models import ReportUserTicket


class ReportUserTicketSerializer(serializers.ModelSerializer):
    """
    Serializer for ReportUserTicket
    """
    class Meta:
        model = ReportUserTicket
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'author')

    def create(self, validated_data):
        """
        Create ReportUserTicket
        """
        # author is authenticated user
        validated_data['author'] = self.context['request'].user
        # create ReportUserTicket
        return super().create(validated_data)
