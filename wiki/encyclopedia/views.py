from django.shortcuts import render, redirect
from . import util
from django import forms
from django.http import HttpResponseRedirect
from django.urls import reverse
import random
from markdown2 import markdown

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
    })

def css(request):  
    return render(request, "encyclopedia/css.html", {
        "entry": util.get_entry("CSS"),
        "title": "CSS"
    })

def django(request):  
    return render(request, "encyclopedia/django.html", {
        "entry": util.get_entry("Django"),
        "title": "Django"
    })

def git(request):  
    return render(request, "encyclopedia/git.html", {
        "entry": util.get_entry("git"),
        "title": "Git"
    })

def html(request):  
    return render(request, "encyclopedia/html.html", {
        "entry": util.get_entry("html"),
        "title": "HTML"
    })

def python(request):  
    return render(request, "encyclopedia/python.html", {
        "entry": util.get_entry("python"),
        "title": "Python"
    })

def alreadyexist(request):  
    return render(request, "encyclopedia/alreadyexist.html", {
        "entry": util.get_entry("alreadyexist"),
        "title": "Page Already Exist"
    })

def random_page(request):
    # Get a list of all page titles
    entries = util.list_entries()
    if entries:
        random_title = random.choice(entries)
        return redirect('encyclopedia:entry_detail', title=random_title)
    else:
        return redirect('encyclopedia:index')

def entry_detail(request, title):
    entry_content = util.get_entry(title)
    entries = util.list_entries()  # Get all entries
    html_content = markdown(entry_content)
    return render(request, "encyclopedia/entry_detail.html", {
        "title": title, 
        # "entry_content": entry_content, 
        "entry_content": html_content, 
        "entries": entries
        })

class NewTaskForm(forms.Form):
    pages = forms.CharField(label="New Page")
    content = forms.CharField(label="Content", widget=forms.Textarea)

def create(request):
    if request.method == "POST":
        form = NewTaskForm(request.POST) # Take data user submitted
        if form.is_valid():
            title = form.cleaned_data["pages"] 
            content = form.cleaned_data["content"] 

            if title in util.list_entries():
                return HttpResponseRedirect(reverse("encyclopedia:alreadyexist"))
            else: 
                util.save_entry(title, content)
            return HttpResponseRedirect(reverse("encyclopedia:index"))
        else:
            return render(request, "encyclopedia/create.html", {
        "form": form
    })
    return render(request, "encyclopedia/create.html", {
        "form": NewTaskForm()
    })

class EditTaskForm(forms.Form):
    title = forms.CharField(max_length=100)
    content = forms.CharField(widget=forms.Textarea)

def edit(request, title):
    if request.method == "POST":
        form = EditTaskForm(request.POST) # Take page data
        if form.is_valid():
            title = form.cleaned_data["title"] 
            content = form.cleaned_data["content"] #.strip()
            content = "\n".join(line.strip() for line in content.split("\n"))
            util.save_entry(title, content)
            return HttpResponseRedirect(reverse("encyclopedia:index"))
        
    else:
        content = util.get_entry(title)
        form = EditTaskForm(initial={"title": title, "content": content})
        
    return render(request, "encyclopedia/edit.html", {
        # "form": EditTaskForm(),
        "form": form,
        "title": title
    })