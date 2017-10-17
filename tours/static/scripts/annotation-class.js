var annot_obj_counter = 0;
var AnnotationObj = function (camlookatpoint, camposition) {

  console.log("New annotation created");
  this.name = "annotation_"+annot_obj_counter;
  this.id = annot_obj_counter;
  annot_obj_counter+=1;


  //This is the 2D div
  //TODO: Add more CSS properties of the bubble (color, size, position relative to 3D canvas)
  //Add line that's drawn from div-2-marker (2D->3D)
  this.text = "Default text";

  this.camera_position = new THREE.Vector3();
  this.camera_target = new THREE.Vector3();

  //TODO: Choose particular 3D object (Sphere, Arrow)
  //Position of marker  = camera_target
  this.marker = new THREE.Mesh();

  //TODO: Setter and Getter functions
  this.camera_target.copy(camlookatpoint);
  this.camera_position.copy(camposition);

};


var AnnotationSet = function () {
    this.name = "Name";
    this.queue = [];
    this.queue.curr_annot_index = 0;
};


AnnotationSet.prototype.AddAnnotation = function(AnnotationObj) {
  this.queue.push(AnnotationObj);
};

//Delete when Object is put in seperate file
var temp_array
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

var curr_tooltip;
AnnotationSet.prototype.NextView = function(){
  this.queue.curr_annot_index+=1;

  //If condition to wrap around if last annotation
  if(this.queue.curr_annot_index>this.queue.length -1){ this.queue.curr_annot_index=0; }
  // camera.position.x = this.queue[this.queue.curr_annot_index].camera_position.x;
  // camera.position.y = this.queue[this.queue.curr_annot_index].camera_position.y;
  // camera.position.z = this.queue[this.queue.curr_annot_index].camera_position.z;''
  TWEEN.removeAll();
  var from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };
  var next_cam_pos = this.queue[this.queue.curr_annot_index].camera_position;
  var next_cam_target = this.queue[this.queue.curr_annot_index].camera_target;
  var to = {
    x: this.queue[this.queue.curr_annot_index].camera_position.x,
    y: this.queue[this.queue.curr_annot_index].camera_position.y,
    z: this.queue[this.queue.curr_annot_index].camera_position.z
  };
  var tween_camera = new TWEEN.Tween(from)
    .to(to, 3000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(function () {

    camera.position.x = from.x;
    camera.position.y = from.y;
    camera.position.z = from.z;

    camera.up = new THREE.Vector3(0,0,1);

  })
  // tween_camera.start();

  var from_t = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
  };

  var to_t = {
    x: this.queue[this.queue.curr_annot_index].camera_target.x,
    y: this.queue[this.queue.curr_annot_index].camera_target.y,
    z: this.queue[this.queue.curr_annot_index].camera_target.z
  };
  var tween_lookat = new TWEEN.Tween(from_t)
    .to(to_t, 1000)
    .easing(TWEEN.Easing.Linear.None)
    //onComplete happens way after NextView has finished
    .onComplete(function () {
      //set div position
      var proj = toScreenPosition(mesh, camera);
      curr_tooltip.style.left = proj.x + 'px';
      curr_tooltip.style.top = proj.y + 'px';
      curr_tooltip.style.visibility='visible';
    })
    .onUpdate(function () {

    controls.target.x = from_t.x;
    controls.target.y = from_t.y;
    controls.target.z = from_t.z;

    //camera.up = new THREE.Vector3(0,0,1);

  })
  tween_lookat.start();
  tween_camera.start();

  //Show annotation marker, now implemented as global pointer in the scene
  console.log("------NEXTVIEW ENDING--------------")
  console.log("NextView -(before position.copy) mesh.position = ", mesh.position);
  console.log("NextView -(before position.copy) controls.target = ", this.queue[this.queue.curr_annot_index].camera_target);
  mesh.position.copy(this.queue[this.queue.curr_annot_index].camera_target);
  console.log("NextView -(after position.copy) mesh.position = ", mesh.position);
  console.log("NextView -(after position.copy) controls.target = ", this.queue[this.queue.curr_annot_index].camera_target);
  mesh.up.copy(this.queue[this.queue.curr_annot_index].camera_target);
  console.log("NextView -(after up.copy) mesh.position = ", mesh.position);
  console.log("NextView -(after up.copy) controls.target = ", this.queue[this.queue.curr_annot_index].camera_target);
  mesh.visible = true;

  // //TODO:Make this a function of AnnotationSet
  for(var i = 0; i<= this.queue.length-1; i++){
    if(i!=this.queue.curr_annot_index){
      document.getElementById("tooltip"+i).style.visibility='hidden';
      document.getElementById("tooltip"+i).style.zIndex=-1;
    }
    else{
      // document.getElementById("tooltip"+i).style.visibility='visible';
      document.getElementById("tooltip"+i).style.zIndex=5;
      curr_tooltip = document.getElementById("tooltip"+i);
    }
  }


};

AnnotationSet.prototype.PreviousView = function(){
  console.log("this.queue[this.queue.curr_annot_index].camera_position.x= ", this.queue[this.queue.curr_annot_index].camera_position.x);
  this.queue.curr_annot_index-=1;

  //If condition to wrap around if first annotation
  if(this.queue.curr_annot_index<0){ this.queue.curr_annot_index=this.queue.length-1; }
  console.log("this.queue.curr_annot_index= ", this.queue.curr_annot_index);

  camera.position.x = this.queue[this.queue.curr_annot_index].camera_position.x;
  camera.position.y = this.queue[this.queue.curr_annot_index].camera_position.y;
  camera.position.z = this.queue[this.queue.curr_annot_index].camera_position.z;

  controls.target = this.queue[this.queue.curr_annot_index].camera_target;
  camera.up = new THREE.Vector3(0,0,1);

  for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
    if(i!=this.queue.curr_annot_index){
      document.getElementById("tooltip"+i).style.visibility='hidden';
    }
    else{
      document.getElementById("tooltip"+i).style.visibility='visible';
    }
  }

};

//TODO:Recode this function with new AnnotationSet object
var playing_tour = true;
AnnotationSet.prototype.PlayTour = function(){

  if(playing_tour==true){
    this.queue.curr_annot_index = 0;

    console.log("camera.up=",camera.up);
    // controls.target=AnnotCamLookatPts[tour_counter];
    camera.up = new THREE.Vector3(0,0,1);



    //TODO: Remove this when Play button is integrated
    playing_tour=false;

    TWEEN.removeAll();
    var from = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    };
    var next_cam_pos = this.queue[this.queue.curr_annot_index].camera_position;
    var next_cam_target = this.queue[this.queue.curr_annot_index].camera_target;
    var to = {
      x: this.queue[this.queue.curr_annot_index].camera_position.x,
      y: this.queue[this.queue.curr_annot_index].camera_position.y,
      z: this.queue[this.queue.curr_annot_index].camera_position.z
    };
    var tween_camera = new TWEEN.Tween(from)
      .to(to, 3000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(function () {

      camera.position.x = from.x;
      camera.position.y = from.y;
      camera.position.z = from.z;

      //controls.target = next_cam_target;
      camera.up = new THREE.Vector3(0,0,1);

    })
    // tween_camera.start();

    var from_t = {
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z
    };

    var to_t = {
      x: this.queue[this.queue.curr_annot_index].camera_target.x,
      y: this.queue[this.queue.curr_annot_index].camera_target.y,
      z: this.queue[this.queue.curr_annot_index].camera_target.z
    };
    var tween_lookat = new TWEEN.Tween(from_t)
      .to(to_t, 1000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function () {

      controls.target.x = from_t.x;
      controls.target.y = from_t.y;
      controls.target.z = from_t.z;

      //camera.up = new THREE.Vector3(0,0,1);

    })
    tween_lookat.start();
    tween_camera.start();
    // controls.target = this.queue[this.queue.curr_annot_index].camera_target;

    //camera.up = new THREE.Vector3(0,0,1);

  // //TODO:Make this a function of AnnotationSet
    for(var i = 0; i<= this.queue.length-1; i++){
      if(i!=this.queue.curr_annot_index){
        document.getElementById("tooltip"+i).style.visibility='hidden';
        document.getElementById("tooltip"+i).style.zIndex=-1;
      }
      else{
        document.getElementById("tooltip"+i).style.visibility='visible';
        document.getElementById("tooltip"+i).style.zIndex=5;
      }
    }

    //Show annotation marker, now implemented as global pointer in the scene
    mesh.position.copy(this.queue[this.queue.curr_annot_index].camera_target);
    mesh.up.copy(this.queue[this.queue.curr_annot_index].camera_target);
    mesh.visible = true;

  }

}


//Go to beggining of the annotation set
AnnotationSet.prototype.StartAnnotationTour = function(){
  //Set pointer to start of list
  this.queue.curr_annot_index=0;

  this.updateAnnotation();

};

//TODO: Go to starting position of camera and put controls to origin
AnnotationSet.prototype.StopAnnotationTour = function(){

  this.hideAnnotation();
  hide3DPointerPostion(mesh);
  resetCameraAndControls();
  //Reset pointer to start of list
  this.queue.curr_annot_index=0;

};

//Go to next annotation
AnnotationSet.prototype.NextAnnotation = function(){
  this.queue.curr_annot_index+=1;
  //Wrap around if last annotation
  if(this.queue.curr_annot_index>this.queue.length -1){ this.queue.curr_annot_index=0; }

  this.updateAnnotation();

};

//Go to previous annotation
AnnotationSet.prototype.PreviousAnnotation = function(){

  //Update the current annotation index of the set
  this.queue.curr_annot_index-=1;
  //Wrap around if first annotation
  if(this.queue.curr_annot_index<0){ this.queue.curr_annot_index=this.queue.length -1; }

  this.updateAnnotation();

};

//Update annotation based on current annotation index of the Annotation Set
AnnotationSet.prototype.updateAnnotation = function() {
  var curr_annot_index = this.queue.curr_annot_index;

  this.HandleCamAndControlsTrgtTransition(curr_annot_index);

  update3DPointerPostion(mesh, this);
}

AnnotationSet.prototype.hideAnnotation = function() {
  this.unSelectToolTip();
}

//Select the tooltip to be displayed based on the current annotation index of the Annotaion Set
AnnotationSet.prototype.SelectToolTip = function() {
  var curr_tooltip;
  for(var i = 0; i<= this.queue.length-1; i++){
    if(i!=this.queue.curr_annot_index){

      //Hide all irrelevant tooltips
      document.getElementById("tooltip"+i).style.visibility='hidden';
      document.getElementById("tooltip"+i).style.zIndex=-1;
    }
    else{

      //Put target tooltip on front
      // document.getElementById("tooltip"+i).style.visibility='visible';
      document.getElementById("tooltip"+i).style.zIndex=5;
      curr_tooltip = document.getElementById("tooltip"+i);
    }
  }
  return curr_tooltip;
}

//Unselect the tooltip to be displayed based on the current annotation index of the Annotaion Set
AnnotationSet.prototype.unSelectToolTip = function() {
  var curr_annot_index= this.queue.curr_annot_index;
  //Hide current tooltip
  document.getElementById("tooltip"+curr_annot_index).style.visibility='hidden';
  document.getElementById("tooltip"+curr_annot_index).style.zIndex=-1;
}

//Handle camera and controls transitions based on current annotation and current positions of camera and controls objects
AnnotationSet.prototype.HandleCamAndControlsTrgtTransition = function (curr_annot_index) {

  //Get the tooltip with the id that matches the current annoation index of the AnnotationSet calling the function
  var curr_tooltip = this.SelectToolTip();

  //Reset TWEEN
  TWEEN.removeAll();

  //Starting position of camera
  var from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };

  //Next position of camera
  var to = {
    x: this.queue[this.queue.curr_annot_index].camera_position.x,
    y: this.queue[this.queue.curr_annot_index].camera_position.y,
    z: this.queue[this.queue.curr_annot_index].camera_position.z
  };
  //Camera smooth transition handlers
  var tween_camera = new TWEEN.Tween(from)
    .to(to, 3000)
    .easing(TWEEN.Easing.Exponential.InOut)
    .onUpdate(function () {

    camera.position.x = from.x;
    camera.position.y = from.y;
    camera.position.z = from.z;

    camera.up = new THREE.Vector3(0,0,1);

  })

  //Starting position of controls target
  var from_t = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
  };

  //Next position of controls target
  var to_t = {
    x: this.queue[this.queue.curr_annot_index].camera_target.x,
    y: this.queue[this.queue.curr_annot_index].camera_target.y,
    z: this.queue[this.queue.curr_annot_index].camera_target.z
  };

  //Controls target smooth transition handlers
  var tween_lookat = new TWEEN.Tween(from_t)
    .to(to_t, 1000)
    .easing(TWEEN.Easing.Linear.None)
    //onComplete happens way after NextView has finished
    .onComplete(function () {
      //set div position
      var proj = toScreenPosition(mesh, camera);
      var offset = 100;
      var x_pos = proj.x + offset;
      curr_tooltip.style.left = x_pos + 'px';
      curr_tooltip.style.top = proj.y + 'px';
      curr_tooltip.style.visibility='visible';
    })
    .onUpdate(function () {

    controls.target.x = from_t.x;
    controls.target.y = from_t.y;
    controls.target.z = from_t.z;

  })

  //Initiate smooth transitions
  tween_lookat.start();
  tween_camera.start();

};