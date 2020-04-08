from django.shortcuts import render
from rest_framework import serializers
from rest_framework import generics, filters
from .models import ToDo
from .serializers import ToDoSerializer
# Create your views here.

class ToDoListCreate(generics.ListCreateAPIView):
    
    serializer_class = ToDoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['task']
    ordering_fields = ['created_datetime', 'is_complete']


    def get_queryset(self):
        if self.request.user.is_anonymous:
            return ToDo.objects.none()
        return ToDo.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.is_anonymous:
            raise serializers.ValidationError("Anonymous users not allowed to create records")
        serializer.save(created_by=self.request.user)