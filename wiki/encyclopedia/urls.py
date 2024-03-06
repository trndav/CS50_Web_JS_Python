from django.urls import path
from . import views

app_name = "encyclopedia"
urlpatterns = [
    path("", views.index, name="index"),
    path("css", views.css, name="CSS"),
    path("django", views.django, name="django"),
    path("git", views.git, name="git"),
    path("html", views.html, name="html"),
    path("python", views.python, name="python"),
    path("create", views.create, name="create"),
    path("alreadyexist", views.alreadyexist, name="alreadyexist"),
    path("<str:title>", views.entry_detail, name="entry_detail"),
]
