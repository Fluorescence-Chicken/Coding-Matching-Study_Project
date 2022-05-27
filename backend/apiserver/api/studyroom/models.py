from django.db import models


class StudyRoom(models.Model):
    """
    This model represents the StudyRoom.
    Studyroom can have multiple users and can have lots of posts
    """

    class StudyRoomType(models.TextChoices):
        STUDY = 'study', '스터디'
        PROJECT = 'project', '프로젝트'

    class StudyType(models.TextChoices):
        CONTACTLESS = 'contactless', '비대면'
        CONTACT = 'contact', '대면'

    # fields: id, name, description, List<Post>(1:n), List<User>(n:n), List<Tag>(n:n), mentor(1:n)
    # study_type, user_num_limit, start_date, end_date, technology_stack, weekly_plan_amount, weekly_plan_count,
    # description_long
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    tags = models.ManyToManyField('Tag', related_name='studyrooms')
    users = models.ManyToManyField('api.User', related_name='studyrooms')
    mentor = models.ForeignKey('api.User', related_name='mentored_studyrooms', on_delete=models.CASCADE)
    # can choose between projects and study
    studyroom_type = models.CharField(max_length=20, choices=StudyRoomType.choices, default=StudyRoomType.STUDY)
    study_type = models.CharField(max_length=20, choices=StudyType.choices, default=StudyType.CONTACT)
    user_num_limit = models.IntegerField(default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    technology_stack = models.ForeignKey('studyroom.TechnologyStack', on_delete=models.CASCADE)
    weekly_plan_amount = models.IntegerField(default=0)
    weekly_plan_count = models.IntegerField(default=0)
    description_long = models.TextField(null=True, blank=True)

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
    tag_image = models.ImageField(upload_to='tag_images')

    def __str__(self):
        return self.name


class TechnologyStack(models.Model):
    """
    This model represents the TechnologyStack for Studyroom.
    This model has relationships with StudyRoom model as n:1
    """
    # fields: id, name, description, studyRoom(n:1)
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class StudySchedule(models.Model):
    """
    This model represents the StudySchedule for Studyroom.
    This model has relationships with StudyRoom model as n:1
    """
    # fields: id, start_date, end_date, studyRoom(n:1)
    week = models.IntegerField()
    study_num = models.IntegerField()
    time = models.DurationField()
    studyRoom = models.ForeignKey(StudyRoom, on_delete=models.CASCADE, related_name='study_schedules')
