/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!


// Engine stuff
import engine from "../engine/index.js";

// User stuff
import BlueLevel from "./blue_level.js";
import GrayLevel from "./gray_level.js";

class MyGame extends engine.Scene {

    constructor() {
        super();
    }


    init() {
        let startLevel = new GrayLevel();
        startLevel.start();
    }

    next() {      
        super.next();  // this must be called!

        // next scene to run
        let nextLevel = new GrayLevel();  // next level to be loaded
        nextLevel.start();
    }
}
export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}