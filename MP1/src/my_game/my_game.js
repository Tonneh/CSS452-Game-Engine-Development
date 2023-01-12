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
        engine.clearCanvas(darkGrey);

        this.drawSquareRow();
        this.drawTriangleRow();
        this.drawCircleRow();
        //this.drawHouse();
    }

    drawSquareRow() {
        /* Drawing the top row */
        engine.drawSquare(black, [col1, row1], scale1);
        engine.drawSquare(lightRed, [col2, row1], scale2);
        engine.drawSquare(orange, [col3, row1], scale3);
        engine.drawSquare(pink, [col4, row1], scale4);
        engine.drawSquare(skyBlue, [col5, row1], scale5);
    }

    drawTriangleRow() {
        /* Drawing Middle Row */
        engine.drawTriangle(black, [col1, row2], scale1);
        engine.drawTriangle(lightRed, [col2, row2], scale2);
        engine.drawTriangle(orange, [col3, row2], scale3);
        engine.drawTriangle(pink, [col4, row2], scale4);
        engine.drawTriangle(skyBlue, [col5, row2], scale5);
    }

    drawCircleRow() {
        /* Drawing Last Row */
        engine.drawCircle(black, [col1, row3], scale1);
        engine.drawCircle(lightRed, [col2, row3], scale2);
        engine.drawCircle(orange, [col3, row3], scale3);
        engine.drawCircle(pink, [col4, row3], scale4);
        engine.drawCircle(skyBlue, [col5, row3], scale5);
    }

    drawHouse() {
        /* Code for Drawing a House */

        /* Background Sky */
        engine.drawSquare(skyBlue, [0, 0.3], [2, 1.5]);
        engine.drawSquare(grassGreen, [0, -0.8], [2, 0.8]);

        /* Base House */
        engine.drawSquare(brown, [0, -0.5], [1, 1]);
        engine.drawTriangle(darkGrey, [0, 0.5], [1, 1]);

        /* Door */
        engine.drawSquare(green, [0, -0.7], [0.25, 0.6]);
        engine.drawCircle(black, [0.07, -0.75], [0.05, 0.05]);
        engine.drawSquare(black, [0.125, -0.7], [0.01, 0.6]);
        engine.drawSquare(black, [-0.125, -0.7], [0.01, 0.6]);
        engine.drawSquare(black, [0, -0.4], [0.25, 0.01]);

        /* Window */
        engine.drawSquare(white, [0, 0.3], [0.3, 0.3]);
        engine.drawSquare(black, [0, 0], [1, 0.01]);
        engine.drawSquare(black, [0, 0.45], [0.3, 0.01]);
        engine.drawSquare(black, [0, 0.15], [0.3, 0.01]);
        engine.drawSquare(black, [0, 0.3], [0.01, 0.3]);
        engine.drawSquare(black, [0.15, 0.3], [0.01, 0.3]);
        engine.drawSquare(black, [-0.15, 0.3], [0.01, 0.3]);

        /* Draw the Sun */
        engine.drawCircle(yellow, [-1.0, 0.9], [0.5, 0.5]);

        /* Cloud */
        engine.drawCircle(white, [0.7, 0.7], [0.2, 0.2]);
        engine.drawCircle(white, [0.6, 0.7], [0.2, 0.2]);
        engine.drawCircle(white, [0.8, 0.7], [0.2, 0.2]);
        engine.drawCircle(white, [0.8, 0.82], [0.2, 0.2]);
        engine.drawCircle(white, [0.7, 0.82], [0.2, 0.2]);
        engine.drawCircle(white, [0.6, 0.82], [0.2, 0.2]);
    }
}

/* Colors */
let black = [0, 0, 0, 1];
let red = [1, 0, 0, 1];
let lightRed = [1, 0.4, 0.4, 1];
let orange = [1, 0.6, 0.5, 1];
let brown = [0.70, 0.40, 0.11, 1];
let pink = [1, 0.75, 0.80, 1];
let blue = [0, 0, 1, 1];
let green = [0, 1, 0, 1];
let grassGreen = [0.5, 0.80, 0.31, 1];
let white = [1, 1, 1, 1];
let yellow = [1, 1, 0, 1];
let skyBlue = [0.53, 0.80, 0.92, 1];
let darkGrey = [0.35, 0.35, 0.35, 1];

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

window.onload = function () {
    new MyGame('GLCanvas');
}
