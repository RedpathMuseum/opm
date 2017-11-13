from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.conf import settings
from os.path import basename,join
from django.contrib.admin.views.decorators import staff_member_required

import simplejson
import json
from django.core import serializers

import base64

from .models import Tour
from .models import Render
from .models import Paragraph
from .models import Image
from .models import Video
from .models import Annotation
from .models import TourGroup

from itertools import chain


def index(request):
    tours = Tour.objects.all()
    tourGroups = TourGroup.objects.all()
    return render(request, 'tours/index.html', {'tours': tours, 'tourGroups': tourGroups})

def view(request):
    tours = Tour.objects.all()
    return render(request, 'tours/view.html', {'tours': tours})

def view_ar(request, tour_id):
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

    videos = Video.objects.filter(tour__id=tour_id)

    annotations = Annotation.objects.filter(tour__id=tour_id)

    annotations = annotations.order_by('position')
    annotations_json = serializers.serialize("json", annotations)
    annotations_list = json.dumps(annotations_json)

    POSITION_FIELD_MAPPING = {
    Paragraph: 'position',
    Image: 'position',
    Video: 'position',
    }

    def my_key_func(obj):
        return getattr(obj, POSITION_FIELD_MAPPING[type(obj)])

    # Concatenating two query sets
    all_content = sorted(chain(images, videos, paragraphs), key=my_key_func)

    return render(request, 'tours/view_ar.html', {
        'tour': tour,
        'renderObj': renderObj,
        'renders_2': renders_2,
        'paragraphs': paragraphs,
        'images': images,
        'videos': videos,
        'annotations_list': annotations_list,
        'all_content': all_content
        })

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

    videos = Video.objects.filter(tour__id=tour_id)

    annotations = Annotation.objects.filter(tour__id=tour_id)

    annotations = annotations.order_by('position')
    annotations_json = serializers.serialize("json", annotations)
    annotations_list = json.dumps(annotations_json)

    POSITION_FIELD_MAPPING = {
    Paragraph: 'position',
    Image: 'position',
    Video: 'position',
    }

    def my_key_func(obj):
        return getattr(obj, POSITION_FIELD_MAPPING[type(obj)])

    # Concatenating two query sets
    all_content = sorted(chain(images, videos, paragraphs), key=my_key_func)

    return render(request, 'tours/view.html', {
        'tour': tour,
        'renderObj': renderObj,
        'renders_2': renders_2,
        'paragraphs': paragraphs,
        'images': images,
        'videos': videos,
        'annotations_list': annotations_list,
        'all_content': all_content
        })

#Getter function for annotations in the custom change_form.html for Tour Models
def get_annotations(request, tour_id):
    tour_annot = Annotation.objects.all()
    # TODO: Add the if statement
    # if request.method == 'GET':
    #     return render(request, './admin/tours/tour/change_form.html', {'tour_annot': tour_annot})
    # elif request.method == 'POST':
    #     print("POST request -- do nothing")
    #     return
    annotations = Annotation.objects.filter(tour__id=tour_id)

    annotations = annotations.order_by('position')
    # annotations_json = serializers.serialize("json", annotations)
    # annotations_list = json.dumps(annotations)

    # Note that ids are in the queryset by default, the name of the variable is just to make this explicit
    annotations_values_with_ids = annotations.values()
    annotations_list = list(annotations_values_with_ids)
    print(annotations_values_with_ids)
    print(request.method == 'GET')
    print("get_annotations --- RETURNING")
    return JsonResponse(annotations_list, safe=False)



def add_annotation(request, tour_id):

    #Load JSON of new annotation from POST request in change_form.html
    loaded_json = json.loads(request.body.decode('utf-8'))
    annotation_json = loaded_json["annotation"]

    # Create new annotation model from JSON and save it
    new_annotation =Annotation(
        title = annotation_json["name"],
        position=annotation_json["position"],

        camera_pos_x = annotation_json["camera_position"]["x"],
        camera_pos_y = annotation_json["camera_position"]["y"],
        camera_pos_z = annotation_json["camera_position"]["z"],

        target_pos_x = annotation_json["camera_target"]["x"],
        target_pos_y = annotation_json["camera_target"]["y"],
        target_pos_z = annotation_json["camera_target"]["z"],

        annotation_text = annotation_json["text"],
        tour_id = tour_id  )

    new_annotation.save()
    newObjId = new_annotation.pk

    #Uncomment to check if the new annotation is saved as a ForeignKey to the tour being edited
    # saved_annotations = Annotation.objects.filter(tour__id=tour_id)
    # print(saved_annotations)
    # print(request.body)

    return JsonResponse({'id': newObjId})



def add_img(request, tour_id):
    loaded_data = json.loads(request.body)
    data_json = loaded_data["img"]


    tour = Tour.objects.get(id=tour_id)
    print(tour)

    #print("before overwrite")
    # print(tour.snapshot)

    # print("after overwrite")
    # print(tour.snapshot)
    img_data = data_json["url"]
    img_data_bytes = str.encode(img_data)

    with open(settings.MEDIA_ROOT+"snapshots/"+"imageToSave.png", "wb") as fh:
        fh.write(base64.decodebytes(img_data_bytes))


    tour.snapshot = settings.MEDIA_ROOT+"snapshots/"+"imageToSave.png"

    tour.save()


    status = "success"
    print("imgData")
    #print(request.body)

    return JsonResponse({'img': "imageToSave.png"}) #returning the filename



def delete_annotation(request, annotation_id):

    annotObj = Annotation.objects.get(pk=annotation_id)
    position = annotObj.position
    annotObj.delete()
    return JsonResponse({'position': position})

def edit_annotation(request, annotation_id):

    #Load JSON of new annotation from POST request in change_form.html
    loaded_json = json.loads(request.body.decode('utf-8'))
    annotation_json = loaded_json["annotation"]

    annotObj = Annotation.objects.get(pk=annotation_id)

    annotObj.title = annotation_json["name"]
    annotObj.position = annotation_json["position"]

    annotObj.camera_pos_x = annotation_json["camera_position"]["x"]
    annotObj.camera_pos_y = annotation_json["camera_position"]["y"]
    annotObj.camera_pos_z = annotation_json["camera_position"]["z"]

    annotObj.target_pos_x = annotation_json["camera_target"]["x"]
    annotObj.target_pos_y = annotation_json["camera_target"]["y"]
    annotObj.target_pos_z = annotation_json["camera_target"]["z"]

    annotObj.annotation_text = annotation_json["text"]

    annotObj.save()
    annotObj_json = serializers.serialize("json", [annotObj])
    # annotObj_json_ser = json.dumps(annotations_json)
    return HttpResponse(annotObj_json, content_type='application/json')

@staff_member_required

def annotations_admin_view(request):
    return render(request, 'tours/annotations_menu.html')
