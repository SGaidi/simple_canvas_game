/**
 * Created by Sarah Gaidi on 11/8/2015.
 *
 * Draw Class
 * - - - - - - - - - - - - -
 * Creates and handles items (image/shape) on canvas
 *
 * Variables
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * (x,y) coordinates present the upper left location of an item on the canvas's axis
 * (dx,dy) present the width and height of the item on canvas
 * src is the URL of an image
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * TODO: add use of sx,sy for clipping images from one big image
 */

// Constants
const ZOOM = 1.2;

// Compares two coordinates
const ACCURACY = 0.5;
// Variables
// Canvas's center coordinates in unit
var centerX = mainWidthUnits * 0.5,
    centerY = heightUnits * 0.5;

function bigger(num1, num2) {
    return Math.round(num1*ACCURACY) >= Math.round(num2*ACCURACY)
}

// Handles Keyboard presses from user
var keysDown = {};
addEventListener("keydown", function keydownCallback (e) {
    keysDown[e.keyCode] = true;
    Debugger.log("keyDown");
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    Debugger.log("keyUp");
}, false);

// Converts unit to Pixels and oppositely
var unitToPixels = function(value) {
    return (Math.round(value) * unit);
},
    pixelsToUnit = function(value) {return Math.round(value / unit);};

// Presents an image from a source, or a "manually" drawn path
function Item(x,y,dx,dy) {

    // All in pixels
    this.x = unitToPixels(x);
    this.y = unitToPixels(y);
    this.dx = unitToPixels(dx);
    this.dy = unitToPixels(dy);

    this.zoomIn = function() {
        var diffX = this.dx * (ZOOM - 1);
        var diffY = this.dy * (ZOOM - 1);
        this.dx += diffX;
        this.dy += diffY;
        this.x *= ZOOM;
        this.y *= ZOOM;
    };

    this.zoomOut = function() {
        var diffX = this.dx * (1 - 1/ZOOM);
        var diffY = this.dy * (1 - 1/ZOOM);
        this.dx -= diffX;
        this.dy -= diffY;
        this.x /= ZOOM;
        this.y /= ZOOM;
    };

    this.toString = function() {return ("X: " + this.x + " Y: " + this.y + " dX: " + this.dx + " dY: " + this.dy);};
}

// An image
function Img(x,y,dx,dy,src) {
    this.base = Item;
    this.base(x,y,dx,dy);

    this.img = new Image();
    this.img.onload = function(){Debugger.log("Image loaded: " + src);};
    this.img.onerror = function(){Debugger.log("Error loading image: " + src);};
    this.img.src = src;

    this.draw = function() {
        /* context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
         sx,sy - where clipping from image starts
         sw,sh - dx,dy of clipped image
         x,y - location on canvas
         w,h - dx dy on canvas */
        context.drawImage(this.img, 0, 0, this.img.width, this.img.height, // for all singular img files
            this.x, this.y, this.dx, this.dy); // for set x,y,dx,dy
        Debugger.log("Drawing: " + this.img.src);
    };

    this.toString = function() {return ("src: " + this.img.src);};
}

// Specific image set for background
function BackGroundImg(src,size) {
    this.base = Img;
    this.base(0,0,mainWidthUnits * size,heightUnits * size,src);
    // TODO: handle size

    this.zoomIn = function() {
        var diffX = this.dx * (ZOOM - 1);
        var diffY = this.dy * (ZOOM - 1);
        this.dx += diffX;
        this.dy += diffY;
        this.x *= ZOOM;
        this.y *= ZOOM;
    };

    this.zoomOut = function() {
        var diffX = this.dx * (1 - 1/ZOOM);
        var diffY = this.dy * (1 - 1/ZOOM);
        this.dx -= diffX;
        this.dy -= diffY;
        this.x /= ZOOM;
        this.y /= ZOOM;
    };
}

// A path of a circle
function Circle(centerX,centerY,radius) {
    this.base = Item;
    this.base(centerX - radius, centerY - radius, radius * 2,radius * 2);

    this.radius = unitToPixels(radius);
    this.centerX = unitToPixels(centerX);
    this.centerY = unitToPixels(centerY);

    this.draw = function() {
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green'; // TODO: color
        context.fill();
        context.lineWidth = 3; // TODO: set universal line
        context.strokeStyle = '#003300'; // TODO: color
        context.stroke();
    };

    this.zoomIn = function() {
        var diff = this.dx * (ZOOM - 1);
        this.dx += diff;
        this.dy += diff;
        this.radius += diff/2;
        this.x *= ZOOM;
        this.y *= ZOOM;
        this.centerX *= ZOOM;
        this.centerY *= ZOOM;

    };

    this.zoomOut = function() {
        var diff = this.dx * (1 - 1/ZOOM);
        this.dx -= diff;
        this.dy -= diff;
        this.radius -= diff/2;
        this.x /= ZOOM;
        this.y /= ZOOM;
        this.centerX /= ZOOM;
        this.centerY /= ZOOM;
    };

    this.toString = function() {return ("Circle of radius: " + this.radius + ". center: " + this.centerX + "," + this.centerY);};
}

// Specific Item with additional functions
function Player() {
    this.base = Circle;
    this.base(centerX,centerY,1);

    // TODO: set wasd or arrows in preferance
    // moves the player on screen
    this.movePlayer = function(mod,imgBG) {
        var dif = 15 * unit * mod;

        // checks if player will be inside screen
        // if player is at the middle of the screen, and if BG doesn't go out of boundries
        if ((38 in keysDown || 87 in keysDown) && this.y - dif >= 0) { // Player holding up
            if(bigger(HEIGHT*0.5,this.centerY) && - imgBG.y - dif >= 0){
                StaticItems[0].y += dif;
                for(i=1; i<StaticItems.length;i++) StaticItems[i].centerY += dif;
            }

            else {
                this.y -= dif;
                this.centerY -= dif;
            }
        }

        if ((40 in keysDown || 83 in keysDown) && this.y + this.dy + dif <= HEIGHT) { // Player holding down
            if(bigger(this.centerY,HEIGHT*0.5) && HEIGHT - imgBG.y + dif <= imgBG.dy)
                for(i=0; i<StaticItems.length;i++) {
                    StaticItems[0].y -= dif;
                    for(i=1; i<StaticItems.length;i++) StaticItems[i].centerY -= dif;
                }
            else {
                this.y += dif;
                this.centerY += dif;
            }
        }

        if ((37 in keysDown || 65 in keysDown) && this.x - dif >= 0) { // Player holding left
            if(bigger(MAIN_WIDTH*0.5,this.centerX) && - imgBG.x - dif >= 0)
                for(i=0; i<StaticItems.length;i++) {
                    StaticItems[0].x += dif;
                    for(i=1; i<StaticItems.length;i++) StaticItems[i].centerX += dif;
                }
            else {
                this.x -= dif;
                this.centerX -= dif;
            }
        }

        if ((39 in keysDown || 68 in keysDown) && this.x + this.dx + dif <= MAIN_WIDTH) { // Player holding right
            if(bigger(this.centerX,MAIN_WIDTH*0.5) && MAIN_WIDTH - imgBG.x + dif <= imgBG.dx)
                for(i=0; i<StaticItems.length;i++) {
                    StaticItems[0].x -= dif;
                    for(i=1; i<StaticItems.length;i++) StaticItems[i].centerX -= dif;
                }
            else {
                this.x += dif;
                this.centerX += dif;
            }
        }
    };
}

// draws a grid representing set smallest units of drawing
function Grid() {
    this.base = Item;
    this.base(0,0,unit,unit);

    this.draw = function() {
        context.beginPath();
        context.lineWidth = 1; // TODO: set universal line
        context.strokeStyle = '#000000'; // TODO: color
        for(var i=0; i<(HEIGHT/unit); i++){
            context.moveTo(0, i * unit);
            context.lineTo(MAIN_WIDTH, i * unit);
            context.stroke();
        }
        for(var j=0; j<(MAIN_WIDTH/unit); j++){
            context.moveTo(j * unit, 0);
            context.lineTo(j * unit, HEIGHT);
            context.stroke();
        }

    };

    this.toString = function() {return ("Grid.");}
}
