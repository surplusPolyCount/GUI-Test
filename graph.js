//https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/

//code mostly written by Simon Rosenthal

//class for data point that represent 
//point in graph space


//class for data of type point that will be used for interpolation 
class graphPoint{
    constructor(origin, color, g){
        this.o = origin; //origin of point
        this.c = color;  //color of point to be drawn on graph
        this.radius = 5; //radius (in pixels of dot to be drawn on graph)
        this.g = g;      //graph this point belongs too
        this.el_id = Math.floor(Math.random() * 100);

        createIptTextBox(this.el_id);
    }

    //checks if mouse is over a point (in graph space) used for interpolation
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        return distSqrd(this.g.gtcs(this.o.x, this.o.y), mousePos) < (this.radius * this.radius); 
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


}

class iElement extends graphPoint {

}

class progamNode extends iElement {
    constructor(origin, color, g){
        super(origin, color, g)
        
    }
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        console.log("m: ", mousePos, "o: ", this.g.gtcs(this.o.x, this.o.y))
        var inbox = (mousePos.x > this.g.gtcs(this.o.x, this.o.y).x && 
        mousePos.x < this.g.gtcs(this.o.x, this.o.y).x + 125 &&
        mousePos.y > this.g.gtcs(this.o.x, this.o.y).y &&
        mousePos.y < this.g.gtcs(this.o.x, this.o.y).y + 125);
        console.log(inbox);
        return inbox;
            
    }

    draw(){
        drawRectangle(this.g.ctx, this.g.gtcs(this.o.x, this.o.y), 125, 150, [5, 5, 5, 5]);
        drawRectangle(this.g.ctx, this.g.gtcs(this.o.x, this.o.y), 125, 30, [5, 5, 0, 0], "#bbb");

        super.draw(); 

        var b = document.getElementById(this.el_id + "_input_text");
        
        b.style.top =  this.g.gtcs(this.o.x, this.o.y).y + 50 + "px";
        b.style.left = this.g.gtcs(this.o.x, this.o.y).x + 10+ "px";
        
        var rect = b.getBoundingClientRect();
        //console.log(b.id, rect.top, rect.right, rect.bottom, rect.left);
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
                return q; 
            }
        }
        return -1;   
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
        var mPoint = new progamNode(point,  "#88f", this);
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
        this.ctx.fillStyle = "#121212";
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





