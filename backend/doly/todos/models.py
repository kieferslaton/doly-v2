from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model

# Create your models here.

class Todo(models.Model):
    task = models.CharField(max_length=50)
    due = models.DateTimeField(auto_now_add=False)
    tags = ArrayField(models.CharField(max_length=15))
    complete = models.BooleanField(default=False)
    has_due_date = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)

