from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    bio = models.CharField(max_length=128, blank=True)
    pass


class Post(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="posters")
    content = models.CharField(max_length=300)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True)
    is_updated = models.BooleanField(default=False)
    liked_by = models.ManyToManyField(User, blank=True, related_name="likes")
    view_count = models.PositiveBigIntegerField(default=0, editable=False)
    viewed_by = models.ManyToManyField(User, blank=True, related_name="views")

    class Meta:
        ordering = ["-date_created"]

    def __str__(self):
        return f"{self.content[:10]}... by {self.author}"


class Reply(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="authors")
    reply = models.CharField(max_length=300)
    date_created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="replies")

    class Meta:
        ordering = ["-date_created"]

    def __str__(self):
        return f"{self.reply} by {self.author}"


class Follow(models.Model):
    # for user x; x.followers.all() -> bring all users where Follow.user is x
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followers")
    # for user x; x.following.all() -> bring all users where Follow.follower is x
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="following")

    def __str__(self):
        return f"{self.follower} follows {self.user}"
