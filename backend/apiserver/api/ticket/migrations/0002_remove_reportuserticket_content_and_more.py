# Generated by Django 4.0.5 on 2022-06-06 06:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ticket', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reportuserticket',
            name='content',
        ),
        migrations.RemoveField(
            model_name='reportuserticket',
            name='title',
        ),
    ]