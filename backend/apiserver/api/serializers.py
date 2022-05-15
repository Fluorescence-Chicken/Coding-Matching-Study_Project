from rest_framework import serializers

from api.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    # Should define this because the data must be validated before saving
    def create(self, validated_data) -> User:
        user: User = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class UserWithoutPasswordSerializer(serializers.ModelSerializer):
    """
    Serializer for User model without password
    For put, delete, get requests
    """

    class Meta:
        model = User
        read_only_fields = ('id', 'username', 'email')
