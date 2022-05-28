from rest_framework import serializers

from . import models


class StudyRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudyRoom
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
        extra_kwargs = {
            'users': {'required': False}
        }

    def create(self, validated_data):
        # Because Tag is a many-to-many field, it will be a list of Tag objects
        # We need to convert it to a list of Tag IDs
        # Also, mentor is a foreign key, so we need to insert it into the validated_data dictionary
        # From id to User instance.
        validated_data['mentor'] = self.context['request'].user
        return super().create(validated_data)


class StudyRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudyRoom
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'mentor')

    def create(self, validated_data):
        return models.StudyRoom.objects.create(**validated_data)


class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Posts
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'author', 'studyroom')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Comment
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'author', 'post')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = '__all__'
        read_only_fields = ['id']

class TechnologyStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TechnologyStack
        fields = '__all__'
        read_only_fields = ['id']
