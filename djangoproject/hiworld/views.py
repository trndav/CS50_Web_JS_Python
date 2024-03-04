from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request): # Http request
    # return HttpResponse("Hi world!")
    return render(request, "hiworld/index.html")

def brian(request):
    return HttpResponse("Hi Brian!")

def bob(request):
    return HttpResponse("Hi Bob!")

def greet(request, name):
    return render(request, "hiworld/greet.html", { # Add more variables in this dict
        "name": name.capitalize()
    })