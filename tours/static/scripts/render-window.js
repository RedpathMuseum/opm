//This script is the main file for Three.js 3D scene.

var container, camera, scene, renderer, css3d_renderer, LeePerryMesh, loaded_mesh, controls, group;

//Canvas element
var canvas_el =  document.getElementById('canvas3D');
//Canvas rectangle dimensions
var canvas_rect = canvas_el.getBoundingClientRect();

//Set true in browser console to debug THREE.js actions
var DebugMode = false;
//Set to true for creating 3D annotations in admin panel
var InEditMode = false;

//TODO: Make sure deleteing the counter does not affect anything
//Deprecated counters
var camcounter =0;
var tour_counter=0;

//Deprecated variables
var camlookat_start = new THREE.Vector3(0.018518396076858696, 0.08320761783954866,-0.9963601669693058);
var camposition_start = new THREE.Vector3(-5.488823519163917, 4.861637666233516, 221.22000845737145);


//Arrays used as buffer when creating 3D annotations
var AnnotSpheres = [];
var AnnotCamPos = [];
var AnnotCamLookatPts = [];


//Texture loader used by OBJLoader
var textureLoader = new THREE.TextureLoader();


//*******Variables for Raycaster*********
var x;
var y;
var raycaster;
var mesh;
var marker_copy = new THREE.Mesh();
marker_copy.visible = false;

//TODO: Make sure it can be deleted
//Deprecated variable
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
//*******Variables for Raycaster*********


//*******Variables for 3D annotations*********
var SphereGeometry = new THREE.SphereGeometry( 5, 32, 32 );
var SphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var Sphere = new THREE.Mesh( SphereGeometry, SphereMaterial );

var CurrSphereData = [];

var tooltiptext = [];
var pTagArray = [];
//*******Variables for 3D annotations*********


//*******GLTF Variables*********
var gltf;
var mixer;
var clock = new THREE.Clock();
var gltf_loader = new THREE.GLTFLoader();
var gltfloaded=false;
//*******GLTF Variables*********


//Initialize scene
init();
//Animate scene
animate();



function init() {


    // HTML Container/canvas element for the 3D Scene
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
    //render element is put inside the canvas element
    renderer = new THREE.WebGLRenderer({
      canvas: canvas3D});
    //Alpha set to true for better resolution
    renderer.alpha = true;
    //Setting z-index of canvas element to 20
    renderer.domElement.style.zIndex = 20;
    console.log( document.getElementById('3d_content').getBoundingClientRect());
    renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );
    renderer.setClearColor( 0xffffff, 0);

    // Setting camera
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 1, 5000 );
    camera.position.set(500, 350, 750);

    //Add camera to scene
    scene.add( camera );

    //Add annotation sphere
    scene.add( Sphere );
    Sphere.visible = false;

    //3-axis helper to visualize x-y-z axis in scene
    var axisHelper = new THREE.AxisHelper( 5 );
    scene.add( axisHelper );

    // lights
    scene.add( new THREE.AmbientLight( 0xffffff ) );

    // Loading a .stl file to be used as 3D marker
    var loader = new THREE.STLLoader();
    loader.load( '../../../../../static/models/Arrow.stl', function ( geometry ) {

       var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
       mesh = new THREE.Mesh( geometry, material );
       //mesh.scale.set(10,10,10);

       scene.add( mesh );

      }
     );


    var texture = new THREE.Texture();
		
    //Progress loading used for debugging
    var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};
		var onError = function ( xhr ) {
		};

    //Load glTF model
    if (object_to_load_is_gltf == "True"){
      console.log("Loading a GLTF file");
      // Load glTF model
      loadGltf(object_to_load_gltf_file_path);
    }
    else {
      console.log("Loading a DRACO file");
      // Load draco model
      loadDracoModel();
    }


    // Controls forintereacting with 3D scene
    controls = new THREE.TrackballControls( camera, canvas3D );
    //Minimal distance from camera to object
  	controls.minDistance = 1;
    //Maximum distance from camera to object
  	controls.maxDistance = 1000;

    //Code for Raycaster
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

    //Raycaster used to retrieve information from an object in the scene by pointing at it
    // Objects like vertices, faces, edges and more can be retrieve. Though it is used for faces in this script
    raycaster = new THREE.Raycaster()

    //Mouse helper used for raycasting actions
    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    //Line used for raycasting actions
    line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
  	scene.add( line );


    //Listen to window size changes
    window.addEventListener( 'resize', onWindowResize, false );
    var moved = false;

    //Listen to changes made by user to controls
    controls.addEventListener( 'change', function() {
      moved = true;
    } );

    //Listen to mouse click press
    window.addEventListener( 'mousedown', function () {
      moved = false;
    }, false );

    //Listen to mouse click releases
    window.addEventListener( 'mouseup', function() {
      if( InEditMode ==  true ){
        checkIntersection();
      }

    });

    //Listen to mouse move events
    window.addEventListener( 'mousemove', onTouchMove );
    //Listen to mouse cursor touching window
    window.addEventListener( 'touchmove', onTouchMove );

}

//Handle mouse move and touchmove events to retrieve mouse positions, bounding rectangle of canvas and trigger the raycaster
function onTouchMove( event ) {
  if ( event.changedTouches ) {
    x = event.changedTouches[ 0 ].pageX;
    y = event.changedTouches[ 0 ].pageY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }

  //Retrieve mouse position
  if (DebugMode == true)
  {
    console.log('This is mouse x real '+event.clientX);
    console.log('This is mouse y real '+event.clientY);
  }

  //Mouse position relative to 3D canvas
  mouse.x = ( (x - canvas_rect.left) / (canvas_rect.right - canvas_rect.left) ) * 2 - 1;
  mouse.y = - ( (y -  canvas_rect.top) / (canvas_rect.bottom - canvas_rect.top) ) * 2 + 1;
  if (DebugMode == true)
  {
    console.log("canvas_rect = ", canvas_rect)
    console.log('This is mouse x relative '+mouse.x);
    console.log('This is mouse y relative '+mouse.y);
  }
  //Trigger checkIntersection to start Raycasting and get infromation about object user is pointing to
  if(InEditMode ==  true)
  {
      checkIntersection();
  }

}

//This function checks the intersection between the raycaster and the object.
//The raycaster creates a ray or a line that goes from the camera to the first object it encounters.
//The direction of the raycaster is determined by the position of the mouse.
function checkIntersection() {

  console.log("checkIntersection - BEGIN");
  //Setting raycaster from camera to where mous is pointing
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( [ loaded_mesh ] );

  //Check if raycaster retrieve an object
  if ( intersects.length > 0 ) {
    //Take first element intersecting raycaster
    var p = intersects[ 0 ].point;

    //Set helper position to retrieved object
    mouseHelper.position.copy( p );
    intersection.point.copy( p );

    //Clone the normal of the face retirieved by raycaster
    var n = intersects[ 0 ].face.normal.clone();

    //Create line that is aligned with normal vector
	  n.multiplyScalar( 100 );
    n.add( intersects[ 0 ].point );
    intersection.normal.copy( intersects[ 0 ].face.normal );
    mouseHelper.lookAt( n );
    line.geometry.vertices[ 0 ].copy( intersection.point );
    line.geometry.vertices[ 1 ].copy( n );
    line.geometry.verticesNeedUpdate = true;
    intersection.intersects = true;

    //Update the point that the camera is looking at
    camlookatpoint = line.geometry.vertices[ 0 ].copy( intersection.point );
    //Update camera position to be along normal
    camposalongnormal = line.geometry.vertices[ 1 ].copy( n );

    //Debugging logs
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

    //Update Sphere/Object data used to Freeze 3D marker
    CurrSphereData[0] = camlookatpoint;
    CurrSphereData[1] = camposalongnormal;

    //Update 3D marker position and direction
    if(InEditMode == true){

      //Update position
      mesh.position.copy(camlookatpoint);
      mesh.visible = true;
      //Updating direction
      var focalPoint = new THREE.Vector3(
          mesh.position.x + camposalongnormal.x,
          mesh.position.y + camposalongnormal.y,
          mesh.position.z + camposalongnormal.z
      );

      //Setting 3D marker direction along normal
      mesh.lookAt(focalPoint);
    }
    else{
      //Do nothing
    }

  }
  else {
    //No intersecting objects
    intersection.intersects = false;
  }
}

//Handle transitions for camera and control when outside the annotation player
//Different than the AnnotationSet function with TWEEN as the annotation text is hidden so the function is not a function of the class
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


//TODO: Recode this function and put in GUI to handle user putting object out of sight
//Rest camera and control to start position. controls at origin camera is far away.
function resetCameraAndControls() {
  var origin = new THREE.Vector3(0,0,0);
  //TODO: make a new field for Tours or Renders called initial_camera_position
  var initial_cam_pos = new THREE.Vector3(1000,1000,1000);
  camAndCtrlTransition(initial_cam_pos, origin);
}

//Create p element in element with the input id and populate it with input text 
function PopulateDiv(id, text) {
  var div = document.getElementById(id);
  p_tag = div.getElementsByTagName("p")[0];
  p_tag.innerHTML  = text;


}

//Create a the annotation div with input text and camcounter as its id
function CreateToolTip(tooltiptext, camcounter){
  //Function to remove a div
  // if(annotcounter != 0){
  //   var element = document.getElementById("newdiv");
  //   element.parentNode.removeChild(element);
  //   console.log('remove');
  // }

  //mydiv contains all the annotation div elements
  var mydiv = document.getElementById('mydiv');
  console.log(mydiv);

  //create new div
  var newdiv = document.createElement("div");

  //Create new p element with input text
  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  //Adding new p element to new div
  newdiv.innerHTML = newPTag;

  //Setting class of new annotation div
  newdiv.setAttribute("class", "element");
  //Setting id of new div
  var div_id = "tooltip"+camcounter;
  newdiv.setAttribute("id", div_id);

  //Add newdiv element to mydiv element
  mydiv.appendChild(newdiv);
  console.log('Im fine');

  //Change annotation style properties
  var color = window.getComputedStyle(
    document.querySelector('.element'), ':after'
  ).getPropertyValue('left');
  console.log(color);
  color = "30px";

  console.log(color);

  //Setting z-index as a negative number and hiding it
  newdiv.style.zIndex = -1-camcounter;
  newdiv.style.visibility = "hidden";


}

//Used to change text dynamically as user is writing its text
function ChangeToolTipText(tooltiptext, tooltip_id){

  pTagArray[0] = "<p>";
  pTagArray[1] = tooltiptext;
  pTagArray[2] = "</p>";
  var newPTag = pTagArray.join("");

  var selected_div = document.getElementById(tooltip_id);
  console.log('----Selected DIV------', selected_div);
  selected_div.innerHTML = newPTag;
}



//TODO:Recode this function with new AnnotationSet object
//Unused function but could be useful
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

//TODO:- Make the function modular by adding input paths
//-Clean function
//-Make specular map optional

//Load Draco Model
function loadDracoModel() {
  var loader = new THREE.DRACOLoader();

  //TODO: This takes out the extension and replaces it for a .drc. This is because the post_save signal function updates after a few saved_annotations
  //Should solve this issue in backend else the input obj will always be needed and take storage space on server
  console.log(object_to_load_obj_path);
  object_to_load_obj_path = object_to_load_obj_path.substr(0, object_to_load_obj_path.lastIndexOf(".")) + ".drc";
  console.log(object_to_load_obj_path);
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
    loaded_mesh = new THREE.Mesh( geometry, material );
    scene.add( loaded_mesh );

  } );
}


function loadGltf(url){
//TODO fix substr

  console.log(url);

  gltf_loader.load(
    url,

    function(data) {
      gltf = data;
      var object = gltf.scene;
      var animations = gltf.animations;

      mixer = new THREE.AnimationMixer(object);

      //console.log("Number of animations: %d", animations.length);
      for (var i = 0; i < animations.length; i++) {
        var animation = animations[i];
        mixer.clipAction(animation).play();
      }

      // mixer.clipAction(animations[18]).play();

      scene.add(object);
      gltfloaded=true;
    },

    undefined,
    function(error) {
      console.error(error)
    }
  );
}


//Handle window resize changes
function onWindowResize() {

      camera.aspect = document.getElementById('3d_content').getBoundingClientRect().width/window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );


}

//Function called at every frame
function animate() {
    canvas_rect = canvas_el.getBoundingClientRect();
    requestAnimationFrame( animate );

    // ------PROCESS GLTF ANIMATIONS-----
    if (gltfloaded){
      mixer.update(clock.getDelta());
    }

    controls.update();
    TWEEN.update();
    render();

}

//render function
function render() {

    //render scene
    renderer.render( scene, camera );

    //Check raycaster intersecting objects
    var intersects = raycaster.intersectObjects(scene.children);
}