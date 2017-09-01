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
    objInputPath = instance.object_path.url
    log.debug("objInputPath= ")
    log.debug(objInputPath)

    dracoOutputPath =  settings.DRACO_OUTPUT_PATH
    log.debug("dracoOutputPath= ")
    log.debug(dracoOutputPath)

    strIn = str(objInputPath)
    strOut =  str(dracoOutputPath)
    log.debug("strIn= ")
    log.debug(strIn)
    log.debug("strOut= ")
    log.debug(strOut)

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
    # print(strOut+"/"+fileName+".drc")
    print(strIn)
    print(strOutPath)
    # print(objInSplit)
    # print(objInputPath)
    # print(upload_dir)
    # print(strOut)

    # Call the draco_encoder.exe executable with its arguments
    #os.system(pathToDracoEncoder+"draco_encoder.exe -i "+strIn+" -o "+strOutPath+"/"+fileName+".drc" )
    #os.system("cd "+pathToDracoEncoder)
    os.system("docker cp "+"/"+strIn+" dracoctn4:draco/objPool")
    #os.system("docker run draco-ctn-1 -v " +strOutPath+":draco/objPool"+" draco/draco_encoder -i "+"/"+strIn+" -o "+"/"+strOutPath+"/"+fileName+".drc")
    os.system("docker exec dracoctn4 /draco/draco_encoder -i "+"/draco/objPool/"+fileName+".obj"+" -o "+"/draco/objPool/"+fileName+".drc")
    #os.system("docker cp "+"dracoctn4:draco/objPool "+" /"+strOutPath+"/"+fileName+".drc")
    os.system("docker cp "+"dracoctn4:draco/objPool/"+fileName+".drc"+" /"+strOutPath)
    os.system("docker cp "+"dracoctn4:draco/objPool/"+fileName+".drc"+" /"+"/var/www/opm/media/renders")
    #TODO Add in production condition for static collection
    os.system("python3 manage.py collectstatic --noinput")

    log.debug("os.system argument = ")
    log.debug(pathToDracoEncoder+" draco_encoder.exe -i "+strIn+" -o "+strOutPath+"/"+fileName+".drc")

    # Set the new path of the object to be the output draco file
    instance.object_path = strOutPath+"/"+fileName+".drc"
    Render.objects.filter(pk=instance.pk).update()
    log.debug("New object path = " + instance.object_path.url)
