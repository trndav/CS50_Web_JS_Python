from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("auctions/create_comment/", views.create_comment, name="create_comment"),
    path("auctions/show_comments/", views.show_comments, name="show_comments"),
    path("auctions/tests/", views.tests, name="tests"),
]
