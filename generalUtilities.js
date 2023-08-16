class point{
    constructor(x, y){
        this.x = x; 
        this.y = y;
    }
}

//function to get distance between two points sqrd
function distSqrd(p1, p2){
    return (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y) * (p2.y-p1.y);
}

//function to draw small segment of graph
function drawLine(ctx, point1, point2){
    ctx.beginPath(); 
    ctx.moveTo(point1.x, point1.y); 
    ctx.lineTo(point2.x, point2.y); 
    ctx.stroke(); 
}

function drawRectangle(ctx, p, w, h, borderRadius, bCol = "#333", lCol=bCol){
    ctx.lineWidth = 5;
    ctx.strokeStyle = lCol;
    ctx.fillStyle = bCol;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, w, h, borderRadius, 5);
    ctx.stroke();
    ctx.fill();
}

function createIptTextBox(el_id){
    var c = document.getElementById("node-collection");
    var input = document.createElement("input");
    input.id = el_id + "_input_text";
    input.classList.add("node-properties")
    input.setAttribute("type", "text");
    input.setAttribute("name", "command");
    input.setAttribute("value", 'command');
    input.style.width = "100px"; 
    c.appendChild(input);
    
}

