var container, camera, scene, scene_css3d, renderer, css3d_renderer, LeePerryMesh, loaded_mesh, controls, group;
var canvas_dim =  document.getElementById('canvas3D');
var canvas_rect = canvas_dim.getBoundingClientRect();
/*var WIDTH = 3/4 * screen.width;*/
var LENGTH = screen.height;
var WIDTH = screen.width * .75;
if (screen.width <= 960) {
    WIDTH = screen.width * .50;
}

var CAMERA_DISTANCE = -20;

var camcounter =0;
var tour_counter=0;

var DebugMode = false;
var InEditMode = false;
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

//var DracoModule = Module;

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
				div.style.width = '10%';
				div.style.height = '10%';
				div.style.backgroundColor = '#000';

				var iframe = document.createElement( 'iframe' );
				iframe.style.width = '10%';
				iframe.style.height = '10%';
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
    var css3d_div = document.getElementById('css3d_div');

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
    //scene.background = new THREE.Color( 0x00ff00 );

    scene_css3d = new THREE.Scene();

    // renderer
    renderer = new THREE.WebGLRenderer({canvas: canvas3D});
    renderer.alpha = true;
    //renderer.setClearColor( 0x0fff00, 0.5 );
    renderer.domElement.style.zIndex = 20;
    //renderer.setSize( window.innerWidth, window.innerHeight );
    console.log( document.getElementById('3d_content').getBoundingClientRect());
    renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );
    renderer.setClearColor( 0xffffff, 0);

    //Cast renderers in DOM elements
    //canvas3D.appendChild(renderer.domElement);
    //css3d_renderer.domElement.appendChild(renderer.domElement);

    // // CSS3D Renderer
    css3d_renderer = new THREE.CSS3DRenderer();
    //css3d_renderer.setSize(  document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight);
    //css3d_renderer.domElement.style.position = 'absolute';
    //css3d_renderer.domElement.style.top = 0;

    //css3d_div.appendChild(css3d_renderer.domElement);
    //css3d_renderer.domElement.appendChild(renderer.domElement);

    //css3d_div.appendChild( css3d_renderer.domElement );
    // CSS3D Renderer




    // camera
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 5000 );
    camera.position.set(0,0, -1000);

    scene.add( camera ); // required, because we are adding a light as a child of the camera

    //Add annotation sphere
    scene.add( Sphere );
    Sphere.visible = false;

    //3D Web content
    // group = new THREE.Group();
		// group.add( new Element( 'njCDZWTI-xg', -1000,-1110,1110, 0 ) );
		// //group.add( new Element( 'HDh4uK9PvJU', 0, 0, 0, Math.PI / 2 ) );
		// //group.add( new Element( 'OX9I1KyNa8M', 0, 0, 0, Math.PI ) );
		// group.add( new Element( 'nhORZ6Ep_jE', -1000,-1110,1110, - Math.PI / 2 ) );
		// scene_css3d.add( group );
    // console.log('added group')
    // console.log(group);
    //
    // var grid_el = document.createElement( 'div' );
    // grid_el.className = 'element';
    // grid_el.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
    // var object_div = new THREE.CSS3DObject( grid_el );
    // object_div.position.set( -1000,-1110,1110);
    // //object_div.scale.set(1,10,10);
    // scene_css3d.add(object_div);
    //
    // var blocker = document.getElementById( 'blocker' );
		// blocker.style.display = 'none';
    //
		// document.addEventListener( 'mousedown', function () { blocker.style.display = ''; } );
		// document.addEventListener( 'mouseup', function () { blocker.style.display = 'none'; } );
    //3D Web content



    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // lights
    scene.add( new THREE.AmbientLight( 0xffffff ) );

    var light = new THREE.PointLight( 0xffffff, 0.8 );
    //camera.add( light );


  // TODO Save STLLoader initialization dead code block
    // Loading a .stl file
    var loader = new THREE.STLLoader();

    loader.load( '../../static/models/Arrow.stl', function ( geometry ) {

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
        //loadJSON();
        //loadOneModel();
        loadDracoModel();


        //Code for Raycaster
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

        // Controls
        controls = new THREE.TrackballControls( camera, canvas3D );
      	controls.minDistance = 1;
      	controls.maxDistance = 1000;
        console.log("init() --- controls.target = ", controls.target);

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
          // checkIntersection();
          // if ( ! moved ){
          //   FreezeSphere(CurrSphereData[0], CurrSphereData[1]);
          // }
        });
        window.addEventListener( 'mousemove', onTouchMove );
        window.addEventListener( 'touchmove', onTouchMove );

        ////////////////////////////////////////////////////////////////////////////////
        //          handle arToolkitSource
        ////////////////////////////////////////////////////////////////////////////////
        var arToolkitSource = new THREEx.ArToolkitSource({
          // to read from the webcam 
          sourceType : 'webcam',
          
          // // to read from an image
          // sourceType : 'image',
          // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',    
          // to read from a video
          // sourceType : 'video',
          // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',   
        })
        arToolkitSource.init(function onReady(){
          onWindowResize()
        })


        ////////////////////////////////////////////////////////////////////////////////
        //          initialize arToolkitContext
        ////////////////////////////////////////////////////////////////////////////////
        
        // create atToolkitContext
        var arToolkitContext = new THREEx.ArToolkitContext({
          cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
          detectionMode: 'mono',
        })
        // initialize it
        arToolkitContext.init(function onCompleted(){
          // copy projection matrix to camera
          camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
        })


        ////////////////////////////////////////////////////////////////////////////////
        //          Create a ArMarkerControls
        ////////////////////////////////////////////////////////////////////////////////
        
        // init controls for camera
        var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
          type : 'pattern',
          patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
          // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
          // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
          changeMatrixMode: 'cameraTransformMatrix'
        })
        // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
        scene.visible = false

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
  console.log("checkIntersection - BEGIN")
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( [ loaded_mesh ] );
  if ( intersects.length > 0 ) {
    var p = intersects[ 0 ].point;
    mouseHelper.position.copy( p );
    intersection.point.copy( p );
    var n = intersects[ 0 ].face.normal.clone();
    n.add( intersects[ 0 ].point );
    intersection.normal.copy( intersects[ 0 ].face.normal );
    mouseHelper.lookAt( n );
    line.geometry.vertices[ 0 ].copy( intersection.point );
    line.geometry.vertices[ 1 ].copy( n );
    line.geometry.verticesNeedUpdate = true;
    intersection.intersects = true;
    camlookatpoint = line.geometry.vertices[ 0 ].copy( intersection.point );
    camposalongnormal = line.geometry.vertices[ 1 ].copy( n );
    if(DebugMode == true)
    {
      console.log("camlookatpoint");
      console.log(camlookatpoint);
      console.log("camposalongnormal");
      console.log(camposalongnormal);
      console.log('camcurrentlook');
      console.log(camera.getWorldDirection());
      console.log('camcurrentposition');
      console.log(camera.position);
    }
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
//TODO:Add StopTour function
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

//Different than the AnnotationSet function with TWEEN as the annotation text is hidden
function camAndCtrlTransition(nxtCamPos, nxtCtrlsTrgt) {
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
    x: nxtCamPos.x,
    y: nxtCamPos.y,
    z: nxtCamPos.z
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
    x: nxtCtrlsTrgt.x,
    y: nxtCtrlsTrgt.y,
    z: nxtCtrlsTrgt.z
  };

  //Controls target smooth transition handlers
  var tween_lookat = new TWEEN.Tween(from_t)
    .to(to_t, 1000)
    .easing(TWEEN.Easing.Linear.None)
    //onComplete happens way after NextView has finished
    .onComplete(function () {


    })
    .onUpdate(function () {

    controls.target.x = from_t.x;
    controls.target.y = from_t.y;
    controls.target.z = from_t.z;

  })

  //Initiate smooth transitions
  tween_lookat.start();
  tween_camera.start();
}

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

//TODO: Recode this function and put in GUI to handle user putting object out of sight
function resetCameraAndControls() {
  var origin = new THREE.Vector3(0,0,0);
  //TODO: make a new field for Tours or Renders called initial_camera_position
  var initial_cam_pos = new THREE.Vector3(1000,1000,1000);
  camAndCtrlTransition(initial_cam_pos, origin);
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
  console.log("Creating new annotation");
  window.addEventListener("keydown", NkeyDown, false);
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
    console.log('Loaded Perrys Smith')
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
    var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
    //LeePerryMesh = new THREE.Mesh( bufferGeometry, material );
    LeePerryMesh = new THREE.Mesh( geometry, material );

    //scene.add( LeePerryMesh );
    LeePerryMesh.scale.set( 3, 3, 3 );
    //scene.add( new THREE.FaceNormalsHelper( mesh, 1 ) );
    //scene.add( new THREE.VertexNormalsHelper( mesh, 1 ) );
    console.log('Loaded Perrys Smith')

  } );
}
//JSON Loader

//LoadOneDracoModel
function loadDracoModel() {
  var loader = new THREE.DRACOLoader();

  //TODO: This takes out the extension and replaces it for a .drc. This is because the post_save signal function updates after a few saved_annotations
  //Should solve this issue in backend else the input obj will always be needed and take storage space on server
console.log(object_to_load_obj_path);
  object_to_load_obj_path = object_to_load_obj_path.substr(0, object_to_load_obj_path.lastIndexOf(".")) + ".drc";
  console.log(object_to_load_obj_path);
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
      var loaded_mesh = new THREE.Mesh( geometry, material );
      scene.add( loaded_mesh );
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
      css3d_renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );

      arToolkitSource.onResize()  
      arToolkitSource.copySizeTo(renderer.domElement) 
      if( arToolkitContext.arController !== null ){
        arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)  
      } 
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
    css3d_renderer.render( scene_css3d, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if( arToolkitSource.ready === false ) return
    arToolkitContext.update( arToolkitSource.domElement )

    scene.visible = camera.visible
}

//loadGeometry
function loadGeometry(raw_data) {
  const fileDisplayArea = document.getElementById('fileDisplayArea');

  var dracoLoader = new THREE.DRACOLoader();
  var bufferGeometry = dracoLoader.decodeDracoFile(raw_data);

  // const total_time = performance.now() - start_time;
  // fileDisplayArea.innerText += "Total loading time is "
  //   + total_time.toFixed(3).toString() + "ms\n";

  //const material = new THREE.MeshStandardMaterial({vertexColors: THREE.VertexColors})
  var material = new THREE.MeshPhongMaterial( {
    specular: 0x111111,
    map: textureLoader.load( object_to_load_colormap_path ),
    specularMap: textureLoader.load( object_to_load_specmap_path ),
    normalMap: textureLoader.load( object_to_load_normalmap_path),
    normalScale: new THREE.Vector2( 0.75, 0.75 ),
    shininess: 25
  } );
  let geometry;
  // Point cloud does not have face indices.
  if (bufferGeometry.index == null) {
    geometry = new THREE.Points(bufferGeometry, material);
  } else {
    bufferGeometry.computeVertexNormals();
    geometry = new THREE.Mesh(bufferGeometry, material);
  }
  // Compute range of the geometry coordinates for proper rendering.
  bufferGeometry.computeBoundingBox();
  const sizeX = bufferGeometry.boundingBox.max.x - bufferGeometry.boundingBox.min.x;
  const sizeY = bufferGeometry.boundingBox.max.y - bufferGeometry.boundingBox.min.y;
  const sizeZ = bufferGeometry.boundingBox.max.z - bufferGeometry.boundingBox.min.z;
  const diagonalSize = Math.sqrt(sizeX * sizeX + sizeY * sizeY + sizeZ * sizeZ);
  const scale = 1.0 / diagonalSize;
  const midX = (bufferGeometry.boundingBox.min.x + bufferGeometry.boundingBox.max.x) / 2;
  const midY = (bufferGeometry.boundingBox.min.y + bufferGeometry.boundingBox.max.y) / 2;
  const midZ = (bufferGeometry.boundingBox.min.z + bufferGeometry.boundingBox.max.z) / 2;

  geometry.scale.multiplyScalar(scale);
  geometry.position.x = -midX * scale - numModels / 2 + loadedModel - 1;
  geometry.position.y = -midY * scale;
  geometry.position.z = -midZ * scale;
  geometry.castShadow = true;
  geometry.receiveShadow = true;
  scene.add(geometry);
}

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
