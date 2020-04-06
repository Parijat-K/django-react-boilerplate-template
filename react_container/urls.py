from django.urls import path, re_path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path('auth/login', views.login),
    path('auth/logout', views.logout),
    re_path(r'', views.catchall),
]