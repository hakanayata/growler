import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_GET
from django.contrib import messages
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt

from .models import User, Reply, Follow, Post


def index(request):
    try:
        # Query for all posts
        posts = Post.objects.all()
        # 10 objects per page
        paginator = Paginator(posts, 10)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)
    except:
        return render(request, "network/index.html", {
            "message": "Oops! Something went wrong."
        })

    try:
        posts_liked = request.user.likes.all()
    except:
        posts_liked = None

    for obj in page_obj:
        try:
            obj.view_count += 1
            # update_fields parameter not necessary, just for better performance
            obj.save(update_fields=["view_count"])
        except:
            return render(request, "network/index.html", {
                "message": "Oops! Something went wrong"
            })

    return render(request, "network/index.html", {
        "page_posts": page_obj,
        "posts_liked": posts_liked
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required(login_url="login")
@require_POST
def create_post(request):
    content = request.POST["post"]
    if not content:
        return
    else:
        post = Post(content=content, author=request.user)
        post.save()
        return HttpResponseRedirect(reverse("index"))


def profile_view(request, id):
    owner = User.objects.get(pk=id)
    posts = Post.objects.filter(author_id=id)
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    # is user following the profile owner
    is_following = owner.followers.filter(follower_id=request.user.id).exists()

    try:
        posts_liked = request.user.likes.all()
    except:
        posts_liked = None

    for obj in page_obj:
        try:
            obj.view_count += 1
            obj.save()
        except:
            return render(request, "network/index.html", {
                "message": "Oops! Something went wrong"
            })

    return render(request, "network/profile.html", {
        "posts": posts,
        "page_posts": page_obj,
        "posts_liked": posts_liked,
        "owner": owner,
        "is_following": is_following,
    })


@login_required(login_url="login")
@require_POST
def follow(request, id):
    user_to_be_followed = User.objects.get(pk=id)
    follow = Follow(user=user_to_be_followed, follower=request.user)
    follow.save()
    return HttpResponseRedirect(reverse("profile", kwargs={"id": id}))


@login_required(login_url="login")
@require_POST
def unfollow(request, id):
    user_to_be_unfollowed = User.objects.get(pk=id)
    follow = Follow.objects.filter(
        user_id=user_to_be_unfollowed.id, follower_id=request.user.id)
    follow.delete()
    return HttpResponseRedirect(reverse("profile", kwargs={"id": id}))


@login_required(login_url="login")
@require_GET
def following(request):
    user = request.user
    followed_users = user.following.values()
    followed_users_ids = [obj["user_id"] for obj in followed_users]
    posts = Post.objects.filter(author_id__in=followed_users_ids)
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    try:
        posts_liked = request.user.likes.all()
    except:
        posts_liked = None

    for obj in page_obj:
        try:
            obj.view_count += 1
            obj.save()
        except:
            return render(request, "network/index.html", {
                "message": "Oops! Something went wrong"
            })

    return render(request, "network/following.html", {
        "page_posts": page_obj,
        "posts_liked": posts_liked,
    })


@csrf_exempt
@login_required(login_url="login")
def update_post(request, id):
    # Query for reqeusted post
    try:
        post = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    if request.method == "PUT":
        if post.author == request.user:
            # deserialize json to python object
            data = json.loads(request.body)
            content = data["content"]
            post.content = content
            post.is_updated = True
            post.save()
            return HttpResponse(status=204)
        else:
            return JsonResponse({
                "error": "Not authorized for this action."
            })
    else:
        return JsonResponse({
            "error": "Only PUT request allowed."
        }, status=400)


@csrf_exempt
@login_required(login_url="login")
def delete_post(request, id):
    if request.method == "DELETE":
        # Query for requested post
        try:
            post = Post.objects.get(pk=id)
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found"}, status=404)

        if post.author == request.user:
            post.delete()
            return HttpResponse(status=204)
        else:
            return JsonResponse({
                "error": "Not authorized for this action."
            }, status=401)
        # Deletion must be via DELETE
    else:
        return JsonResponse({
            "error": "DELETE request required."
        }, status=400)


@csrf_exempt
@login_required(login_url="login")
@require_POST
def like(request, id):
    # Query for requested post
    try:
        post = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    post.liked_by.add(request.user)
    post.save()
    return HttpResponse(status=204)


@csrf_exempt
@login_required(login_url="login")
@require_POST
def unlike(request, id):
    # Query for requested post
    try:
        post = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found"}, status=404)

    post.liked_by.remove(request.user)
    post.save()
    return HttpResponse(status=204)


@login_required(login_url="login")
@require_GET
def post_details(request, id):
    try:
        post = Post.objects.get(pk=id)
    except Post.DoesNotExist:
        return HttpResponseRedirect(reverse("index"))

    try:
        posts_liked = request.user.likes.all()
    except:
        posts_liked = None

    replies = Reply.objects.filter(post_id=id)
    return render(request, "network/post.html", {
        "post": post,
        "replies": replies,
        "posts_liked": posts_liked,
    })


@login_required(login_url="login")
@require_POST
def reply(request, id):
    post = Post.objects.get(pk=id)
    try:
        content = request.POST["reply"]
        reply = Reply(author=request.user, reply=content, post=post)
        reply.save()
    except:
        return render(request, "network/posts.html", {
            "message": "Oops! Could not post your reply. Try again later."
        })
    return HttpResponseRedirect(reverse("post_details", kwargs={"id": id}))


@csrf_exempt
@login_required(login_url="login")
@require_POST
def delete_reply(request, id):
    reply = Reply.objects.get(pk=id)
    post_id = reply.post_id
    try:
        reply.delete()
    except:
        return render(request, f"network/post/{id}.html", {
            "message": "Oops! Could not delete."
        })
    return HttpResponseRedirect(reverse("post_details", kwargs={"id": post_id}))


@csrf_exempt
@login_required(login_url="login")
def update_profile(request, id):
    user = User.objects.get(pk=id)
    if request.method == "PUT":
        # deserialize json to python object
        data = json.loads(request.body)
        bio = data["bio"]
        user.bio = bio
        user.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error": "Only PUT request allowed."
        }, status=400)


# todo: add bookmark feature
