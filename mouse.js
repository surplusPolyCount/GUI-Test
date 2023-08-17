//add input for user interaction 
//links user input to functions listed above 
class Mouse{
    constructor(c_point, g_point, graph){
        //coordinates in canvas space
        this.loc_canvas = c_point; 
        //coordinates in graph space
        this.loc_graph =  g_point; 
        //graph the mouse will reference 
        this.grph = graph;
        //the index of point 
        this.pt = null; 
        this.offset = new point(0, 0)
    }

    UpdateLoc(canvas, evt){
       this.loc_canvas = this.getMousePos(canvas, evt);
       this.loc_graph = this.grph.ctgs(this.loc_canvas.x, this.loc_canvas.y);
       //console.log(this.loc_graph, this.loc_canvas)
       //the offset between top left & mouse pos 
       if(this.pt != null){
   
            this.pt.UpdateLoc(this.loc_graph, this.loc_canvas);
       }
       
    }

    CapturePoint(canvas, evt){
        this.loc_canvas = this.getMousePos(canvas, evt);
        this.pt = this.grph.checkMouseInteractionClick(this.loc_canvas); 
        console.log(this.pt.constructor.name)
        if(this.pt.constructor.name == "programNode"){
            //iterate through to see if we are hovering on any of the connection nodes: 
            console.log("checking programNode if clicking on connectors")
            this.pt.isOnConnectorNode();
        }
        /*
        if(this.pt != null){
            //if we actuall are within the bounds of grabbing something: 
            this.loc_graph = this.grph.ctgs(this.loc_canvas.x, this.loc_canvas.y);

            //this.offset.x = this.loc_graph.x - this.pt.o.x;
            //this.offset.y = this.pt.o.y - this.loc_graph.y;  
        }
        */
    }

    ReleasePoint(){
        this.pt = null;
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return new point(
            evt.clientX - rect.left,
            evt.clientY - rect.top
        );
    }
    

    
}