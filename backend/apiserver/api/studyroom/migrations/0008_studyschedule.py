# Generated by Django 4.0.4 on 2022-05-27 16:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('studyroom', '0007_studyroom_studyroom_type_alter_studyroom_study_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudySchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('week', models.IntegerField()),
                ('study_num', models.IntegerField()),
                ('time', models.DurationField()),
                ('studyRoom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='study_schedules', to='studyroom.studyroom')),
            ],
        ),
    ]
