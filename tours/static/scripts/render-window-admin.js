var container, camera, scene, renderer, css3d_renderer, LeePerryMesh, controls, group, draco_mesh;

//Global variables for pointing in 3D view
var canvas_dim =  document.getElementById('canvas3D');
var canvas_rect = canvas_dim.getBoundingClientRect();

//Set true in browser console to debug THREE.js actions

var DebugMode = false;
var InEditMode = true;

var LENGTH = screen.height;
var WIDTH = screen.width * .75;
if (screen.width <= 960) {
    WIDTH = screen.width * .50;
}

var CAMERA_DISTANCE = -20;

var camcounter =0;
var tour_counter=0;

//JSON Loader's variables for files paths
// var object_to_load_obj_path = '../models/Homo_Erectus/Low_180.json';
// var object_to_load_colormap_path = '../models/Homo_Erectus/ALBEDO1k.jpg';
// var object_to_load_specmap_path = '../models/Homo_Erectus/SPEC1K.jpg';
// var object_to_load_normalmap_path = '../models/Homo_Erectus/NORMAL1K.jpg';


var camlookat_start = new THREE.Vector3(0.018518396076858696, 0.08320761783954866,-0.9963601669693058);
var camposition_start = new THREE.Vector3(-5.488823519163917, 4.861637666233516, 221.22000845737145);

//Configuration variables set in edit mode
var AnnotSpheres = [];
var AnnotCamPos = [];
var AnnotCamLookatPts = [];
//Configuration variables set in edit mode

//Needed for OBJLoader
var textureLoader = new THREE.TextureLoader();


//Variables for Raycaster
var x;
var y;
var raycaster;
var mesh;
var stl_1 = new THREE.Mesh();
var cameraTarget = new THREE.Mesh( new THREE.CubeGeometry(0,0,0));
var line;
var mouseHelper;
var mouse = new THREE.Vector2();

var intersection = {
intersects: false,
point: new THREE.Vector3(),
normal: new THREE.Vector3()
};

var camlookatpoint = THREE.Vector3();
var camposalongnormal = THREE.Vector3();

var p = new THREE.Vector3( 0, 0, 0 );
var r = new THREE.Vector3( 0, 0, 0 );
var s = new THREE.Vector3( 10, 10, 10 );
var up = new THREE.Vector3( 0, 1, 0 );
var check = new THREE.Vector3( 1, 1, 1 );

//Variables for Raycaster

//Variables for annotation sphere
var SphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
var SphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var Sphere = new THREE.Mesh( SphereGeometry, SphereMaterial );

var CurrSphereData = [];

var tooltiptext = [];
var pTagArray = [];
//Variables for annotation sphere


//3D Web content initialization
var Element = function ( id, x, y, z, ry ) {

				var div = document.createElement( 'div' );
				div.style.width = '480px';
				div.style.height = '360px';
				div.style.backgroundColor = '#000';

				var iframe = document.createElement( 'iframe' );
				iframe.style.width = '480px';
				iframe.style.height = '360px';
				iframe.style.border = '0px';
				iframe.src = [ 'http://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
				div.appendChild( iframe );

				var object = new THREE.CSS3DObject( div );
				object.position.set( x, y, z );
				object.rotation.y = ry;

				return object;

};




//3D Web content initialization


init();
animate();


function init() {

    // HTML Container for the 3D widget
    var canvas3D = document.getElementById('canvas3D');

    //Uncomment or place in main.css to set the canvas parameters
    // creaeting canvas for render window
    // var canvas3D = document.createElement( 'div' );
    // canvas3D.style.position = 'static';
    // canvas3D.style.top = '100px';
    // canvas3D.style.width = '200px';
    // //canvas3D.style.backgroundColor = #0000;
    // document.body.appendChild( canvas3D );

    // scene
    scene = new THREE.Scene();

    // renderer
    renderer = new THREE.WebGLRenderer({canvas: canvas3D} );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    console.log( document.getElementById('3d_content').getBoundingClientRect());
    renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );
    renderer.setClearColor( 0xF2F2F2, 1);



    // camera
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 5000 );
    camera.position.set(500, 350, 750);

    scene.add( camera ); // required, because we are adding a light as a child of the camera

    //Add annotation sphere
    scene.add( Sphere );
    Sphere.visible = false;



    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // lights
    scene.add( new THREE.AmbientLight( 0x222222 ) );

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( light );

    // Loading a .stl file
    var loader = new THREE.STLLoader();
    //TODO: Use variable for market object
    loader.load( '../../../../../static/models/Arrow.stl', function ( geometry ) {

       var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
       mesh = new THREE.Mesh( geometry, material );
       //mesh.scale.set(10,10,10);

      //  stl_1 = mesh.clone();
       scene.add( mesh );

      }
     );

      // camera.lookAt(stl_1.position)
      // camera.position.x=stl_1.position.x - 40;
      // camera.position.y=stl_1.position.y + 40 ;
      // camera.position.z=CAMERA_DISTANCE+20;
      //
      // controls.target = new THREE.Vector3(stl_1.position.x, stl_1.position.y, CAMERA_DISTANCE);
      // controls.minDistance = 50;
      // controls.maxDistance = 200;

      //Loading a .obj file
      //TODO:
      //Successfully load the original texture

      var texture = new THREE.Texture();
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
				var onError = function ( xhr ) {
				};

    // TODO: Save OBJLoader initialization
//      var manager = new THREE.LoadingManager();
//      // model
//				var loader = new THREE.OBJLoader( manager );
//				loader.load( '../models/Trott_life_tentacules_with_colors_smooth_E_texture.obj', function ( object ) {
//
//          object.traverse( function ( child ) {
//						if ( child instanceof THREE.Mesh ) {
//							child.material.map = texture;
//						}
//					} );
//					object.position.y = - 95;
//					scene.add( object );
//				}, onProgress, onError );

        //Load JSON 3D object
        // loadJSON();
        loadDracoModel();


        //Code for Raycaster
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

        // Controls
        controls = new THREE.TrackballControls( camera, canvas3D );
      	controls.minDistance = 1;
      	controls.maxDistance = 1000;

        raycaster = new THREE.Raycaster()

        mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
        mouseHelper.visible = false;
        scene.add( mouseHelper );

        line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
      	scene.add( line );

        window.addEventListener( 'resize', onWindowResize, false );
        var moved = false;
        controls.addEventListener( 'change', function() {
          moved = true;
        } );
        window.addEventListener( 'mousedown', function () {
          moved = false;
        }, false );

        window.addEventListener( 'mouseup', function() {
          checkIntersection();
          // if ( ! moved ){
          //   FreezeSphere(CurrSphereData[0], CurrSphereData[1]);
          // }
        });
        window.addEventListener( 'mousemove', onTouchMove );
        window.addEventListener( 'touchmove', onTouchMove );

}

function onTouchMove( event ) {
  if ( event.changedTouches ) {
    x = event.changedTouches[ 0 ].pageX;
    y = event.changedTouches[ 0 ].pageY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }
  if (DebugMode == true)
  {
    console.log('This is mouse x real '+event.clientX);
    console.log('This is mouse y real '+event.clientY);
  }

  mouse.x = ( (x - canvas_rect.left) / (canvas_rect.right - canvas_rect.left) ) * 2 - 1;
  mouse.y = - ( (y -  canvas_rect.top) / (canvas_rect.bottom - canvas_rect.top) ) * 2 + 1;
  if (DebugMode == true)
  {
    console.log("canvas_rect = ", canvas_rect)
    console.log('This is mouse x relative '+mouse.x);
    console.log('This is mouse y relative '+mouse.y);
  }

  if(InEditMode ==  true)
  {
      checkIntersection();
  }

}

function checkIntersection() {
  // if ( ! LeePerryMesh ) return;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( [ draco_mesh ] );
  if ( intersects.length > 0 ) {
    var p = intersects[ 0 ].point;
    mouseHelper.position.copy( p );
    intersection.point.copy( p );
    var n = intersects[ 0 ].face.normal.clone();
    n.multiplyScalar( 10 );
    n.add( intersects[ 0 ].point );
    intersection.normal.copy( intersects[ 0 ].face.normal );
    mouseHelper.lookAt( n );
    line.geometry.vertices[ 0 ].copy( intersection.point );
    line.geometry.vertices[ 1 ].copy( n );
    line.geometry.verticesNeedUpdate = true;
    intersection.intersects = true;
    camlookatpoint = line.geometry.vertices[ 0 ].copy( intersection.point );
    camposalongnormal = line.geometry.vertices[ 1 ].copy( n );
    CurrSphereData[0] = camlookatpoint;
    CurrSphereData[1] = camposalongnormal;
    if(InEditMode == true){
      // Sphere.position.copy(camlookatpoint);
      // Sphere.visible = true;
      mesh.position.copy(camlookatpoint);
      mesh.visible = true;
      var focalPoint = new THREE.Vector3(
          mesh.position.x + camposalongnormal.x,
          mesh.position.y + camposalongnormal.y,
          mesh.position.z + camposalongnormal.z
      );
      //mesh.up.set(1,0,0);
      mesh.lookAt(focalPoint);
    }
    else{
      // Sphere.visible= false;
      //mesh.visible= false;
    }

  }
  else {
    intersection.intersects = false;
    // Sphere.visible = false;
    //mesh.visible = false;
  }
}
//Code for Raycaster

var annot_obj_counter = 0;
var AnnotationObj = function (camlookatpoint, camposition) {

  console.log("New annotation created");
  this.name = "annotation_"+annot_obj_counter;
  annot_obj_counter+=1;
  //camcounter+=1;

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

    camera.up = new THREE.Vector3(0,1,0);

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

  //camera.up = new THREE.Vector3(0,1,0);

  })
  tween_lookat.start();
  tween_camera.start();


/// //TODO:Make this a function of AnnotationSet
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
  camera.up = new THREE.Vector3(0,1,0);

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
//TODO:Add StopTour function
var playing_tour = true;
AnnotationSet.prototype.PlayTour = function(){

  if(playing_tour==true){
    this.queue.curr_annot_index = 0;
    camera.position.x = this.queue[this.queue.curr_annot_index].camera_position.x;
    camera.position.y = this.queue[this.queue.curr_annot_index].camera_position.y;
    camera.position.z = this.queue[this.queue.curr_annot_index].camera_position.z;
    controls.target = this.queue[this.queue.curr_annot_index].camera_target;

    console.log("camera.up=",camera.up);
    // controls.target=AnnotCamLookatPts[tour_counter];
    camera.up = new THREE.Vector3(0,1,0);


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
      camera.up = new THREE.Vector3(0,1,0);

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

      //camera.up = new THREE.Vector3(0,1,0);

    })
    tween_lookat.start();
    tween_camera.start();
    // controls.target = this.queue[this.queue.curr_annot_index].camera_target;

    //camera.up = new THREE.Vector3(0,1,0);

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

  }

}



//TODO: Recode this function and put in GUI to handle user putting object out of sight
function ResetCamera() {
      //
      // camera.lookAt(camlookat_start);
      // camera.position.x = camposition_start.x;
      // camera.position.x = camposition_start.y;
      // camera.position.x = camposition_start.z;
      // console.log('Reset camera');
}

function NkeyDown(event){
  var keyCode = event.keyCode;
  if(keyCode==78){
    console.log("N key pressed");
    FreezeSphere(CurrSphereData[0], CurrSphereData[1]);
    window.removeEventListener("keydown", NkeyDown, false);
    window.addEventListener("keydown", SkeyDown, false);

  }
}

function SkeyDown(event){
  var keyCode = event.keyCode;
  if(keyCode==83){
    window.removeEventListener("keydown", SkeyDown, false);
    var CurrCamPos = new THREE.Vector3();
    CurrCamPos.set(camera.position.x, camera.position.y, camera.position.z);
    console.log("CurrCamPos = ", CurrCamPos);
    //AnnotCamPos.push(CurrCamPos)
    annot_buffer.camera_position.copy(CurrCamPos);
    console.log("BUFFER", annot_buffer);
    Annotation_Set.AddAnnotation(annot_buffer);
    console.log(annot_buffer.name, "ADDED ANNOTATION TO ANNOTATION SET");
    console.log(Annotation_Set, "THIS IS THE ANNOTATION SET");
    document.getElementById("annot-txt-buffer").style.visibility='visible';
    for(var i = 0; i<= cameraGUI.Tips.length-1; i++){
      if(i!=camcounter){
        console.log(i);
        document.getElementById("tooltip"+i).style.visibility='hidden';
      }
    }

    console.log(Annotation_Set.queue.length);
    CreateToolTip(Annotation_Set.queue[Annotation_Set.queue.length-1].text, Annotation_Set.queue.length-1);
    camcounter += 1;
    console.log("AnnotCamPos=  ", AnnotCamPos[camcounter -1]);

  }

}

function PopulateDiv(id, text) {
  var div = document.getElementById(id);
  p_tag = div.getElementsByTagName("p")[0];
  p_tag.innerHTML  = text;


}

function CreateToolTip(tooltiptext, camcounter){
  //Function to remove a div
  // if(annotcounter != 0){
  //   var element = document.getElementById("newdiv");
  //   element.parentNode.removeChild(element);
  //   console.log('remove');
  // }
  var mydiv = document.getElementById('mydiv');
  console.log(mydiv);
  var newdiv = document.createElement("div");

  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  newdiv.innerHTML = newPTag;
  newdiv.setAttribute("class", "element");
  var div_id = "tooltip"+camcounter;
  newdiv.setAttribute("id", div_id);
  mydiv.appendChild(newdiv);
  console.log('Im fine');

  //Change annotation
  var color = window.getComputedStyle(
    document.querySelector('.element'), ':after'
  ).getPropertyValue('left');
  console.log(color);
  color = "30px";

  console.log(color);

  var annot_div = document.getElementsByClassName("element")[camcounter];
 annot_div.style.zIndex = -1-camcounter;
 annot_div.style.visibility = "hidden";

}

function ChangeToolTipText(tooltiptext, tooltip_id){

  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  var selected_div = document.getElementById(tooltip_id);
  console.log('----Selected DIV------', selected_div);
  selected_div.innerHTML = newPTag;
}


function NewAnnotation(){
  console.log("----------------------------------Creating new annotation--------------------0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
  window.addEventListener("keydown", NkeyDown, false);
  document.getElementById("annot-txt-buffer").style.visibility = "visible"

}

function CancelNewAnnotation(){
  console.log("Canceled New Annotation");
  annot_buffer = null;
  console.log(annot_buffer);
  window.removeEventListener("keydown", NkeyDown, false);
}



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
  camera.up = new THREE.Vector3(0,1,0);

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
  camera.up = new THREE.Vector3(0,1,0);
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


function loadLeePerrySmith( callback ) {
  var loader = new THREE.JSONLoader();
  loader.load( '../models/Homo_Erectus/Low.js', function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      specular: 0x111111,
      map: textureLoader.load( '../models/Homo_Erectus/ALBEDO1k.jpg' ),
      specularMap: textureLoader.load( '../models/Homo_Erectus/SPEC1K.jpg' ),
      normalMap: textureLoader.load( '../models/Homo_Erectus/NORMAL1K.jpg' ),
      normalScale: new THREE.Vector2( 0.75, 0.75 ),
      shininess: 25
    } );
    LeePerryMesh = new THREE.Mesh( geometry, material );
    scene.add( LeePerryMesh );
    LeePerryMesh.scale.set( 10, 10, 10 );
    //scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
    //scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
    console.log('Loaded Perryz Smith')
  } );
}

//JSON Loader
function loadJSON( callback ) {
  var loader = new THREE.JSONLoader();
  loader.load( object_to_load_obj_path, function( geometry ) {
    var material = new THREE.MeshPhongMaterial( {
      specular: 0x111111,
      map: textureLoader.load( object_to_load_colormap_path ),
      specularMap: textureLoader.load( object_to_load_specmap_path ),
      normalMap: textureLoader.load( object_to_load_normalmap_path),
      normalScale: new THREE.Vector2( 0.75, 0.75 ),
      shininess: 25
    } );
    LeePerryMesh = new THREE.Mesh( geometry, material );
    scene.add( LeePerryMesh );
    LeePerryMesh.scale.set( 3, 3, 3 );
    //scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
    //scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
    console.log('Loaded Perry Smith')
  } );
}
//JSON Loader

//LoadOneDracoModel
function loadDracoModel() {
  var loader = new THREE.DRACOLoader();

  //TODO: This takes out the extension and replaces it for a .drc. This is because the post_save signal function updates after a few saved_annotations
  //Should solve this issue in backend else the input obj will always be needed and take storage space on server
  object_to_load_obj_path = object_to_load_obj_path.substr(0, object_to_load_obj_path.lastIndexOf(".")) + ".drc";

  // TEST speed .obj vs .obj
  // object_to_load_path = "../../static\models\Homo_Erectus\he_og\Taung_Child_Top\Taung_Child_Top.obj"
    loader.load( object_to_load_obj_path, function ( geometry ) {
      geometry.computeVertexNormals();
      var material = new THREE.MeshPhongMaterial( {
        specular: 0x111111,
        //map: textureLoader.load( '../../static/models/Homo_Erectus/he_og/Taung_Child_Top/Taung_Child_Top01.jpg' ),
        //specularMap: textureLoader.load('../../static/models/leeperrysmith/Map-SPEC.jpg' ),
        //normalMap: textureLoader.load( '../../static/models/Homo_Erectus/he_og/Taung_Child_Top/NormalMap_1.jpg'),
        map: textureLoader.load( object_to_load_colormap_path ),
        normalMap: textureLoader.load( object_to_load_normalmap_path),
        normalScale: new THREE.Vector2( 0.75, 0.75 ),
        shininess: 25
      } );

      //var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
      console.log("loadDracomodel - geometry = ",geometry);

      var bufferGeometry = geometry;
      bufferGeometry.computeVertexNormals();
      bufferGeometry.computeBoundingBox();
      const sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
      const sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
      const sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
      const diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
      const scale = 1.0 / diagonalSize;
      const midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
      const midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
      const midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;

      //geometry.scale(scale,scale,scale);
      geometry.scale(10,10,10);
      draco_mesh = new THREE.Mesh( geometry, material );
      scene.add( draco_mesh );
    } );
}

//LoadOneDracoModel
function loadOneModel() {
    let draco_file = new XMLHttpRequest();
    draco_file.open("GET", "../../static/models/leeperrysmith/bunny.drc", true);
    draco_file.responseType = "arraybuffer";
    draco_file.send();

    draco_file.onload = function(e) {
      console.log("loadOneModel - draco_file.response = ", draco_file);
      loadGeometry(draco_file.response);


    }
}

function onWindowResize() {



      // camera.aspect = window.innerWidth / window.innerHeight;
      camera.aspect = document.getElementById('3d_content').getBoundingClientRect().width/window.innerHeight;

      camera.updateProjectionMatrix();

      // renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );

}

function animate() {
    canvas_rect = canvas_dim.getBoundingClientRect();
    requestAnimationFrame( animate );
    controls.update();
    TWEEN.update();
    render();

}

function render() {

    // camera.lookAt(cameraTarget.position);
    renderer.render( scene, camera );
  // css3d_renderer.render ( scene, camera);

    var intersects = raycaster.intersectObjects(scene.children);
}
