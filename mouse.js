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
        this.ptInd = -1; 
        this.offset = new point(0, 0)
    }

    UpdateLoc(canvas, evt){
       this.loc_canvas = this.getMousePos(canvas, evt);
       this.loc_graph = this.grph.ctgs(this.loc_canvas.x, this.loc_canvas.y);
       //the offset between top left & mouse pos 
       if(this.ptInd != -1){
           //update the point's location 
           this.grph.iElements[this.ptInd].o.x = this.loc_graph.x - this.offset.x; 
           this.grph.iElements[this.ptInd].o.y = -this.loc_graph.y + this.offset.x; 
       }
       
    }

    CapturePoint(canvas, evt){
        
        console.log("called");
        this.ptInd = this.grph.checkMouseInteractionClick(this.loc_canvas); 
        if(this.ptInd != -1){
            //if we actuall are within the bounds of grabbing something: 
            this.loc_graph = this.grph.ctgs(this.loc_canvas.x, this.loc_canvas.y);

            this.offset.x = this.loc_graph.x - this.grph.iElements[this.ptInd].o.x;
            this.offset.y = this.loc_graph.y - this.grph.iElements[this.ptInd].o.y;  
            console.log(this.ptInd);   
        }
    }

    ReleasePoint(){
        console.log("released"); 
        this.ptInd = -1;
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return new point(
            evt.clientX - rect.left,
            evt.clientY - rect.top
        );
    }
    

    
}