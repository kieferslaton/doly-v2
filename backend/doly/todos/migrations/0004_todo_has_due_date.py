# Generated by Django 3.1 on 2020-08-12 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0003_todo_complete'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='has_due_date',
            field=models.BooleanField(default=False),
        ),
    ]