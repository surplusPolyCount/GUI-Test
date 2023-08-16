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
       this.loc_graph.y *= -1; 
       //the offset between top left & mouse pos 
       if(this.pt != null){
            this.pt.UpdateLoc(this.loc_graph, this.offset);
       }
       
    }

    CapturePoint(){
        this.pt = this.grph.checkMouseInteractionClick(this.loc_canvas); 

        if(this.pt != null){
            
            //if we actuall are within the bounds of grabbing something: 
            this.loc_graph = this.grph.ctgs(this.loc_canvas.x, this.loc_canvas.y);
            this.loc_graph.y *= -1; 
            /*
            console.log("mouse: ", this.loc_graph);
            console.log("obj: ", this.pt.o);
            */
            this.offset.x = this.loc_graph.x - this.pt.o.x;
            this.offset.y = this.pt.o.y - this.loc_graph.y;  
            /*
            console.log(this.pt);
            console.log(this.loc_graph);
            */
        }
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