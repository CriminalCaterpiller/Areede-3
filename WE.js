width = 500;height = 500;
c = document.createElement("canvas");
displayC = document.createElement("canvas");
displayC.width = width; displayC.height = height;
displayCtx = displayC.getContext("2d");
document.body.appendChild(displayC);
c.width = width; c.height = height;

ctx = c.getContext("2d");

displayCtx.fillStyle = "#000000";
displayCtx.fillRect(0,0,
displayC.width,displayC.height);

cameraX = 0; cameraY = 0;

GameLoop = function(){
if(window.innerHeight != screen.height){
displayC.width = c.width;
displayC.height = c.height;
}else{
displayC.width = screen.height*c.width/c.height;  
displayC.height = screen.height;
}
room.loop();
if (changing) changeLoop();
displayCtx.drawImage(c,0,0,
displayC.width,displayC.height);
}

fade = false;
fadeAlpha = 0;
changing = false;
changingRoom = {};

changeRoom = function(newRoom){
changingRoom = newRoom;
changing = true; fade = true;
room.update = function(){}
}

changeLoop = function(){
displayFade(.05);
if (fadeAlpha>=1){
fade = false; room = changingRoom;
}
//console.log(fadeAlpha);
if (!fade && Math.floor(fadeAlpha*10)/10 == 0)
changing = false;
}

displayFade = function(speed){
if (fade  && fadeAlpha < 1)fadeAlpha+=speed;
if (!fade && fadeAlpha > 0)fadeAlpha-=speed;
ctx.fillStyle = "#000000";
ctx.globalAlpha = fadeAlpha;
ctx.fillRect(0,0,width,height);
ctx.globalAlpha = 1;
}

function moveCameraX(player,tempRoom){
this.cX = player.x +player.w/2 - c.width/2;
if(tempRoom.x>player.x +player.w/2-c.width/2)
this.cX = tempRoom.x;
if(player.x+player.w/2-c.width/2>
tempRoom.x+tempRoom.w-width)
this.cX = tempRoom.x+tempRoom.w-width;
return this.cX;
}
 
function moveCameraY(player,tempRoom){
this.cY = player.y + player.h/2 - c.height/2;
if(tempRoom.y>player.y+player.h/2-c.height/2)
this.cY = tempRoom.y;
if(player.y+player.h/2-c.height/2>
tempRoom.y+tempRoom.h-height)
this.cY = tempRoom.y+tempRoom.h-c.height;
return this.cY;
}

function Room(){
this.x = 0;this.y = 0;
this.w = 500;this.h = 500;
this.obstacles = [];
this.entitys = [];
this.loop = function(){
this.update();
this.display();
}
this.border = function(obj){
if (obj.x<0)
obj.x=0;
if (obj.x+obj.w>this.w)
obj.x=this.w-obj.w;
if (obj.y<0)
obj.y=0;
if (obj.y+obj.h>this.h)
obj.y=this.h-obj.h;
}

this.displayArray = function(arr){
for (i = 0; i < arr.length; i++){
arr[i].x -= cameraX;
arr[i].y -= cameraY;
arr[i].display();
arr[i].x += cameraX;
arr[i].y += cameraY;
}}

this.collideObstacles = function(obj){
for (obs = 0; obs < this.obstacles.length; obs++){    
if (obj != this.obstacles[obs])
collideRect(obj,this.obstacles[obs]);
}}

this.hitTestObstacles = function(obj){
for (obs = 0; obs < this.obstacles.length; obs++){   
if (obj != this.obstacles[obs] &&
hitTestRect(obj,this.obstacles[obs])) return true;
}
return false;
}

this.update = function(){}
this.display = function(){
this.displayArray(this.entitys);
}
}


function fullscreen(){
if(displayC.webkitRequestFullScreen) {
displayC.webkitRequestFullScreen();
}
else {
displayC.mozRequestFullScreen
}
displayC.width = screen.height*c.width/c.height;  
displayC.height = screen.height;     
}

displayEntity = function(){
ctx.fillStyle = this.color;
ctx.fillRect(this.x,this.y,this.w,this.h);
}

function hitTestRectCoords(x1, y1, w1, h1, x2, y2, w2, h2){
if(x1 < x2 + w2 && x2 < x1 + w1
&& y1 < y2 + h2 && y2 < y1 + h1)
return true;
return false;
}

function hitTestRect(obj1, obj2){
return hitTestRectCoords(obj1.x,obj1.y,obj1.w,obj1.h,
    obj2.x,obj2.y,obj2.w,obj2.h);
}

function addToArray(elm, arr){
tempArray = new Array(arr.length+1);
for (adtoarr = 0; adtoarr < 
arr.length; adtoarr++){
tempArray[adtoarr] = arr[adtoarr];
}
tempArray[arr.length] = elm;
return tempArray;
}

function removeFromArray(elm, arr){
tempArray = [];
for (rmfromarr = 0; rmfromarr < 
arr.length; rmfromarr++){
if(arr[rmfromarr]!=elm) tempArray = 
addToArray(arr[rmfromarr],tempArray);
}
return tempArray;
}


function collideRectCoords(obj1, w1, h1, obj2, w2, h2){
if (hitTestRectCoords(obj1.x, obj1.y, w1, h1, obj2.x, obj2.y, w2, h2)){
this.xPen = 0;
this.yPen = 0;
if (obj1.x<obj2.x){
xPen = obj1.x + w1 - obj2.x;
}else{
xPen = obj2.x + w2 - obj1.x;
}
if (obj1.y<obj2.y){
yPen = obj1.y + h1 - obj2.y;
}else{
yPen = obj2.y + h2 - obj1.y;
}
if (xPen > yPen){
if (obj1.y > obj2.y){
obj1.y += yPen;
}else{
obj1.y -= yPen;
}}else{
if (obj1.x > obj2.x){
obj1.x += xPen;
}else{
obj1.x -= xPen;
}}}}

function collideRect(obj1, obj2){
collideRectCoords(obj1,obj1.w,obj1.h,
obj2,obj2.w,obj2.h);
}

function hitTestCircleCoords(x1,y1,r1,x2,y2,r2){
if (Math.sqrt(Math.pow(x2+r2-x1-r1,2) + Math.pow(-y2-r2+y1+r1,2)) < r1+r2
&& hitTestRectCoords(x1, y1, r1*2, r1*2, x2, y2, r2*2, r2*2))
return true;
return false;
}

function collideCircleCoords(obj1,r1,obj2,r2){
this.angle = Math.atan2(obj1.y+r1-obj2.y-r2,
obj1.x+r1-obj2.x-r2);
if (hitTestCircleCoords(obj1.x,obj1.y,r1,obj2.x,obj2.y,r2)){
this.xPen = (Math.cos(Math.PI+angle)*r1 + obj1.x + r1) -
(Math.cos(angle)*r2 + obj2.x + r2);
this.yPen = (Math.sin(Math.PI+angle)*r1 + obj1.y + r1) -
(Math.sin(angle)*r2 + obj2.y + r2);
obj1.x -= xPen/2;obj1.y -= yPen/2;
obj2.x += xPen/2;obj2.y += yPen/2;
}}