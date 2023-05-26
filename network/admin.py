from django.contrib import admin

from .models import User, Reply, Follow, Post
# Register your models here.


class PostAdmin(admin.ModelAdmin):
    list_display = ["id", "content", "author", "is_updated", "date_created"]


class ReplyAdmin(admin.ModelAdmin):
    list_display = ["id", "reply", "author", "post", "date_created"]


admin.site.register(User)
admin.site.register(Reply)
admin.site.register(Follow)
admin.site.register(Post, PostAdmin)
