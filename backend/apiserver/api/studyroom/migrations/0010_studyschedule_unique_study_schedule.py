# Generated by Django 4.0.4 on 2022-06-02 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studyroom', '0009_studyschedule_content'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='studyschedule',
            constraint=models.UniqueConstraint(fields=('week', 'study_num', 'studyRoom'), name='unique_study_schedule'),
        ),
    ]
