const path = require('path');
import './lib/hex.js';
import $ from 'jquery/dist/jquery.min';
import '../css/desktop.scss';

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

var ROOT3OVER2 = Math.sqrt(3) / 2,
    scale = 60,
    board = [];

var playerSpace;
var hex;

// Draw a hexagon with a given length about (x, y) and a fill
function drawHex(x, y, length, fill) {
    var radius = Math.floor(length * ROOT3OVER2)
    
    ctx.beginPath();
        ctx.moveTo(x - length / 2, y + radius);
        ctx.lineTo(x + length / 2, y + radius);
        ctx.lineTo(x + radius, y);
        ctx.lineTo(x + length / 2, y - radius);
        ctx.lineTo(x - length / 2, y - radius);
        ctx.lineTo(x - radius, y);
    ctx.closePath();

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = .25;

    if (fill) {
        ctx.fillStyle = "red";
        ctx.fill();
    }

    ctx.stroke(); // draws the actual hex
};

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Define the player area and the board area
function calcArea() {
    playerSpace = {x: canvas.width, y: canvas.height * .15};
};

// Draw in lines to segment board into player and board spaces
function drawTiles() {
    calcArea();
    ctx.fillRect(0, 0, playerSpace.x, playerSpace.y);
    ctx.fillRect(0, canvas.height - playerSpace.y, playerSpace.x, playerSpace.y);
};

// Draw a board of hexagons with an offset
function drawBoard(scale, xOffset, yOffset) {
    var length = scale
        , radius = Math.floor(length * ROOT3OVER2)
        , boardLength = 16; //sqrt(22), the longest possible diagonal play
    
    for (var i = 0; i < boardLength; i++) {
        for (var j = 0; j < boardLength; j++) {
            hex = new drawHex( (radius + length / 2 ) * i + xOffset
                    , radius * 2 * j + radius * (i % 2) + yOffset
                    , length
                    , false
                   );
        }
        board.push(hex);
    }
};

// Redraws the entire canvas
function redraw(scale) {
    clearCanvas();
    drawBoard(scale, 0, 0);
    drawTiles();
};

// Resizes the canvas to the new dimensions
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calcArea();
    redraw(scale);
};

// Zoom by giving a new length to the hexagons
function zoom(evt) {
    var zoom = evt.wheelDelta / 100
        , factor = Math.pow(1.1, zoom);
    
    // Sets limits on the zoom
    if (scale > 26 && scale < 76) {
        scale *= factor;
    } else if (scale < 26) {
        scale = 27;
    } else {
        scale = 75;
    }

    redraw(scale);
};

// Change the board back to its default zoom
function resetZoom() {
    // 60 is default scale
    redraw(60);
};

// Grab the coordinates of when the mouse is first put down
function mouseDown(evt) {
    var isDown = true;

    // Grab the coordinates of the mouse when it's first held down
    var mouse = {
        x: evt.clientX,
        y: evt.clientY
    };
    
    console.log("start:" + mouse.x + " " + mouse.y);
    
    // Only move the canvas while the mouse is held down
    addEventListener("mousemove", mousemove);
    addEventListener("touchmove", mousemove);
    function mousemove(evt) {

        // Get the coordinate of the mouse every time it moves
        var current = {
            x: evt.clientX,
            y: evt.clientY
        }
        if (isDown) {
            // Redraw the board with an offset every time the mouse moves
            clearCanvas();
            drawBoard(scale, current.x - mouse.x, current.y - mouse.y);
            drawTiles();
        }
        console.log("end:" + current.x + " " + current.y);
    };

    addEventListener("mouseup", function() {
        isDown = false;
        removeEventListener("mousemove", mousemove);
    });

    addEventListener("touchend", function() {
        isDown = false;
        removeEventListener("touchmove", mousemove);
    });

};

// Redraw the board when the window is resized
addEventListener("resize", resizeCanvas);

// Zoom when scrolling with the mouse wheel
addEventListener("mousewheel", zoom);

// Allow canvas panning while the mouse is down
addEventListener("mousedown", mouseDown);


/*          MOBILE EVENT LISTENERS              */
addEventListener("touchstart", mouseDown);

// Draw the board when the window loads
addEventListener("load", function () {
    resizeCanvas()
    redraw(scale);
});


