from django.conf.urls import url

from . import views

app_name = 'navapp'
urlpatterns = [

    url(r'^$', views.index, name="index"),



]
