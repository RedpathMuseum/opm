var container, camera, scene, renderer, css3d_renderer, LeePerryMesh, loaded_mesh, controls, group;

//Global variables for pointing in 3D view
var canvas_dim =  document.getElementById('canvas3D');
var canvas_rect = canvas_dim.getBoundingClientRect();

//Set true in browser console to debug THREE.js actions

var DebugMode = false;
var InEditMode = false;

var LENGTH = screen.height;
var WIDTH = screen.width * .75;
if (screen.width <= 960) {
    WIDTH = screen.width * .50;
}

var CAMERA_DISTANCE = -20;

var camcounter =0;
var tour_counter=0;


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
var marker_copy = new THREE.Mesh();
marker_copy.visible = false;
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
    renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      canvas: canvas3D} );
    renderer.domElement.style.zIndex = 20;
    console.log( document.getElementById('3d_content').getBoundingClientRect());
    renderer.setSize( document.getElementById('3d_content').getBoundingClientRect().width, window.innerHeight );
    renderer.setClearColor( 0xffffff, 0);



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
    scene.add( new THREE.AmbientLight( 0xffffff ) );

    // Loading a .stl file
    var loader = new THREE.STLLoader();
    loader.load( '../../../../../static/models/Arrow.stl', function ( geometry ) {

       var material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
       mesh = new THREE.Mesh( geometry, material );
       //mesh.scale.set(10,10,10);

      //  stl_1 = mesh.clone();
       scene.add( mesh );

      }
     );
  

      var texture = new THREE.Texture();
				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
				var onError = function ( xhr ) {
				};

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
          if( InEditMode ==  true ){
            checkIntersection();
          }

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
 console.log("checkIntersection - BEGIN")
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( [ loaded_mesh ] );
  if ( intersects.length > 0 ) {
    var p = intersects[ 0 ].point;
    mouseHelper.position.copy( p );
    intersection.point.copy( p );
    var n = intersects[ 0 ].face.normal.clone();
    n.multiplyScalar( 100 );
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

//TODO: Recode this function and put in GUI to handle user putting object out of sight
function resetCameraAndControls() {
  var origin = new THREE.Vector3(0,0,0);
  //TODO: make a new field for Tours or Renders called initial_camera_position
  var initial_cam_pos = new THREE.Vector3(1000,1000,1000);
  camAndCtrlTransition(initial_cam_pos, origin);
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

  newdiv.style.zIndex = -1-camcounter;
  newdiv.style.visibility = "hidden";

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
      loaded_mesh = new THREE.Mesh( geometry, material );
      scene.add( loaded_mesh );
    } );
}


function onWindowResize() {

      camera.aspect = document.getElementById('3d_content').getBoundingClientRect().width/window.innerHeight;

      camera.updateProjectionMatrix();

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

    renderer.render( scene, camera );

    var intersects = raycaster.intersectObjects(scene.children);
}
