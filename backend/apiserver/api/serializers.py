from rest_framework import serializers

from api.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        exclude = ["last_login", "social_identifier", "is_admin", "is_mentor", "is_active"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "username": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
            "address": {"required": True},
            "gender": {"required": True},
            "job": {"required": False}
        }

    # Should define this because the data must be validated before saving
    def create(self, validated_data) -> User:
        user: User = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            address=validated_data['address'],
            job=self.data['job'],
            gender=validated_data['gender']
        )
        return user


class UserWithoutPasswordSerializer(serializers.ModelSerializer):
    """
    Serializer for User model without password
    For put, delete, get requests
    """

    class Meta:
        model = User
        exclude = ["password", "social_identifier"]
        read_only_fields = ['id', 'username', 'email', 'is_admin', 'is_mentor', 'is_active', 'last_login']
