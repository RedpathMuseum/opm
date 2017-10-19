//This script loads all annotations from the existing AnnotationSet object into divs in the page


//Create annotation divs that will be hidden from the loaded information and add them to the Annotation Set
for(var i=0; i< annotations.length; i++){
    var cam_pos = new THREE.Vector3(annotations[i].fields.camera_pos_x,annotations[i].fields.camera_pos_y,annotations[i].fields.camera_pos_z);
    var target_pos = new THREE.Vector3(annotations[i].fields.target_pos_x,annotations[i].fields.target_pos_y,annotations[i].fields.target_pos_z);
    var Annot_obj = new AnnotationObj(target_pos, cam_pos);
    Annot_obj.text = annotations[i].fields.annotation_text;
    CreateToolTip(Annot_obj.text, i);
    // PopulateDiv("annotation", Annot_obj.text);
    console.log(Annot_obj);
    console.log("annotations.length = ",annotations.length)
    Annotation_Set.AddAnnotation(Annot_obj);
    console.log(Annotation_Set);
}
