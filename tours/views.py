from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings
from os.path import basename,join

from .models import Tour
from .models import Render

def index(request):
    tours = Tour.objects.all()
    return render(request, 'tours/index.html', {'tours': tours})

def view(request):
    tours = Tour.objects.all()
    return render(request, 'tours/view.html', {'tours': tours})

def detail(request, tour_id):
    renders = Render.objects.all()
    renders_2 = Render.objects.all()
    for render_0 in renders_2:
        render_0.object_path = basename(render_0.object_path.path)
    tour = Tour.objects.get(id=tour_id)
    renderObj = tour.render
    renderObj.object_path = basename(renderObj.object_path.path)
    renderObj.colormap_path = basename(renderObj.colormap_path.path)
    renderObj.specmap_path = basename(renderObj.specmap_path.path)
    renderObj.normalmap_path = basename(renderObj.normalmap_path.path)
    return render(request, 'tours/view.html', {'tour': tour, 'renderObj': renderObj, 'renders_2': renders_2})
