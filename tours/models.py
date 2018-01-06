from django.db import models
from django.conf import settings

from os.path import basename,join

class Render(models.Model):
    title = models.CharField(max_length=50)
    object_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")
    colormap_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")
    specmap_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")
    normalmap_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")

    is_gltf = models.BooleanField();
    gltf_file_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")
    gltf_colormap_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")
    gltf_bin_path = models.FileField(upload_to=settings.MEDIA_ROOT+"/renders")

    def __str__(self):
        return str(self.title)

class Tour(models.Model):
    title = models.CharField(max_length=50)
    text = models.TextField(max_length=5000)
    snapshot = models.FileField(upload_to=settings.MEDIA_ROOT+"snapshots")
    #,default=settings.STATIC_URL+"/static_images/redpath-inside.jpg"
    render = models.ForeignKey(
        Render,
        null=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.title)

    def snapshot_name(self):
        image_name = basename(self.snapshot.name)
        print(image_name)
        return image_name

class TourGroup(models.Model):
    title = models.CharField(max_length=100)
    tours = models.ManyToManyField(Tour)

    def __str__(self):              # __unicode__ on Python 2
        return self.title

    class Meta:
        ordering = ('title',)

class Section(models.Model):
    title = models.CharField(max_length=50)
    tour = models.ForeignKey(
        Tour,
        null=True,
        on_delete=models.CASCADE,
        help_text="Select to which Tour you want to link this content"
    )
    position = models.IntegerField(help_text="Write down the position of the content as an integer. Increasing positions are placed on a top to bottom scale.")

    # Inherited method to get class name of the a model.
    #Necessary to filter etween different types of content that Section childs
    def class_name(self):
        return self.__class__.__name__

    def __str__(self):
        return str(self.title)

    class Meta:
        abstract = True

class Paragraph(Section):
    description = models.TextField(max_length=5000)


class Image(Section):
    path = models.ImageField(upload_to=settings.MEDIA_ROOT+"/images")

    def file_name(self):
        image_name = basename(self.path.name)
        return image_name

class Video(Section):
    path = models.FileField(upload_to=settings.MEDIA_ROOT+"/videos", help_text="Only mp4 format is suported")

    def file_name(self):
        video_name = basename(self.path.name)
        return video_name


class Annotation(models.Model):
    title = models.CharField(max_length=50)
    position = models.IntegerField()
    target_pos_x = models.FloatField(null=True)
    target_pos_y = models.FloatField(null=True)
    target_pos_z = models.FloatField(null=True)

    camera_pos_x = models.FloatField(null=True)
    camera_pos_y = models.FloatField(null=True)
    camera_pos_z = models.FloatField(null=True)

    annotation_text = models.TextField(max_length=4000)

    tour = models.ForeignKey(
        Tour,
        null=True,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.title)
