from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings
from os.path import basename,join

from .models import Tour

def index(request):
    tours = Tour.objects.all()
    return render(request, 'tours/index.html', {'tours': tours})

def detail(request, tour_id):
    tour = Tour.objects.get(id=tour_id)
    renderObj = tour.render
    renderObj.object_path = basename(renderObj.object_path.path)
    renderObj.colormap_path = basename(renderObj.colormap_path.path)
    renderObj.specmap_path = basename(renderObj.specmap_path.path)
    renderObj.normalmap_path = basename(renderObj.normalmap_path.path)
    return render(request, 'tours/view.html', {'tour': tour, 'renderObj': renderObj})
