/**
 * Created by Sarah Gaidi on 12/3/2015.
 *
 * Map Class
 * - - - - - - - - - - - - -
 * Hold coordinates of items in a map, and its' BackGround image
 *
 * Variables - ALL IN UNITS except except variables in Draw() function!!!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * (_diffX,_diffY) differences between canvas and map axis [0 to MAIN_WIDTH - _width, 0 to HEIGHT - _height]
 * (_x,_y) coordinates present the upper left location of an Item on the map's axis
 * (_dx,_dy) present the width and height of the Map
 * _src is the URL of an image
 * _items is a 2 dimensional array of every [UNIT x UNIT] cube in the Map, each cube contains either:
 * * * * 0 if there's no item there
 * * * * item's address that is found there
 *
 * all arguments must be in UNITs and not pixels (except src url)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * TODO:
 */

// Constants

// Variables

// helpful functions
function isInt(value) {
    if (value % 1 === 0)
        return true;
    else {
        Debugger.log("ERROR: The value: " + value + " is not rounded!!! check if pixels were added instead of UNITs.");
        return false;
    }
}
function inXBoundaries(diffX,dx){
    if(diffX + MAIN_WIDTH <= dx)
        return true;
    else
    {
        Debugger.log("ERROR: With diffX: " + diffX + " and dx: " + dx + ", Map is out of Canvas' X boundary.");
        return false;
    }
}
function inYBoundaries(diffY,dy){
    if(diffT + HEIGHT <= dy)
        return true;
    else
    {
        Debugger.log("ERROR: With diffY: " + diffY + " and dy: " + dy + ", Map is out of Canvas' Y boundary.");
        return false;
    }
}

// sets all UNIT x UNIT cube to 0 (empty)
function initializeArray() {

    if (this._dx != null && this._dy != null) {
        // this can only be done after (_dx,_dy) is set
        for (var i = 0; i < _dx; i++) {
            this._items[i] = new Array(_dy);
            for (var j = 0; j < _dy; j++) {
                this._items[i][j] = 0;
            }
        }
    }
    else
        Debugger.log("In initializeArray(): at least one of (_dx,_dy) is null. Array cannot be initialized.");

}

// Values to enter in Map constructor when one of the arguments is unknown:
/*
    // places Canvas view in upper left corner of Map
    _diffX = 0;
    _diffY = 0;

    // sets width and height as minimal required for display in canvas
    _dx = pixelsToUnit(MAIN_WIDTH);
    _dy = pixelsToUnit(HEIGHT);

    // sets a background image of bubbles :)
    _src = "images/bubbles.jpg";

*/

// arguments must be in UNITS not pixels
function Map(diffX,diffY,dx,dy,src){

    if(isInt(diffX) && isInt(diffY) && isInt(dx) && isInt(dy)   // detecting entry of pixels instead of UNITs
        && diffX >= 0 && diffY >= 0                             // not out of boundaries
        && inXBoundaries(diffX, dx) && inYBoundaries(diffY,dy)) // not smaller than canvas
    {
        // sets upper left location of canvas view in Map
        this._diffX = diffX;
        this._diffY = diffY;

        // sets width & height of Map
        this._dx = dx;
        this._dy = dy;

        // sets images' src
        this._src = src;

        this._items = new Array(this._dx);
        initializeArray();
    }
    else
        Debugger.log("ERROR: Map could not be set.");
}

// yet used
// Getters
function getDiffX() {return this._diffX;}
function getDiffY() {return this._diffY;}
function getDX() {return this._dx;}
function getDY() {return this._dy;}
function getSrc() {return this._src;}

// yet used
// Setters
function setDiffX(diffX) {this._diffX = diffX;}
function setDiffY(diffY) {this._diffY = diffY;}
function setDX(dx) {this._dx = dx;}
function setDY(dy) {this._dy = dy;}
function setSrc(src) {this._src = src;}