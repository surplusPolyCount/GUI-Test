/* code to initialize graphing interface in browser */

var canvas = document.getElementById("m-canvas"); 

//resize canvas 
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

var cgraph = new graph(canvas, "#ff0000", "#f88"); //create canvas graph 
  ////create mouse 
var m = new Mouse(new point(0,0), 
                  new point(0,0),
                  cgraph); 


function Start(){
    
    var a  = new point(1.212, -5);
    var b = new point( 2, 5); 
    var c = new point(0, 0);
    var d = new point(-10, -1)

    //cgraph.addIElement(b);
    //cgraph.addIElement(c);
    //cgraph.addIElement(d);

    cgraph.addProgramNode(a, "Unicycler")
    cgraph.addProgramNode(b, "Trimmomatic")



    //render graph
    cgraph.drawCoordinatePlane();
    cgraph.render_ie();
    
    
    //add event listeners 
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
    canvas.addEventListener('wheel', function(evt){zoomGraph(evt, cgraph)}); 
    
    //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    canvas.addEventListener('mousedown',  function(evt){
        m.CapturePoint(canvas, evt);
    }, false);

    canvas.addEventListener('mouseup',  function(evt){
        m.ReleasePoint(canvas, evt);
    }, false);
///*
    canvas.addEventListener('mousemove', function(evt) {
        m.UpdateLoc(canvas, evt);
        cgraph.drawCoordinatePlane();
        cgraph.render_ie();

    }, false);
   //*/
}



Start(); 

/*
//this function is here for version 2.0 of the software 
//hopefully instead of handling input in a wide array of different locations
//the entire graph generation pipeline could be a bit more organized into an update loop
//see the link below for details 
//https://www.sitepoint.com/quick-tip-game-loop-in-javascript/
*/
