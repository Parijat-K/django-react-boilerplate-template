from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Dummy model
class ToDo(models.Model):
    task = models.CharField(db_column='task', max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_complete = models.BooleanField(db_column='is_complete', default=False)
    created_datetime = models.DateTimeField(auto_now_add=True, blank=False)

    class Meta:
        verbose_name = 'To-Do'
        verbose_name_plural = 'To-Do List'