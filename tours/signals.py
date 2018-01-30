import logging
log = logging.getLogger('Tours')

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
    log.debug("pathToDracoEncoder = ")
    log.debug(pathToDracoEncoder)

    # TODO: Upload in a new folder and update the object_path field to the new directory
    upload_dir =  settings.UPLOAD_DIR
    log.debug("UPLOAD_DIR= ")
    log.debug(upload_dir)

    # Path to the .obj uploaded
    objInputPath = instance.object_path.path
    log.debug("objInputPath= ")
    log.debug(objInputPath)

    strIn = str(objInputPath)

    # unquote is used to convert C%3A/rest-of-path to C:/rest-of-path
    strIn =unquote(strIn)
    log.debug("strIn=unquote(strIn) = ")
    log.debug(strIn)

    # The file name with extension .obj
    fileNameWExt = basename(strIn)
    log.debug("fileNameWExt= ")
    log.debug(fileNameWExt)

    # file name WITHOUT extension .obj
    fileName = os.path.splitext(fileNameWExt)[0]
    log.debug("fileName= ")
    log.debug(fileName)

    # Path to input .obj
    strInPath = os.path.dirname(strIn)
    log.debug("strInPath= ")
    log.debug(strInPath)

    # Put output file in same path as the input file
    strOutPath = strInPath
    log.debug("strOutPath= strInPath")
    log.debug(strOutPath)

    # DEBUGGING
    print(strIn)
    print(strOutPath)
    # print(objInSplit)
    # print(objInputPath)
    # print(upload_dir)


    #-------- Sequence of .obj compression into .drc file ---------

    #copy .obj from server host into container
    os.system("docker cp "+"/"+strIn+" dracoctn4:draco/objPool")

    #Execute Draco inside container
    os.system("docker exec dracoctn4 /draco_build/draco_encoder -i "+"/draco/objPool/"+fileName+".obj"+" -o "+"/draco/objPool/"+fileName+".drc")
    
    #Copy compression result from container into host
    #TODO: Identify which command is actually used
    os.system("docker cp "+"dracoctn4:draco/objPool/"+fileName+".drc"+" /"+strOutPath)
    os.system("docker cp "+"dracoctn4:draco/objPool/"+fileName+".drc"+" /"+settings.MEDIA_ROOT+"/renders")
    
    #Clean object compression pool in docker container
    os.system("docker exec dracoctn4 rm "+"/draco/objPool/"+fileName+".obj")
    os.system("docker exec dracoctn4 rm "+"/draco/objPool/"+fileName+".drc")
    
    #Remove uploaded OBJ file from server host
    os.system("rm "+strOutPath+"/"+fileName+".obj")

    #Debugging
    log.debug("os.system argument = ")
    log.debug(pathToDracoEncoder+" draco_encoder.exe -i "+strIn+" -o "+strOutPath+"/"+fileName+".drc")

    # Set the new path of the object to be the output draco file
    instance.object_path = strOutPath+"/"+fileName+".drc"
    Render.objects.filter(pk=instance.pk).update()
    log.debug("New object path = " + instance.object_path.url)
