function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.context.canvas.width;
    var heightHalf = 0.5*renderer.context.canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };

};


//update 3D pointer position to match the position of the annotation being viewed
function update3DPointerPostion(mesh, AnnotationSet) {
  //Show annotation marker implemented as global pointer in the scene
  mesh.position.copy(AnnotationSet.queue[AnnotationSet.queue.curr_annot_index].camera_target);
  //update the 3D marker's up vector to point in the right direction
  mesh.up.copy(AnnotationSet.queue[AnnotationSet.queue.curr_annot_index].camera_target);
  mesh.visible = true;
}

function hide3DPointerPostion(mesh) {
  mesh.visible = false;
}