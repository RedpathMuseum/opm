from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from urllib.parse import unquote

from tours.models import Render
import os
from os.path import basename,join, dirname

@receiver(post_save, sender=Render)
def create_draco(sender, instance, **kwargs):

    # TODO: Set Dev and Prod paths
    pathToDracoEncoder = settings.DRACO_DIR

    # TODO: Upload in a new folder and update the object_path field to the new directory
    upload_dir =  settings.UPLOAD_DIR

    # Path to the .obj uploaded
    objInputPath = instance.object_path.url
    dracoOutputPath =  os.path.dirname(os.path.abspath(objInputPath))
    strIn = str(objInputPath)
    strOut =  str(dracoOutputPath)

    # unquote is used to convert C%3A/rest-of-path to C:/rest-of-path
    strIn =unquote(strIn)

    # The file name with extension .obj
    fileNameWExt = basename(strIn)

    # file name WITHOUT extension .obj
    fileName = os.path.splitext(fileNameWExt)[0]

    # Path to input .obj
    strInPath = os.path.dirname(os.path.abspath(strIn))

    # Put output file in same path as the input file
    strOutPath = strInPath

    # DEBUGGING
    # print(strOut+"/"+fileName+".drc")
    # print(strIn)
    # print(objInSplit)
    # print(objInputPath)
    # print(upload_dir)
    # print(strOut)

    # Call the draco_encoder.exe executable with its arguments
    os.system(pathToDracoEncoder+"draco_encoder.exe -i "+strIn+" -o "+strOutPath+"/"+fileName+".drc" )

    # Set the new path of the object to be the output draco file
    instance.object_path = strOutPath+"/"+fileName+".drc"
    Render.objects.filter(pk=instance.pk).update()
    print("New object path = " + instance.object_path.url)
