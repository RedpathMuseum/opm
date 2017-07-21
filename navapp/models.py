from django.db import models
from django.conf import settings
from os.path import basename,join

class TeamMember(models.Model):
    name = models.CharField(max_length=200);
    picture = models.ImageField(upload_to=settings.MEDIA_ROOT+"/images")
    professional_background = models.CharField(max_length=500,
    	help_text='Example: PhD (c) Scientology')
    project_position = models.CharField(max_length=200,
    	help_text='Example: VP Communications')
    # this sets the name of the object in the admin interface
    def __str__(self):
        return str(self.name)

    def image_name(self):
        image_name = basename(self.picture.name)
        return image_name



# Create your models here.
