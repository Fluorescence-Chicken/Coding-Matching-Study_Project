from django.db import models


class StudyRoom(models.Model):
    """
    This model represents the StudyRoom.
    Studyroom can have multiple users and can have lots of posts
    """
    # fields: id, name, description, List<Post>(1:n), List<User>(n:n), List<Tag>(n:n), mentor(1:n)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    tags = models.ManyToManyField('Tag', related_name='studyrooms')
    users = models.ManyToManyField('api.User', related_name='studyrooms')
    mentor = models.ForeignKey('api.User', related_name='mentored_studyrooms', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Posts(models.Model):
    """
    This model represents the Posts for Studyroom.
    This model has relationships with StudyRoom model as n:1
    """
    # fields: id, title, content, created_at, updated_at, studyRoom(n:1), author(n:1)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    studyRoom = models.ForeignKey(StudyRoom, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='posts')


class Comment(models.Model):
    """
    This model represents the Comments for Posts.
    This model has relationships with Posts model as 1:n
    """
    # fields: id, content, created_at, updated_at, post(1:n), author(n:1)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('api.User', on_delete=models.CASCADE, related_name='comments')


class Tag(models.Model):
    """
    This model represents the Tag for Studyroom.
    This model has relationships with Posts model as n:n
    """
    # fields: id, name
    name = models.CharField(max_length=100)
    search_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

