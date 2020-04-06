from django.urls import path
from . import views

urlpatterns = [
    path('todo', views.ToDoListCreate.as_view()),
]