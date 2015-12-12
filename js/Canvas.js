/**
 * Created by Sarah Gaidi on 10/19/2015.
 */

// Constants
{
    // Game Dimensions. all in pixels
    const HEIGHT = 0.85 * window.innerHeight;
    const MENU_HEIGHT = HEIGHT * 0.4;
    const MAIN_RATIO = 0.75; // ratio between menu and main, and between main's height & width
    const MAIN_WIDTH = HEIGHT / MAIN_RATIO; // ratio of bg
    const WIDTH =  MAIN_WIDTH / MAIN_RATIO; // set WIDTH by ratio
    const MENU_WIDTH = WIDTH - MAIN_WIDTH;
}

// Variables
{
    // Game Dimensions. all in UNIT
    var unit = 13; // pixels. size of smallest "cube"
    var heightUnits = Math.round(HEIGHT / unit);
    var mainWidthUnits = Math.round(MAIN_WIDTH / unit);

    // context, items etc
    var context, mainCanvas, menuCanvas; // objects from HTML
    var then = Date.now(); // initial time
    var StaticItems; // items displayed on canvas
    var img1, img2, img3, img4;
    var i; // for loops
}

// Debugger instead of console.log to prevent errors in some browsers
var Debugger = function () { };
Debugger.log = function (message) {
    try {
        console.log(message);
    } catch (exception) {}
};

// Waits till the whole page finishes loading, then executes myCanvas()
window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded () {
    myCanvas();
}

function myCanvas() {

    // gets the canvases' context
    mainCanvas = document.getElementById("mainScreen");
    context = mainCanvas.getContext("2d");
    menuCanvas = document.getElementById("menuScreen");

    // checks if canvas and context exists
    if (!mainCanvas || !context || !menuCanvas || !menuCanvas.getContext("2d")) {
        Debugger.log("no canvas of the id's: 'mainScreen', 'menuScreen' or no context");
        return;
    }

    // set dimensions
    mainCanvas.height = HEIGHT;
    mainCanvas.width = MAIN_WIDTH;
    menuCanvas.height = MENU_HEIGHT;
    menuCanvas.width = MENU_WIDTH;
    document.getElementById("menu").width = MENU_WIDTH;

    // TODO: add items loop
    StaticItems = [new BackGroundImg("images/terrain.jpg",2),
        new Circle(10,25,5),
        new Circle(100,50,3),
        new Circle(60,20,4)];
    img1 = new Player();
    img4 = new Grid();

    // start game loop
    animationLoop();
}

function zoomIn() {
    unit *= 1.2;
    for(i=0; i<StaticItems.length;i++) StaticItems[i].zoomIn();
    img1.zoomIn();
}

function zoomOut() {
    unit /= 1.2;
    for(i=0; i<StaticItems.length;i++) StaticItems[i].zoomOut();
    img1.zoomOut();
}

// Updates location, appearance etc of objects for next frame
var update = function (modifier) {

    // TODO: set array of objects and update according to user and initial set
    //movePlayer(modifier,items[1]);

    img1.movePlayer(modifier,StaticItems[0]);
};

// Draws on canvas
function render() {

    for(i=0; i<StaticItems.length;i++) StaticItems[i].draw(); //static items
    img1.draw(); //player
    img4.draw();


    // TODO:
    // array of objetcs on bg
    // render function sets new appearance, location etc for each interval

    // adding text to canvas
    // TODO: change text in menu canvas or just the menu ??

    /*context.fillStyle = "rgb(250, 250, 250)";
     context.font = "24px Helvetica";
     context.textAlign = "left";
     context.textBaseline = "top";
     context.fillText("Goblins caught: " + monstersCaught, 32, 32);*/
}

// Browsers optimize concurrent animations together into a single reflow and repaint cycle
window.requestAnimaFrame = (function(){
    return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var animationLoop = function () {
    // Request to do this again ASAP
    requestAnimaFrame(animationLoop);

    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Prints screen of game in new window
function createImageDataPressed() {
    window.open(document.getElementById("gameMain").toDataURL(),"canvasImage","left=0,top=0,width=" +
        MAIN_WIDTH + ",height=" + HEIGHT +",toolbar=0,resizable=0");
}