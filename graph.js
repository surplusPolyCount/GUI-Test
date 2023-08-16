//https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/

//code mostly written by Simon Rosenthal

//class for data point that represent 
//point in graph space

//class for data of type point that will be used for interpolation 
class iElement{
    constructor(origin, color, g){
        this.o = origin; //origin of point
        this.c = color;  //color of point to be drawn on graph
        this.radius = 5; //radius (in pixels of dot to be drawn on graph)
        this.g = g;      //graph this point belongs too
        this.el_id = Math.floor(Math.random() * 100);

    }

    //checks if mouse is over a point (in graph space) used for interpolation
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        if(distSqrd(this.g.gtcs(this.o.x, this.o.y), mousePos) < (this.radius * this.radius)){
            //console.log(this);
            return this; 
        }return null; 
    }

    //draws point on graph as circle
    draw(){
        this.g.ctx.fillStyle = this.c;
        this.g.ctx.beginPath();
        this.g.ctx.ellipse(this.g.gtcs(this.o.x, this.o.y).x, 
                      this.g.gtcs(this.o.x, this.o.y).y, 
                      this.radius, this.radius, Math.PI, 0, 2 * Math.PI);
        this.g.ctx.fill();

    }

    UpdateLoc(mouseGraphPos, mouseOffsetFromOrigin){
                   //update the point's location 
                   this.o.x = mouseGraphPos.x - mouseOffsetFromOrigin.x; 
                   this.o.y = mouseGraphPos.y + mouseOffsetFromOrigin.y; 
    }
}


class nodeConnector extends iElement{
    constructor(origin, color, g, isOut = false, connectNode = null){
        super(origin, color, g);
        this.isOut = isOut; 
        this.cn = connectNode; 
    }
    draw(){
        super.draw();
        console.log("node draw");
    }
}


class node extends iElement {
    constructor(origin, color, g){
        super(origin, color, g)
        this.w = 125;
        this.h = 150;
        this.labelHeight = 30; 

    }
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        //console.log("m: ", mousePos, "o: ", this.g.gtcs(this.o.x, this.o.y))
        var mouseGraphSpace = this.g.ctgs(mousePos.x, mousePos.y);
        var objTopLeft = this.o; 
        var objBottomRight = this.g.gtcs(this.o.x, this.o.y);
        objBottomRight.x += this.w; 
        objBottomRight.y -= this.h; 
        objBottomRight = this.g.ctgs(objBottomRight.x, objBottomRight.y);
        
        var isInBox = (mouseGraphSpace.x > objTopLeft.x && 
            mouseGraphSpace.x < objBottomRight.x &&
            -mouseGraphSpace.y < objTopLeft.y &&
            mouseGraphSpace.y > objBottomRight.y);
  
        if (isInBox){
            return this; 
        }return null; 
            
    }

    draw(){
        drawRectangle(this.g.ctx, this.g.gtcs(this.o.x, this.o.y), this.w, this.h, [5, 5, 5, 5], "#333", "#bbb");
        drawRectangle(this.g.ctx, this.g.gtcs(this.o.x, this.o.y), this.w, this.labelHeight, [5, 5, 0, 0], "#486");

        super.draw(); 

        var b = document.getElementById(this.el_id + "_input_text");
        
        b.style.top =  this.g.gtcs(this.o.x, this.o.y).y + this.labelHeight + 20 + "px";
        b.style.left = this.g.gtcs(this.o.x, this.o.y).x + 20 + "px";
        
        var rect = b.getBoundingClientRect();
    }
}

class programNode extends node{

    constructor(origin, color, g, ipts = 1, opts = 1){
        super(origin, color, g);
        this.inConnectors = []; 
        this.outConnectors = []; 

        //program settings 
        this.properties=null; 

        //render all of the input & output nodes 
        for (var i = 0; i < ipts; i++){
            var nodeConOrigin = new point(this.o.x, 
                                          this.o.y, - ((i + 1) * 10)); 
            console.log(nodeConOrigin);
            console.log(this.o);
            this.inConnectors.push(new nodeConnector(nodeConOrigin, "#bbb", this.g));
        }

        createIptTextBox(this.el_id);


    }

    UpdateLoc(mouseGraphPos, mouseOffsetFromOrigin){
        super.UpdateLoc(mouseGraphPos, mouseOffsetFromOrigin);
 
        this.inConnectors.forEach(function(inCon){
            inCon.o.x = mouseGraphPos.x - mouseOffsetFromOrigin.x; 
            inCon.o.y = mouseGraphPos.y + mouseOffsetFromOrigin.y; 
        });
        this.outConnectors.forEach(function(outCon){
            outCon.o.x = mouseGraphPos.x - mouseOffsetFromOrigin.x; 
            outCon.o.y = mouseGraphPos.y + mouseOffsetFromOrigin.y; 
        });
    }

    draw (){
        super.draw(); 
        this.inConnectors.forEach(function(inCon){
            inCon.draw();
        });
        this.outConnectors.forEach(function(outCon){
            outCon.draw();
        });
    }
}

//class for graph
class graph{
    constructor(canvas, g_color, p_color){
        this.c = canvas 
        this.ctx = canvas.getContext("2d"); 
        this.w = canvas.getBoundingClientRect().width;
        this.h = canvas.getBoundingClientRect().height;
        this.g_color = g_color; 
        this.p_color = p_color;
        
        //variables for declaring min and max of x & y range for graph for
        //the function to be ploted on
        this.xMin = -10; 
        this.xMax = 10;  
        this.yMin = -10; 
        this.yMax = 10;
        
        //to be used to for potential panning around graph without focusing 
        //on center of graph 
        this.center = new point(0,0);

        //list of points to be used for interpolating 
        this.graphPoints = [];
        this.iElements = []; //interactable elements 

        
    }

    //checks if mouse is hovering over a point used for interpolation
    checkMouseInteractionClick(mousePos){
        for(let q = 0; q < this.iElements.length; q++){
            if(this.iElements[q].mouseOver(mousePos)){
                console.log("got em!: ", this.iElements[q].el_id);
                //UPDATE TO SCAN THAT OBJECT IF THE MOUSE I HOVERING OVER ANY OUTNOODLENODES
                return  this.iElements[q]; 
            }
        }
        return null;   
    }

    //checks if range of graph is too small to continue zooming in
    //  scale: NUM amount of zoom to be checked
    //NOTE: find better function 
    //      mouse wheel works in increments of 1, so 1-1 = 0 
    shouldScale(scale){
        return (this.xMin - scale < -0.00000001);
    }

    //used to zoom in/out the graph given 
    //  scale: NUM amount to zoom in/out by adding/subtracting from range
    scaleGraph(scale){  
        let range = Math.abs(this.xMax - this.xMin); 
        if(scale == -1 && range <= 2){
            scale = 0.5;
        }
        if(range < 1){
            scale *= (range * range); 
        }   
        this.xMin -= scale; 
        this.xMax += scale; 
        this.yMin -= scale; 
        this.yMax += scale;
    }

    //remove a point from list of points to use in interpolation
    //  ptIdx: NUM index of point to remove
    deletePoint(ptIdx){
        this.graphPoints.splice(ptIdx, 1); 
    }

    addIElement(point){
        var mPoint = new programNode(point,  "#88f", this);
        //add point
        this.iElements.push(mPoint);
    }

    //graph to canvas space (converts coordinates to pixel values of canvas)
    //  x: NUM x value of coordinate
    //  y: NUM y value of coordinate
    gtcs(x, y){
        let xhalf = Math.abs(this.xMax -  this.xMin)/2; 
        let xmid = xhalf + this.xMin;
        let newx = ((x - xmid)/xhalf + 1)/2; 

        let yhalf = Math.abs(this.yMax -  this.yMin)/2; 
        let ymid = yhalf + this.yMin;
        let newy = (1-(y - ymid)/yhalf)/2;
        return new point(newx * this.w, newy * this.h);
    }  

    //INCOMPLETE/NOT USED
    //canvas to graph space  
    // x: NUM x pixel value in canvas
    // y: NUM y pixel value in canvas
    ctgs(x, y){
        let xLen = Math.abs(this.xMax -  this.xMin); 
        let xGraphCoord = x/this.w * xLen + this.xMin;
        
        let yLen = Math.abs(this.yMax -  this.yMin); 
        let yGraphCoord = y/this.h * yLen + this.yMin;
        return new point(xGraphCoord, yGraphCoord);
    }

    //draws the background of the graph 
    drawCoordinatePlane(){
        var vertline_cnt = 20;
        var horiline_cnt = 40; 

        //draw background color of graph
        this.ctx.fillStyle = "#222";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.w, this.h);
        this.ctx.fill();

        //draw grey back lines of grid 
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#444";
        //horizontal 
        for(let i = 0; i < vertline_cnt; i++)
            drawLine(this.ctx, new point(0, i * (this.h/vertline_cnt)), new point(this.w, i * (this.h/vertline_cnt)));
        //vertical 
        for(let j = 0; j < horiline_cnt; j++)
            drawLine(this.ctx, new point(j * (this.w/horiline_cnt), 0), new point(j * (this.w/horiline_cnt), this.h));
    }



    //method to actual render function onto graph 
    //  mfunc: FUNCTION OF TYPE NUM 
    //         function of polynomial to draw on canvas
    //  color: STRING hex value color you want function to be in 
    //  

    //render interactable element
    render_ie(){
        cgraph.drawCoordinatePlane();
        //draw points 
        this.iElements.forEach(function (el){
            el.draw();
        });
    }
}





