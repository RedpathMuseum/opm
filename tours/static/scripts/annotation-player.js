//This scripts handles all the annotation player interactions


//Badge with current annotation number
var badge = document.getElementById("annotation-badge");

//Start annotation tour by calling function on AnnotatinSet
function PlayTour(){
  //TODO: Make the function work
  togglePlayBtn();
  Annotation_Set.StartAnnotationTour(); 
  badge.innerHTML = 1+ "/" +Annotation_Set.queue.length;
};

//Stop annotation tour and handle player button interactions and update badge
function StopTour(){
  Annotation_Set.StopAnnotationTour();
  badge.innerHTML = Annotation_Set.queue.curr_annot_index+1+ "/" +Annotation_Set.queue.length;
  badge.style.display = "none";
  togglePlayBtn();
 };

 //Go to next annotation and update badge
function NextView(){
  Annotation_Set.NextAnnotation();
  badge.innerHTML = Annotation_Set.queue.curr_annot_index+1+ "/" +Annotation_Set.queue.length;
};

//Go to previous annotation and update badge
function PreviousView(){
  Annotation_Set.PreviousAnnotation();
  badge.innerHTML = Annotation_Set.queue.curr_annot_index+1+ "/" +Annotation_Set.queue.length;
 };

//Handle player buttons interactions
document.getElementById("stop-btn").style.display = "none";
document.getElementById("prev-btn").style.display = "none";
document.getElementById("next-btn").style.display = "none";
var playingTour = false;

//Toggle play button to pause button  and vice versa
function togglePlayBtn() {

  if(playingTour) {
    document.getElementById("stop-btn").style.display = "none";
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    document.getElementById("play-btn").style.display = "";
    playingTour = false;
  }
  else {
    console.log("lalalla");
    document.getElementById("stop-btn").style.display = "";
    document.getElementById("prev-btn").style.display = "";
    document.getElementById("next-btn").style.display = "";
    document.getElementById("annotation-badge").style.display = "";

    document.getElementById("play-btn").style.display = "none";
    playingTour =true;
  }

}