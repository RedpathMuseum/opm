from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings
from os.path import basename,join
from django.contrib.admin.views.decorators import staff_member_required

import simplejson
import json
from django.core import serializers

from .models import Tour
from .models import Render
from .models import Paragraph
from .models import Image
from .models import Annotation

from itertools import chain


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


    # Filtering through all Paragraph models with the id of the tour being viewed
    # Notice the double underscore in tour__id accesses the tours related to the paragraphs by Foreign key
    #All other models that have a Tour as a Foreign Key are access the same way
    paragraphs = Paragraph.objects.filter(tour__id=tour_id)

    images = Image.objects.filter(tour__id=tour_id)

    annotations = Annotation.objects.filter(tour__id=tour_id)

    annotations = annotations.order_by('position')
    annotations_json = serializers.serialize("json", annotations)
    annotations_list = json.dumps(annotations_json)

    POSITION_FIELD_MAPPING = {
    Paragraph: 'position',
    Image: 'position',
    }

    def my_key_func(obj):
        return getattr(obj, POSITION_FIELD_MAPPING[type(obj)])

    # Concatenating two query sets
    all_content = sorted(chain(images, paragraphs), key=my_key_func)

    return render(request, 'tours/view.html', {
        'tour': tour,
        'renderObj': renderObj,
        'renders_2': renders_2,
        'paragraphs': paragraphs,
        'images': images,
        'annotations_list': annotations_list,
        'all_content': all_content
        })

#Getter function for annotations in the custom change_form.html for Tour Models
def get_annotations(request):
    tour_annot = Annotation.objects.all()
    return render(request, './admin/tours/tour/change_form.html', {'tour_annot': tour_annot})



@staff_member_required

def annotations_admin_view(request):
    return render(request, 'tours/annotations_menu.html')
