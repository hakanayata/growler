
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("profile/<int:id>", views.profile_view, name="profile"),
    path("follow/<int:id>", views.follow, name="follow"),
    path("unfollow/<int:id>", views.unfollow, name="unfollow"),
    path("following", views.following, name="following"),
    path("update_post/<int:id>", views.update_post, name="update_post"),
    path("delete_post/<int:id>", views.delete_post, name="delete_post"),
    path("like/<int:id>", views.like, name="like"),
    path("unlike/<int:id>", views.unlike, name="unlike"),
    path("post/<int:id>", views.post_details, name="post_details"),
    path("reply/<int:id>", views.reply, name="reply"),
    path("delete_reply/<int:id>", views.delete_reply, name="delete_reply"),
    path("update_profile/<int:id>", views.update_profile, name="update_profile")
]
