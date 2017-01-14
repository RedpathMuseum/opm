from django.db import models
from django.conf import settings

class Render(models.Model):
    title = models.CharField(max_length=50)
    object_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    colormap_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    specmap_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    normalmap_path = models.FileField(upload_to=settings.UPLOAD_DIR)

class Tour(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=150)
    render = models.ForeignKey(
        Render,
        null=True,
        on_delete=models.CASCADE
    )

