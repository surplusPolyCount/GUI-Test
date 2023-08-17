//https://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/

//code mostly written by Simon Rosenthal

//class for data point that represent 
//point in graph space

//class for data of type point that will be used for interpolation 
class iElement{
    constructor(origin, color, g){
        this.o = origin; //origin of point
        this.c = color;  //color of point to be drawn on graph
        this.radius = 8; //radius (in pixels of dot to be drawn on graph)
        this.g = g;      //graph this point belongs too
        this.el_id = Math.floor(Math.random() * 100);

    }

    //checks if mouse is over a point (in graph space) used for interpolation
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        if(distSqrd(this.g.gtcs(this.o.x, this.o.y), mousePos) < (this.radius * this.radius)){
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

    UpdateLoc(mouseGraphPos, mouseCanvasPos){
                   var offset =  new point(0, 0)
                  // var o_c = this.g.gtcs(this.o.x, this.o.y);
                   
                  // offset.x = mouseGraphPos.x + (mouseCanvasPos.x - o_c.x);
                   //offset.y = mouseGraphPos.x + (mouseCanvasPos.y - o_c.y);
                   
                   //console.log(mouseGraphPos, this.o, offset.x, offset.y)

                   //offset = this.g.ctgs(offset.x, offset.y)

                   this.o.x = offset.x// + offset.x; 
                   this.o.y = offset.y// + offset.y; 
                   
                   this.o.x = mouseGraphPos.x; 
                   this.o.y = mouseGraphPos.y
    }
}


class nodeConnector extends iElement{
    constructor(origin, color, g, offset, pn, isOut = false, connectNode = null){
        super(origin, color, g);
        this.isOut = isOut; 
        this.parentNode = pn; 
        this.cn = connectNode; //other program node connected too 
        this.cnCn = null //other connection node 
        this.offset = offset; 
    }
    draw(){
        if (this.cnCn != null){
            console.log("drawing a baby")
            
            this.cnCn.draw();

            this.g.ctx.lineWidth = 4;
            this.g.ctx.strokeStyle = "#999"
            this.g.ctx.fillStyle = "#999"

            let o = this.g.gtcs(this.o.x, this.o.y); 
            let cn_o = this.g.gtcs(this.cnCn.o.x, this.cnCn.o.y)

            let start = { x: o.x, y: o.y };
            let cp1 = { x: o.x + (cn_o.x - o.x)/2, y: o.y };
            let cp2 = { x: o.x + (cn_o.x - o.x)/2, y: cn_o.y };
            let end = { x: cn_o.x, y: cn_o.y };

            // Cubic Bézier curve
            this.g.ctx.beginPath();
            this.g.ctx.moveTo(start.x, start.y);
            this.g.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
            this.g.ctx.stroke();

            
            //drawLine(this.g.ctx, this.g.gtcs(this.o.x, this.o.y), this.g.gtcs(this.cnCn.o.x, this.cnCn.o.y))
        }

        super.draw();
        //console.log("drawing a baby")


    }

    handleConnection(){
        var p = new nodeConnector(new point(this.o.x, this.o.y), "#bbb", this.g, -1, null)
        this.cnCn = p 
        //p.cnCn = this; 
        console.log(this.cnCn, p, this)
        return this.cnCn
    }
}


class node extends iElement {
    constructor(origin, color, g){
        super(origin, color, g)
        this.w = 125;
        this.h = 150;
        this.labelHeight = 30; 

        //bottom right in graph space of the obj 
        var br = this.g.gtcs(this.o.x, this.o.y);
        br.x += this.w; 
        br.y += this.h; 
        this.br = this.g.ctgs(br.x, br.y);
    }
    mouseOver(mousePos){
        //if distance^2 from mousePos,origin < radius^2
        //console.log("m: ", mousePos, "o: ", this.g.gtcs(this.o.x, this.o.y))
        //console.log("Node mouseover")
        //top left
        var tl = this.g.gtcs(this.o.x, this.o.y);
        //bottom right 
        var br = this.g.gtcs(this.o.x, this.o.y);
        br.x += this.w; 
        br.y += this.h; 
        
        //console.log("m: ", mousePos, "br: ", br, "tl: ", tl)
        var isInBox = (mousePos.x > tl.x -10 && mousePos.x < br.x + 10 &&
            mousePos.y > tl.y && mousePos.y < br.y);
       //console.log(isInBox,  mousePos.x > tl.x, mousePos.x < br.x, mousePos.y > tl.y,  mousePos.y < br.y )
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
        
        //var rect = b.getBoundingClientRect();
    }
}

class programNode extends node{

    constructor(origin, color, g, name, ipts = 3, opts = 2){
        super(origin, color, g);
        this.name = name; 
        this.inConnectors = []; 
        this.outConnectors = []; 

        //program settings 
        this.properties=null; 

        //render all of the input & output nodes 
        for (var i = 1; i < ipts+1; i++){
            let nodeConOrigin = new point(this.o.x, this.o.y - i * 0.75); 
            this.inConnectors.push(new nodeConnector(nodeConOrigin, "#bbb", this.g, i, this));
        }
        for (var i = 1; i < opts+1; i++){
            //console.log(this.br, this.o)
            let nodeConOrigin = new point(this.br.x, this.br.y + i * 0.75); 
            this.outConnectors.push(new nodeConnector(nodeConOrigin, "#bbb", this.g, i, this));
        }

        createIptTextBox(this.el_id);
    }

    UpdateLoc(mouseGraphPos, mouseCanvasPos){
        super.UpdateLoc(mouseGraphPos, mouseCanvasPos);
 
        this.inConnectors.forEach(function(inCon){
            inCon.o.x = mouseGraphPos.x 
            inCon.o.y = mouseGraphPos.y - inCon.offset * 0.75; 
        });

        this.outConnectors.forEach(function(outCon){
            var br = outCon.g.gtcs(mouseGraphPos.x, mouseGraphPos.y);
            br.x += outCon.parentNode.w; 
            br.y += outCon.parentNode.h; 
            br = outCon.g.ctgs(br.x, br.y)
            outCon.o.x =   br.x;
            outCon.o.y =   br.y + outCon.offset * 0.75; 
        });

    }

    isOnConnectorNode(mpC){
        let res = null 
        this.inConnectors.forEach(function(inCon){
            console.log(distSqrd(inCon.g.gtcs(inCon.o.x, inCon.o.y), mpC))
            if (inCon.mouseOver(mpC)){
                res =  inCon.parentNode.inConnectors[inCon.offset-1]
                res = res.handleConnection(res)
                console.log(res)
            }
        });
        this.outConnectors.forEach(function(outCon){
            console.log(distSqrd(outCon.g.gtcs(outCon.o.x, outCon.o.y), mpC))
            if (outCon.mouseOver(mpC)){
                res =  outCon.parentNode.outConnectors[outCon.offset-1]
                res = res.handleConnection(res)
                console.log(res)
            }
        });
        return res;
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
            //console.log(this.iElements[q].constructor.name)
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
        var mPoint = new iElement(point,  "#88f", this);
        //add point
        this.iElements.push(mPoint);
    }

    addProgramNode(point, name){
        var mNode = new programNode(point,  "#88f", this, name);
        //add point
        this.iElements.push(mNode);
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
        let xhalf = Math.abs(this.xMax -  this.xMin)/2; 
        let xmid = xhalf + this.xMin;
        let newx = ((x/this.w * 2)-1) * xhalf  + xmid; 

        let yhalf = Math.abs(this.yMax -  this.yMin)/2; 
        let ymid = yhalf + this.yMin;
        let newy = (1 - y/this.h * 2) * yhalf + ymid;
        return new point(newx, newy);
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





