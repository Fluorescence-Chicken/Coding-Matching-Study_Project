from rest_framework import serializers

from api.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = "__all__"
        except_fields = ["last_login", "date_joined", "social_identifier", "is_admin", "is_mentor", "is_active"]

    # Override get_field_names to remove fields that are not needed
    def get_field_names(self, declared_fields, info):
        field_names = super().get_field_names(declared_fields, info)
        if getattr(self.Meta, "except_fields", None):
            return [item for item in field_names if item not in self.Meta.except_fields]
        else:
            return field_names

    # Should define this because the data must be validated before saving
    def create(self, validated_data) -> User:
        user: User = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            address=validated_data['address'],
            job=validated_data['job'],
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
        read_only_fields = ('id', 'username', 'email')
