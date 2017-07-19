from django.conf.urls import url

from . import views

app_name = 'tours'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<tour_id>[0-9]+)/$', views.detail, name='detail'),
    url(r'^add_annotation/(?P<tour_id>[0-9]+)/$', views.add_annotation, name='add_annotation'),
    url(r'^get_annotations/(?P<tour_id>[0-9]+)/$', views.get_annotations, name='get_annotations'),
    url(r'^delete_annotation/(?P<annotation_id>[0-9]+)/$', views.delete_annotation, name='delete_annotation'),
    url(r'^edit_annotation/(?P<annotation_id>[0-9]+)/$', views.edit_annotation, name='edit_annotation'),


]
