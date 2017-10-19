//This script contains functions used to create 3D annotations in the admin panel
//It adds function to the AnnotationSet class
//and contains the annotation wizard functions


//Annot Wizard Variables
var step_num = 1;
var num_of_steps = 4+1;

//Debug variable
var DebugMode = false;
//Setting InEditMode to true to enable admin specific functions
var InEditMode = true;

//Add AnnotationObj to AnnotationSet
AnnotationSet.prototype.AddAnnotation = function(AnnotationObj) {
  this.queue.push(AnnotationObj);
};

//Delete AnnotationObj to AnnotationSet
var temp_array;
AnnotationSet.prototype.DeleteAnnotation = function(queue_index){
  temp_array = [];
  for(var i=0; i<this.queue.length-1; i++){
    if(i!=queue_index){
      temp_array[i] = this.queue[i];
    }
  }
  this.queue = temp_array;
  temp_array = null;
};


//Freeze/Save temporarily current target when admin user presses Enter key in buffere array CurrSphereData[]
function SaveCurrentTarget(event){
  var keyCode = event.keyCode;
  if(keyCode==13 && step_num==1 ){
    console.log("Enter key pressed");

    //Freeze 3D marker at point retrieved by latest point saved in CurrSphereData array during checkIntersection() execution
    FreezeNewTarget(CurrSphereData[0], CurrSphereData[1]);

    //Enable confirmation button for the user to save the current target
    document.getElementById("step-target-nxt-btn").disabled = false;
  }
}


//Save current camera position when S key is pressed by admin user in vector buffer
function SaveCameraView(event){
  var keyCode = event.keyCode;
  if(keyCode==83 && step_num==2){
    var CurrCamPos = new THREE.Vector3();
    CurrCamPos.set(camera.position.x, camera.position.y, camera.position.z);
    console.log("CurrCamPos = ", CurrCamPos);
    //AnnotCamPos.push(CurrCamPos)
    // annot_buffer.camera_position.copy(CurrCamPos);
    // console.log("BUFFER", annot_buffer);
    // Annotation_Set.AddAnnotation(annot_buffer);
    // console.log(annot_buffer.name, "ADDED ANNOTATION TO ANNOTATION SET");
    // console.log(Annotation_Set, "THIS IS THE ANNOTATION SET");
    //
    // console.log(Annotation_Set.queue.length);
    // CreateToolTip(Annotation_Set.queue[Annotation_Set.queue.length-1].text, Annotation_Set.queue.length-1);
    // camcounter += 1;
    // console.log("AnnotCamPos=  ", AnnotCamPos[camcounter -1]);

    //Enable confirmation button for the user to save the current camera position
    document.getElementById("step-camview-nxt-btn").disabled = false;
  }

}

//TODO: Figure out which of the two functions below is used and delete the deprecated one
//Save annotation text in text buffer
function SaveAnnotationText(){
  annot_buffer.text = document.getElementById("annot-txt-buffer-val").value
  console.log(annot_buffer.text);
}

//Save annotation text in text buffer
function SaveAnnotationBufferText(){
  annot_buffer.text = document.getElementById("annot-txt-buffer-val").value;
  document.getElementById("tooltip777").getElementsByTagName("p")[0].innerHTML = annot_buffer.text;
  console.log(annot_buffer.text);
}



//Start the creation of a new  3D annotation
function NewAnnotation(){
  console.log("----------------------------------Creating new annotation--------------------");
  //Add listener to any keydown events
  window.addEventListener("keydown", SaveCurrentTarget, false);
  //Start Annotation wizard
  document.getElementById("myWizard-top").style.display = "";
  document.getElementById("myWizard-start").style.display = "";
  document.getElementById("new-annotation-btn").style.display ="none";

}

//Annotation wizard
var stepNode;
var helpMsgNode;
var confirmBtn;
var parentStepNode;
var topNode;
var saveChangesBtn;
function EditAnnotationTrgt(id){
  console.log("----------------------------------Editing annotation-----------------------");
  window.addEventListener("keydown", SaveCurrentTarget, false);
  parentStepNode = document.getElementById(id);
  // parentStepNode.appendChild()
  stepNode = document.getElementById("myWizard-start").cloneNode(true);
  stepNode.style.display = "";

  confirmBtn = $(stepNode).find("[name='Continue']");
  confirmBtn.get()[0].disabled = false;
  confirmBtn.bind("click",function() {
    //Go to next camera view step and then to Save And Cancel state
    //Go back to Save and cancel state
    confirmBtn = $(parentStepNode).find("[name='edit-target']").get()[0].style.display = "none";
    // confirmBtn = $(parentStepNode).find("[name='save-changes']").get()[0].style.display = "";
    // parentStepNode.removeChild(stepNode);
    stepNode.style.display  = "none";
    stepNode = $( "div[step='2']" ).get()[0];
    parentStepNode.appendChild(stepNode);
    stepNode.style.display = "";
    window.removeEventListener("keydown", SaveCurrentTarget, false);
    window.addEventListener("keydown", SaveCameraView, false);
    step_num = 2;
    EditCameraView(id, stepNode, parentStepNode);
  });

  parentStepNode.appendChild(stepNode);
  topNode = document.getElementById("myWizard-top").cloneNode(true);
  topNode.style.display = "";
  //Set controls target to camera_target and enabled updates
  controls.target = annot_buffer.camera_target;
  camera.position.x = annot_buffer.camera_position.x;
  camera.position.y = annot_buffer.camera_position.y;
  camera.position.z = annot_buffer.camera_position.z;

  camera.up = new THREE.Vector3(0,0,1);

  //TODO: Add marker to DB to be able to simply clone it
  //marker_copy = annot_buffer.marker.clone();
  scene.remove(marker_copy);
  marker_copy = mesh.clone();
  marker_copy.position.copy(annot_buffer.camera_target);
  marker_copy.visible = true;
  scene.add(marker_copy);



}

function EditCameraView(id, stepNode, parentStepNode) {

  var confirmBtn = $(stepNode).find("[name='Continue']");
  confirmBtn.get()[0].disabled = false;
  confirmBtn.bind("click",function() {
    // $(parentStepNode).find("[text='description']").get()[0].disabled = false;
    window.removeEventListener("keydown", SaveCameraView, false);
    //TODO: Show annotation with correct text

    saveChangesBtn = $(parentStepNode).find("[name='save-changes']");
    saveChangesBtn.get()[0].style.display = "";
    saveChangesBtn.bind("click", function(){
      console.log(annot_buffer);
      console.log(getAnnotationById(id));
      annot_buffer.text = $(parentStepNode).find("[text='description']").get()[0].value;
      EditAnnotationById(id);
      annot_buffer = new AnnotationObj(0, 0);
      step_num =1;
    })
  });
}


//Cancel new annotation at any point in the wizard
function CancelNewAnnotation(){
  console.log("Canceled New Annotation");
  annot_buffer = new AnnotationObj(0,0);
  console.log(annot_buffer);
  marker_copy.visible = false;
  window.removeEventListener("keydown", SaveCurrentTarget, false);
  resetCameraAndControls();
  EndAnnotationWizard();
}


//Freeze Sphere/3D marker at target point
var annot_buffer;
function FreezeSphere(camlookatpoint, camposalongnormal) {

  //FreezeMarker
  console.log('FreezingSphere');

  var marker_copy = new THREE.Mesh();
  marker_copy = mesh.clone();


  marker_copy.position.copy(camlookatpoint);
  scene.add(marker_copy);

  var dummycamposnormal = new THREE.Vector3();
  dummycamposnormal.copy(camposalongnormal);

  AnnotSpheres.push(marker_copy);
  // AnnotCamPos.push(dummycamposnormal);

  AnnotCamLookatPts.push(marker_copy.position);
  // console.log("AnnotCamPos = ", AnnotCamPos[camcounter]);
  // camera.lookAt(AnnotCamLookatPts[camcounter]);
  annot_buffer = new AnnotationObj(camlookatpoint, camposalongnormal);
  annot_buffer.marker =  marker_copy;

  //-Change camera position and target
  console.log("camera.up=",camera.up);

  //Note that you set controls.target to an object's position, it will follow its postiiton
  controls.target=marker_copy.position;
  camera.up = new THREE.Vector3(0,0,1);

  // camera.position.x=AnnotCamPos[camcounter].x;
  // camera.position.y=AnnotCamPos[camcounter].y;
  // camera.position.z=AnnotCamPos[camcounter].z;
  camera.position.x=dummycamposnormal.x;
  camera.position.y=dummycamposnormal.y;
  camera.position.z=dummycamposnormal.z;

  //-Create Buffer View.camera_target
  //-Create Buffer View.camera_position
  //-Wait for user input (Save or Cancel)
  //-Create and populate new View
  //-Add View to Queue/Annot tour
  //-Prompt user to edit text


}


//Freeze Sphere/3D marker at target point
annot_buffer = new AnnotationObj(0, 0);
function FreezeNewTarget(camlookatpoint, camposalongnormal) {
  scene.remove(marker_copy);
  //FreezeMarker
  console.log('FreezingSphere');

  marker_copy = mesh.clone();
  marker_copy.visible = true;

  marker_copy.position.copy(camlookatpoint);

  scene.add(marker_copy);

  var dummycamposnormal = new THREE.Vector3();
  dummycamposnormal.copy(camposalongnormal);

  AnnotSpheres.push(marker_copy);
  // AnnotCamPos.push(dummycamposnormal);

  AnnotCamLookatPts.push(marker_copy.position);
  // console.log("AnnotCamPos = ", AnnotCamPos[camcounter]);
  // camera.lookAt(AnnotCamLookatPts[camcounter]);
  // annot_buffer = new AnnotationObj(camlookatpoint, camposalongnormal);

  //Update annot_buffer object
  annot_buffer.camera_target.copy(camlookatpoint);
  annot_buffer.camera_position.copy(camposalongnormal);
  annot_buffer.marker =  marker_copy;

  //-Change camera position and target
  console.log("camera.up=",camera.up);

  //Note that you set controls.target to an object's position, it will follow its postiiton
  controls.target=marker_copy.position;
  camera.up = new THREE.Vector3(0,0,1);

  // camera.position.x=AnnotCamPos[camcounter].x;
  // camera.position.y=AnnotCamPos[camcounter].y;
  // camera.position.z=AnnotCamPos[camcounter].z;
  camera.position.x=dummycamposnormal.x;
  camera.position.y=dummycamposnormal.y;
  camera.position.z=dummycamposnormal.z;

  //-Create Buffer View.camera_target
  //-Create Buffer View.camera_position
  //-Wait for user input (Save or Cancel)
  //-Create and populate new View
  //-Add View to Queue/Annot tour
  //-Prompt user to edit text


}

function ChooseCameraPos(){

}



//TODO:Recode this function with new AnnotationSet object
function SelectViewFromIndex(view_index){

  camera.position.x=AnnotCamPos[view_index].x;
  camera.position.y=AnnotCamPos[view_index].y;
  camera.position.z=AnnotCamPos[view_index].z;
  controls.target=AnnotCamLookatPts[view_index];
  camera.up = new THREE.Vector3(0,0,1);
  for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
    if(i!=tour_counter){
      document.getElementById("tooltip"+i).style.visibility='hidden';
    }
    else{
      document.getElementById("tooltip"+i).style.visibility='visible';
    }
  }
}



//TODO: Make EraseTour function and EditSlectedView function
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

//TODO: Adapt this to new AnnotationSet object
function ChangeAnnotOrder(){
  console.log("-----Before Move AnnotCamPos =",AnnotCamPos[0]);
  console.log("-----Before Move AnnotCamPos =",AnnotCamPos[1]);
  AnnotCamPos.move(0, 1);
  AnnotCamLookatPts.move(0,1);
  console.log("-----After Move AnnotCamPos =",AnnotCamPos[0]);
  console.log("-----After Move AnnotCamPos =",AnnotCamPos[1]);

}