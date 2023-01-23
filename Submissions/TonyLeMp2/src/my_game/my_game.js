/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Accessing engine internal is not ideal, 
//      this must be resolved! (later)
import * as loop from "../engine/core/loop.js";

// Engine stuff
import engine from "../engine/index.js";

class MyGame {
    constructor() {
        // variables for the squares
        this.mRedSq = null;

        // The camera to view the scene
        this.mCamera = null;

        this.topBorder = 0;
        this.bottomBorder = 0;
        this.leftBorder = 0;
        this.rightBorder = 0;

        // We will push an array of shapes into this array
        this.spawnedShapesMatrix = [];
        this.amountofSpawnedShapes = 0;
        this.deleteMode = false;
        this.deleteTimer = 0.0;

        // this is for clicked/press mode
        this.currentMode = true;

        this.cursorSpeed = 0.5;
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 65),   // position of the camera
            100,                        // width of camera
            [0, 0, 640, 480]         // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        this.mRedSq = new engine.Renderable();
        this.mRedSq.setColor([1, 0, 0, 1]);

        // This is our cursor
        this.mRedSq.getXform().setPosition(100, 65);
        this.mRedSq.getXform().setSize(1, 1);

        this.getBorders();
    }


    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  D: Activate the red shader to draw
        this.mRedSq.draw(this.mCamera);

        for (let i = 0; i < this.spawnedShapesMatrix.length; i++)
            for (let j = 0; j < this.spawnedShapesMatrix[i].length; j++)
                this.spawnedShapesMatrix[i][j].draw(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.input();
        this.squareTimers();
        gUpdateObject(this.amountofSpawnedShapes, this.deleteMode);
        gUpdateMode(this.currentMode);
        gUpdateCursorSpeed(this.cursorSpeed);
    }

    /* Function to handle inputs */
    input() {
        let redXform = this.mRedSq.getXform();

        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            if (redXform.getYPos() + this.cursorSpeed <= this.topBorder)
                redXform.incYPosBy(this.cursorSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (redXform.getYPos() - this.cursorSpeed >= this.bottomBorder)
                redXform.incYPosBy(-this.cursorSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            if (redXform.getXPos() - this.cursorSpeed >= this.leftBorder)
                redXform.incXPosBy(-this.cursorSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (redXform.getXPos() + this.cursorSpeed <= this.rightBorder)
                redXform.incXPosBy(this.cursorSpeed);
        }
        if (this.currentMode) {
            if (engine.input.isKeyClicked(engine.input.keys.Space)) {
                this.drawSquares(redXform.getXPos(), redXform.getYPos());
            }
        }
        else if (!this.currentMode) {
            if (engine.input.isKeyPressed(engine.input.keys.Space)) {
                this.drawSquares(redXform.getXPos(), redXform.getYPos());
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.D)) {
            if (!this.deleteMode && this.spawnedShapesMatrix.length !== 0) {
                this.deleteMode = true;
                // we want to delete the first one spawned first, so we'll set the deleteTimer to the first shape
                this.deleteTimer = this.spawnedShapesMatrix[0][0].getTimeSinceSpawned();
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.F)) {
            this.currentMode = !this.currentMode;
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.cursorSpeed += 0.5;
            if (this.cursorSpeed >= 1.6) {
                this.cursorSpeed = 0.5;
            }
        }
    }

    /* Generate borders so our cursor can't go off viewport */
    getBorders() {
        // get the border needed
        this.topBorder = (this.mCamera.getWCHeight() / 2.0) + this.mCamera.getWCCenter()[1];

        this.bottomBorder = (this.mCamera.getWCCenter()[1] - this.mCamera.getWCHeight() / 2.0);

        this.leftBorder = (this.mCamera.getWCCenter()[0] - this.mCamera.getWCWidth() / 2.0);

        this.rightBorder = (this.mCamera.getWCWidth() / 2.0) + this.mCamera.getWCCenter()[0];
    }

    /* Will draw a random (10 - 20) of squares of random rotation and random size (1-6) within 5 units of cursor */
    drawSquares(x, y) {
        let arr = [];
        let min = 10;
        let max = 20;
        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // Used this to reference to generate random numbers
        for (let i = 0; i < Math.floor(Math.random() * max - min + 1) + min; i++) {
            // create new shape and assign a random color
            let shape = new engine.Renderable();
            let randomColor = [];
            for (let i = 0; i < 3; i++)
                randomColor.push(Math.random());
            randomColor.push(1);
            shape.setColor(randomColor);

            // Some math to get the spawn area
            let angle = Math.random() * 2 * Math.PI;
            // How far out do we want squares to be spawned, in this case 0-5 units are ok.
            let radius = Math.random() * 5;
            shape.getXform().setPosition(radius * Math.cos(angle) + x, radius * Math.sin(angle) + y);

            // Set Random Rotation
            let angleInRadians = Math.random() * 360 * Math.PI / 180;
            shape.getXform().setRotationInRad(angleInRadians);

            // Set the Size, in this case we want it between 1 and 6
            shape.getXform().setSize(Math.random() * 6, Math.random() * 6);
            arr.push(shape);
        }
        // increment the size, then add to matrix
        this.amountofSpawnedShapes += arr.length;
        this.spawnedShapesMatrix.push(arr);
    }

    /*
    *  Checks if we're in delete mode, if we are then it'll decrease the delete timer, once a shapes timeSinceSpawned is
    *  is greater than the deleteTimer, we'll delete the shape.
    *  If we're not in deleteMode, we'll just keep updating the timeSinceSpawned for the shape.
    */
    squareTimers() {
        if (this.deleteMode) {
            // We need to decrement the timer that was previously set in deleteSquares by the milliseconds per update
            this.deleteTimer -= loop.getkMPF();
            // loop through the matrix and when the timeSinceSpawned is greater than the deleteTime, then we'll delete
            for (let i = 0; i < this.spawnedShapesMatrix.length; i++) {
                for (let j = 0; j < this.spawnedShapesMatrix[i].length; j++) {
                    if (this.spawnedShapesMatrix[i][j].getTimeSinceSpawned() >= this.deleteTimer) {
                        this.spawnedShapesMatrix[i].splice(j, 1);
                        this.amountofSpawnedShapes--;
                    }
                }
                // this is if we've cleared an array, then we'll just delete the array
                if (this.spawnedShapesMatrix[i].length === 0) {
                    this.spawnedShapesMatrix.splice(i, 1);
                    break;
                }
            }
            // if the matrix has no arrays, then we can stop deleting and get out of deletemode
            if (this.spawnedShapesMatrix.length === 0)
                this.deleteMode = false;
        } else {
            // we need to increment by the milliseconds per update the timeSinceSpawned of each spawnedshape
            for (let i = 0; i < this.spawnedShapesMatrix.length; i++) {
                for (let j = 0; j < this.spawnedShapesMatrix[i].length; j++)
                    this.spawnedShapesMatrix[i][j].setTimeSinceSpawned(this.spawnedShapesMatrix[i][j].getTimeSinceSpawned() + loop.getkMPF());
            }
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();

    // new begins the game 
    loop.start(myGame);
}