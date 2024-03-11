from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import User, Comment
from django.contrib.auth.decorators import login_required
from django import forms

def index(request):
    return render(request, "auctions/index.html")

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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")

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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create_comment(request):
    class CommentForm(forms.ModelForm):
        class Meta:
            model = Comment
            fields = ['text']
            labels = {'text': ''}
            widgets = {
                'text': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Write your comment here...'})
            }

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.save()
            return redirect('show_comments')  # Redirect to the appropriate page after comment creation
    else:
        form = CommentForm()
    return render(request, 'auctions/create_comment.html', {'form': form})

def show_comments(request):
    comments = Comment.objects.all()  # Retrieve all comments from the database
    return render(request, 'auctions/show_comments.html', {'comments': comments})

def tests(request):
    return render(request, 'auctions/test.html')