from django.db import models
from django.conf import settings

class Render(models.Model):
    title = models.CharField(max_length=50)
    object_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    colormap_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    specmap_path = models.FileField(upload_to=settings.UPLOAD_DIR)
    normalmap_path = models.FileField(upload_to=settings.UPLOAD_DIR)

    def __str__(self):
        return str(self.title)

class Tour(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=5000)
    render = models.ForeignKey(
        Render,
        null=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.title)

class Section(models.Model):
    title = models.CharField(max_length=50)
    tour = models.ForeignKey(
        Tour,
        null=True,
        on_delete=models.CASCADE
    )
    position = models.IntegerField()

    class Meta:
        abstract = True

class Paragraph(Section):
    description = models.TextField(max_length=5000)

class Image(Section):
    path = models.ImageField(upload_to=settings.UPLOAD_DIR)
