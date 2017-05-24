from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from tours.models import Render
import os
from os.path import basename,join, dirname

@receiver(post_save, sender=Render)
def create_draco(sender, instance, **kwargs):

    upload_dir =  settings.UPLOAD_DIR
    objInputPath = instance.object_path.url
    objInSplit = os.path.split(os.path.abspath(objInputPath))
    objInFileName = objInSplit[1]
    objInputPath = os.path.dirname(os.path.abspath(objInputPath))
    objInputPath = os.path.join(objInputPath,objInFileName)
    dracoOutputPath =  os.path.dirname(os.path.abspath(objInputPath))
    strIn = str(objInputPath)
    strOut =  str(dracoOutputPath)
    # print(strIn)
    # print(objInSplit)
    # print(objInputPath)
    print(upload_dir)
    # print(strOut)
    os.system("C:///Users///Tfmenard/Documents/GitHub/opm/Debug/draco_encoder.exe -i "+strIn+" -o "+strOut+"/draco.drc" )
