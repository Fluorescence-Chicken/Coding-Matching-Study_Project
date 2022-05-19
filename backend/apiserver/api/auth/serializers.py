from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from api.models import User


class TokenAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # if email and password is given
        if email and password:
            # validate the email
            requested_user: User = get_object_or_404(User, email=email)
            # get username
            username = requested_user.username
            # authenticate
            user = authenticate(username=username, password=password)

            # https://stackoverflow.com/questions/28058326/django-rest-framework-obtain-auth-token-using-email-instead-username
            if user:
                if not user.is_active:
                    msg = 'User account is disabled.'
                    raise serializers.ValidationError(msg)
            else:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg)
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg)

        attrs['user'] = user
        return attrs
