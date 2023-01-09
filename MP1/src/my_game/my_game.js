/*
 * File: MyGame.js
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import * as engine from "../engine/core.js";

class MyGame {

    constructor(htmlCanvasID) {
        // Step A: Initialize the game engine
        engine.init(htmlCanvasID);

        // Step B: Clear the canvas
        engine.clearCanvas(pink);

        // Step C: Draw the square in red

        /* Drawing the top row */
        engine.drawSquare(black, [col1, row1], scale1);
        engine.drawSquare(brown, [col2, row1], scale2);
        engine.drawSquare(red, [col3, row1], scale3);
        engine.drawSquare(green, [col4, row1], scale4);
        engine.drawSquare(blue, [col5, row1], scale5);

        /* Drawing Middle Row */
        engine.drawTriangle(black, [col1, row2], scale1);
        engine.drawTriangle(brown, [col2, row2], scale2);
        engine.drawTriangle(red, [col3, row2], scale3);
        engine.drawTriangle(green, [col4, row2], scale4);
        engine.drawTriangle(blue, [col5, row2], scale5);

        /* Drawing Last Row */
        engine.drawCircle(black, [col1, row3], scale1);
        engine.drawCircle(brown, [col2, row3], scale2);
        engine.drawCircle(red, [col3, row3], scale3);
        engine.drawCircle(green, [col4, row3], scale4);
        engine.drawCircle(blue, [col5, row3], scale5);
    }
}

/* Colors */
let black = [0, 0, 0, 1];
let red = [1, 0 , 0, 1];
let brown = [0.59, 0.29, 0, 1];
let pink = [1, 0.75, 0.80, 1];
let blue = [0, 0, 1, 1];
let green = [0, 1, 0, 1];

/* Positions */

let row1 = 0.6; // Top Row;
let row2 = 0;
let row3 = -0.6;

let col1 = -0.85; // Leftmost Column
let col2 = -0.6;
let col3 = -0.3;
let col4 = 0.07;
let col5 = 0.65; // rightmost column

/* Scales */

let scale1 = [0.1, 0.3];
let scale2 = [0.3, 0.1];
let scale3 = [0.2, 0.25];
let scale4 = [0.35, 0.35];
let scale5 = [0.55, 0.55];

window.onload = function() {
    new MyGame('GLCanvas');
}
