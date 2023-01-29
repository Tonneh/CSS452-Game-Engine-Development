/*
 * This is the logic of our game. 
 */


// Engine Core stuff
import engine from "../engine/index.js";

// Local stuff
import MyGame from "./my_game.js";
import SceneFileParser from "./util/scene_file_parser.js";
import GrayLevel from "./gray_level.js";
import * as Storage from "../engine/resources/storage.js";
import gray_level from "./gray_level.js";

class BlueLevel extends engine.Scene {
    constructor() {
        super();

        // scene file name
        this.mSceneFile = "assets/blue_level.xml";
        // all squares
        this.mSQSet = [];        // these are the Renderable objects

        // The camera to view the scene
        this.mCamera = null;

        this.smallCamera = null;

        this.speed = 1;
    }


    load() {
        engine.xml.load(this.mSceneFile);
    }

    init() {
        let sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile));

        // Step A: Read in the camera
        this.mCamera = sceneParser.parseCamera();

        // Step B: Read all the squares
        sceneParser.parseSquares(this.mSQSet);

        if (!Storage.hasSmallCamera()) {
            this.smallCamera = new engine.Camera(
                vec2.fromValues(20, 60),
                20,
                [100, 350, 100, 100]
            );
            this.smallCamera.setBackgroundColor([0.96, 0, 0.04, 1]);
            Storage.setSmallCamera(this.smallCamera);
        } else {
            this.smallCamera = Storage.getSmallCamera();
        }
    }

    unload() {
        // unload the scene flie and loaded resources
        engine.xml.unload(this.mSceneFile);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1]);
        this.mCamera.setViewAndCameraMatrix();
        // Step  C: draw all the squares
        let i;
        for (i = 0; i < this.mSQSet.length; i++) {
            this.mSQSet[i].draw(this.mCamera);
        }

        this.smallCamera.setViewAndCameraMatrix();
        for (i = 0; i < this.mSQSet.length; i++) {
            this.mSQSet[i].draw(this.smallCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // For this very simple game, let's move the first square
        let xform = this.mSQSet[1].getXform();
        let deltaX = 0.05;

        // Move right and swap over
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(deltaX);
            if (xform.getXPos() > 30) { // this is the right-bound of the window
                xform.setPosition(12, 60);
            }
        }

        // this is for moving the pixel position of the small camera
        this.moveSmallCameraPixelPosition();

        // zooming the main camera in and out
        this.zoomMainCamera();

        this.moveMainCameraWC();

        this.rotateRectangle();

        this.moveWhiteRectangle();

        // Step A: test for white square movement
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-deltaX);
            if (xform.getXPos() < 11) { // this is the left-boundary
                this.next(); // go back to my game
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.R))
            this.increaseSpeed();

        if (engine.input.isKeyClicked(engine.input.keys.N))
            this.next();

        if (engine.input.isKeyPressed(engine.input.keys.Q)) {
            Storage.unload();
            this.stop();  // Quit the game
        }
    }

    moveSmallCameraPixelPosition() {
        // for moving the small camera, clamped so small camera stays on canvas
        if (engine.input.isKeyPressed(engine.input.keys.W))
            if (this.smallCamera.mViewport[1] <= 380)
                this.smallCamera.mViewport[1] += 2;
        if (engine.input.isKeyPressed(engine.input.keys.S))
            if (this.smallCamera.mViewport[1] >= 0)
                this.smallCamera.mViewport[1] -= 2;
        if (engine.input.isKeyReleased(engine.input.keys.A))
            if (this.smallCamera.mViewport[0] >= 0)
                this.smallCamera.mViewport[0] -= 10;
        if (engine.input.isKeyPressed(engine.input.keys.D))
            if (this.smallCamera.mViewport[0] <= 540)
                this.smallCamera.mViewport[0] += 2;
    }

    zoomMainCamera() {
        // this is for zooming in the main camera, clamped so that we don't go into negatives or too far out
        if (engine.input.isKeyPressed(engine.input.keys.Z))
            if (this.mCamera.mWCWidth >= 0)
                this.mCamera.mWCWidth -= 0.5 * this.speed;
        if (engine.input.isKeyPressed(engine.input.keys.X))
            if (this.mCamera.mWCWidth <= 100)
                this.mCamera.mWCWidth += 0.5 * this.speed;
    }

    moveMainCameraWC() {
        // allows for movement of WC camera, clamped down to 5 units so you dont get lost
        if (engine.input.isKeyPressed(engine.input.keys.F)) {
            this.mCamera.mWCCenter[1] += 0.1 * this.speed;
            this.smallCamera.mWCCenter[1] += 0.1 * this.speed;
        }
        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            this.mCamera.mWCCenter[0] -= 0.1 * this.speed;
            this.smallCamera.mWCCenter[0] -= 0.1 * this.speed;
        }
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            this.mCamera.mWCCenter[1] -= 0.1 * this.speed;
            this.smallCamera.mWCCenter[1] -= 0.1 * this.speed;
        }
        if (engine.input.isKeyPressed(engine.input.keys.B)) {
            this.mCamera.mWCCenter[0] += 0.1 * this.speed;
            this.smallCamera.mWCCenter[0] += 0.1 * this.speed;
        }
    }

    rotateRectangle() {
        // full 360 divided by number of seconds divided by the frames per second
        let rectangle = this.mSQSet[1];
        let rotationSpeed = 360 / 5 / 60;
        rectangle.getXform().incRotationByDegree(rotationSpeed * this.speed);
    }

    moveWhiteRectangle() {
        let rectangle = this.mSQSet[0];
        let speed = 20 / 3 / 60;
        rectangle.getXform().incXPosBy(-speed * this.speed);
        if (rectangle.getXform().getXPos() <= 11) {
            rectangle.getXform().setXPos(31);
        }
    }

    increaseSpeed() {
        if (this.speed >= 3.0)
            this.speed = 1.0;
        else
            this.speed += 1.0;
    }
    next() {
        super.next();
        let nextLevel = new GrayLevel();  // load the next level
        nextLevel.start();
    }
}

export default BlueLevel;