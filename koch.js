var canvas= document.getElementById("game-canvas");
var context= canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;
var grabPointRadius = 6;

var lineAperture = 0.2;
var isRandom = true;
var steps = 5;
var isHiding = false;
var mouseButtonIsPressed = false;

var apertureElement = document.getElementById("aperture");
var isRandomElement = document.getElementById("isRandom");
var stepsElement = document.getElementById("steps");
var randomSeedElement = document.getElementById("randomSeed");
var isHidingElement = document.getElementById("isHiding");

document.getElementById("apertureSlide").value = apertureElement.value = lineAperture;
isRandomElement.checked = isRandom;
document.getElementById("stepsSlide").value = stepsElement.value = steps;
randomSeedElement.value = "123ABC";
isHidingElement.checked = isHiding = false;

function updateMousePosition(event) {
    var cX = 0,
        cY = 0;

    if (event.pageX || event.pageY) {
        cX = event.pageX;
        cY = event.pageY;
    }
    else {
        cX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        cY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    cX -= canvas.offsetLeft;
    cY -= canvas.offsetTop;

    mouseX = cX;
    mouseY = cY;
}

function removePoint(e){
    if(!movingPoint || e.keyCode != 46) return;
    for(var i = 0; i < pointsParam.length; i++){
        if(pointsParam[i].x == movingPoint.x && pointsParam[i].y == movingPoint.y)
            pointsParam.splice(i, 1);
    }
}

window.addEventListener("keydown", removePoint, false);

function mouseMove(e) {
    if(!mouseButtonIsPressed || !movingPoint) return;    
    movingPoint.x = mouseX;
    movingPoint.y = mouseY;
};

canvas.addEventListener('mousemove',updateMousePosition,false);
canvas.addEventListener('mousemove',mouseMove,false);

function getPointAtOrUndefined(point){
    for(var i = 0; i < pointsParam.length; i++){
        if(Math.sqrt( Math.pow( pointsParam[i].x - point.x ,2) + Math.pow(pointsParam[i].y - point.y,2) ) <= grabPointRadius )
            return pointsParam[i];
    }
    return null;
}

function getNearestPoint(p){
    var nearestDistance = 99999;
    var nearestPoint;
    for(var i = 0; i < pointsParam.length; i++){
        var distance = Math.abs( pointsParam[i].x - p.x ) + Math.abs(pointsParam[i].y - p.y );
        if(distance < nearestDistance){
            nearestDistance = distance;
            nearestPoint = pointsParam[i];
        }
    }
    return nearestPoint;
}

function mouseDown(e) {
    mouseButtonIsPressed = true;
    movingPoint = getPointAtOrUndefined({x:mouseX,y:mouseY});
    if(!movingPoint && e.ctrlKey){
        var p = {x:mouseX,y:mouseY};
        while(getPointAtOrUndefined(p)){
            p.x+= grabPointRadius;
        }
        movingPoint = {x:p.x,y:p.y};
    
        var nearestPoint = getNearestPoint(movingPoint);
        for(var i = 0; i < pointsParam.length; i++){
            if(nearestPoint.x == pointsParam[i].x && nearestPoint.y == pointsParam[i].y ){
                var nextIndex = (i+1) % pointsParam.length;
                var beforeIndex = (i-1 >= 0) ?i-1: pointsParam.length - i-1;
                
                var pointBeforeDistance = Math.abs( pointsParam[beforeIndex].x - movingPoint.x ) + Math.abs(pointsParam[beforeIndex].y - movingPoint.y );
                var pointAfterDistance = Math.abs( pointsParam[nextIndex].x - movingPoint.x ) + Math.abs(pointsParam[nextIndex].y - movingPoint.y );
                
                if(pointBeforeDistance < pointAfterDistance){
                    pointsParam.splice(i+1, 0, movingPoint);
                }else{
                    pointsParam.splice(i, 0, movingPoint);    
                }
                return;
            }
        }
    }
};

canvas.addEventListener('mousedown',mouseDown,false);

function mouseUp(e){
    mouseButtonIsPressed = false;
}

canvas.addEventListener('mouseup',mouseUp,false);


function addPoint(e){
    var p = {x:canvas.width/2,y:canvas.height/2};
    while(getPointAtOrUndefined(p)){
        p.x+= grabPointRadius;
    }
    
    movingPoint = {x:p.x,y:p.y};
    pointsParam.push(movingPoint);
}
        
var deg180 = Math.PI;
var deg90 = (90*Math.PI)/180;
var deg270 = (270*Math.PI)/180;

function iterate(){
        
        var pointsQntd = points.length;
        var newQntd = pointsQntd * 5;
        var newCoords = [];
        
        var newCoordsCount = 0;
        for(var i=0; i< pointsQntd; i++){
                var p1X = points[i].x; 
                var p1Y = points[i].y;
                var p2X = points[(i+1)%pointsQntd].x;
                var p2Y = points[(i+1)%pointsQntd].y;
                
                var dx = (p2X-p1X);
                var dy = (p2Y-p1Y);
                
                var ang = 0;
                
                if(dx == 0 ){
                        if(dy >= 0)
                                ang = deg90;
                        else
                                ang = deg270;
                }else{
                        ang = Math.atan2(dy, dx);
                }        
                
                if(isRandom){
                        if( !! Math.round(Math.random() * 1) )
                               ang +=  deg180;
                }                
                
                var partialLineX = (p2X - p1X)*lineAperture;
                var partialLineY = (p2Y - p1Y)*lineAperture;
                
                var partialLineSize = Math.sqrt( Math.pow(partialLineX,2) + Math.pow(partialLineY,2) );
                
                var np1X = p1X+partialLineX;
                var np1Y = p1Y+partialLineY;
                
                var middlePoint = {
                        x: (p1X+((p2X - p1X)/2)),
                        y: (p1Y+((p2Y - p1Y)/2))
                };
                
                var xComponent = partialLineSize*Math.sin(ang);
                var yComponent = partialLineSize*Math.cos(ang);
                
                var perpendicularPoint = {
                        x: middlePoint.x+xComponent,
                        y: middlePoint.y-yComponent
                };
                
                var np3X = p2X-partialLineX;
                var np3Y =  p2Y-partialLineY;
                
                newCoords[newCoordsCount] = {x: p1X, y: p1Y};
                newCoordsCount++;
                newCoords[newCoordsCount] = {x: np1X, y: np1Y};
                newCoordsCount++;
                newCoords[newCoordsCount] = {x: perpendicularPoint.x, y: perpendicularPoint.y};
                newCoordsCount++;
                newCoords[newCoordsCount] = {x: np3X, y: np3Y};
                newCoordsCount++;
                newCoords[newCoordsCount] = {x: p2X, y: p2Y};
                newCoordsCount++;
        }
        points = newCoords;
        pointsQntd = newCoordsCount;
}

function setBackgroundStyle(){
        context.lineWidth = 1;
        var grd=context.createLinearGradient(0,0,canvas.width/2,0);
        grd.addColorStop(0,"#4444ee");
        grd.addColorStop(1,"#5555ff");

        context.fillStyle=grd;
        context.strokeStyle = "#000000";
}

function setKochStyle(){
        context.lineWidth = 1;
        var grd=context.createLinearGradient(0,0,canvas.width,canvas.height);
        grd.addColorStop(0,"#55aa77");
        grd.addColorStop(1,"#77cc55");

        context.fillStyle=grd;
        context.strokeStyle = '#000000';
}

function setPointStyle(){
        context.lineWidth = 1;
        context.fillStyle = "rgba(230, 230, 255, 0.3)";
        context.strokeStyle = "rgba(0, 0, 0, 0.8)";
}

function setSelectedPointStyle(){
        context.lineWidth = 4;
        context.fillStyle = "rgba(200, 200, 255, 0.5)";
        context.strokeStyle = "rgba(255, 255, 255, 0.3)";
}


function drawPoint(p){
        if(isHiding) return;
    
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = grabPointRadius;

        if(movingPoint && p.x == movingPoint.x && p.y == movingPoint.y){
            setSelectedPointStyle();
        }else{
            setPointStyle();    
        }

        context.beginPath();
        context.arc(p.x, p.y, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
}

var movingPoint;

var pointsParam = [
                {x:273,y:31},
                {x:695,y:317},
                {x:862,y:667},
                {x:740,y:580},
                {x:405,y:251},
        ];

function run(){    
        lineAperture = apertureElement.value;
        isRandom = isRandomElement.checked;
        steps = stepsElement.value;
        Math.seedrandom(randomSeedElement.value);
        isHiding = isHidingElement.checked;
        
        points = pointsParam.slice(0);
        
        for(var i = 0; i < steps; i++){
                iterate();
        }
        setBackgroundStyle();
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        context.moveTo(points[0], points[0]);
        
        setKochStyle();
        for(var i = 1; i < points.length; i++){
                context.lineTo(points[i].x,points[i].y);
        }
        
        context.closePath();
        context.stroke();
        context.fill();
        
        for(var i = 0; i < pointsParam.length; i++){
                drawPoint(pointsParam[i]);
        }
        
        requestAnimationFrame(run);
}

requestAnimationFrame(run);