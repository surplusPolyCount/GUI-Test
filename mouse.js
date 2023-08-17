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
            //console.log("dragging");
            //console.log(this.loc_graph, this.pt.o)
            this.pt.UpdateLoc(this.loc_graph, this.loc_canvas);
       }
       
    }

    CapturePoint(canvas, evt){
        console.log("spotted")
        this.loc_canvas = this.getMousePos(canvas, evt);
        this.pt = this.grph.checkMouseInteractionClick(this.loc_canvas); 
        if(this.pt != null && this.pt.constructor.name == "programNode"){
            //console.log(this.pt.constructor.name)
            //iterate through to see if we are hovering on any of the connection nodes: 
            let connecter  = this.pt.isOnConnectorNode(this.loc_canvas);
            if(connecter != null){
                console.log("FOUND ONE! ")
                console.log(connecter)
                this.pt = connecter
            }
        }
    }

    ReleasePoint(canvas, evt){
        if(this.pt != null && this.pt.constructor.name == "nodeConnector"){
            //check if above a node we can connect too 
            this.loc_canvas = this.getMousePos(canvas, evt);
            var belowpt = this.grph.checkMouseInteractionClick(this.loc_canvas);
            console.log("searching ...") 
            if(belowpt != null && belowpt.constructor.name == "programNode"){
                //console.log(this.pt.constructor.name)
                //iterate through to see if we are hovering on any of the connection nodes: 
                let connecter  = belowpt.isOnConnectorNode(this.loc_canvas);
                if(connecter != null){
                    console.log("FOUND ONE! TO DROP ON! ")
                    this.pt.parentCn.parentCn= connecter
                    this.pt.parentCn.childCn = null;
                }
            }else{            
            //  delete
                this.pt.parentCn.childCn = null;
            }
            //this.pt = null; 
            //else 
            //  connect and do that thingy 
        }
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