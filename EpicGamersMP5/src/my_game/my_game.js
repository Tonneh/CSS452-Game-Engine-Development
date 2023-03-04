"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";

import Hero from "./objects/hero.js";
import DyePack from "./objects/dyepack.js"
import Patrol from "./objects/patrol.js"

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kSpriteSheet = "assets/SpriteSheet.png";
        this.kBackground = "assets/bg.png";
        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCamera = null;
        this.mHeroCameraTarget = null;

        this.mTopCameras = [];
        this.mCameraTargets = [];

        this.mHero = null;
        this.mBackground = null;
        this.mMsg = null;
        
        this.mDyePacks = [];
        this.mPatrols = [];
    
        this.mLineSet = [];
        this.mCurrentLine = null;
        this.mP1 = null;

        this.mShowLine = true;

        this.isDyeCollision = false;
        this.dyeCollisionFrames = 0;

        //this.speed = 0;

        this.autoSpawn = false;
        this.nextInterval = null;

    }

    load() {
        engine.texture.load(this.kSpriteSheet);
        engine.texture.load(this.kBackground);
    }

    unload() {
        engine.texture.unload(this.kSpriteSheet);
        engine.texture.unload(this.kBackground);
    }
        
    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(0, 0), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
                // sets the background to gray

        this.mHeroCamera = new engine.Camera(
            vec2.fromValues(0, 0),
            15,
            [0, 600, 200, 200]
        );
        this.mHeroCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        for (let i = 1; i < 4; i++) {
            let cam = new engine.Camera(
                vec2.fromValues(0, 0),
                15,
                [(200 * i), 600, 200, 200]
            );
            cam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            this.mTopCameras.push(cam);
        }
    
        this.mHero = new Hero(this.kSpriteSheet);
        this.mBackground = new TextureRenderable(this.kBackground);
        this.mBackground.getXform().setSize(200, 150);
        this.mBackground.getXform().setPosition(0, 0);

        this.mPatrols.push(new Patrol(this.kSpriteSheet, [0, 0]));

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(-96, -71);
        this.mMsg.setTextHeight(3);


    }
    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
        this.drawEverything(this.mCamera);
        this.mMsg.draw(this.mCamera);
        // if dye is colliding, activate first camera
        if (this.mHeroCameraTarget != null) {
            this.drawEverything(this.mHeroCamera);
        }
        // if there are any other collision events, activate cameras 2, 3, 4
        for (let i = 0; i < this.mCameraTargets.length; i++) {
            if (i > 2) { // only allow first 3 collision events to be shown
                break;
            }
            this.drawEverything(this.mTopCameras[i]);
        }
    }

    // function to draw everything in all arrays for the game
    // needed so that the entire game can be shown through any of the top 4 cameras
    drawEverything(cam) {
        cam.setViewAndCameraMatrix();
        this.mBackground.draw(cam);
        // draw dye packs
        if (this.mDyePacks.length > 0) {
            for (let i = 0; i < this.mDyePacks.length; i++) {
                this.mDyePacks[i].draw(cam);
            }
        }

        // draw patrols
        if (this.mPatrols.length > 0) {
            for (let i = 0; i < this.mPatrols.length; i++) {
                this.mPatrols[i].draw(cam);
            }
        }

        // draw dye
        this.mHero.draw(cam);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        let x, y;
        let currTime = null;

        x = this.mCamera.mouseWCX();
        y = this.mCamera.mouseWCY();
        this.mHero.update(x, y);

        // dye pack update logic
        if (this.mDyePacks.length > 0) {
            for (let i = 0; i < this.mDyePacks.length; i++) {
                this.mDyePacks[i].update();
                // slow down packs
                if (engine.input.isKeyPressed(engine.input.keys.D)) 
                    this.mDyePacks[i].setSpeed(this.mDyePacks[i].getSpeed() - 0.1);
                
                // activate collision event for pack
                if (engine.input.isKeyClicked(engine.input.keys.S)) 
                    this.mDyePacks[i].collisionEvent();
                
                // if pack exits world, destroy it
                if (
                    this.mDyePacks[i].getXform().getXPos() > 100 ||
                    this.mDyePacks[i].getXform().getXPos() < -100 ||
                    this.mDyePacks[i].getXform().getYPos() > 75 ||
                    this.mDyePacks[i].getXform().getYPos() < -75
                ) {
                    this.mDyePacks.splice(i, 1);
                    this.mCameraTargets.splice(i, 1);
                }
                // alive for longer than 5 seconds , destroy it
                else if (this.mDyePacks[i].getAliveTime() >= 300) {
                    this.mDyePacks.splice(i, 1); 
                    this.mCameraTargets.splice(i, 1);
                }
                // speed below 0 , destroy it
                else if (this.mDyePacks[i].getSpeed() <= 0) {
                    this.mDyePacks.splice(i, 1); 
                    this.mCameraTargets.splice(i, 1);
                }                
            }
        }
        
        // patrol update logic
        if (this.mPatrols.length > 0) {
            for (let i = 0; i < this.mPatrols.length; i++) {
                this.mPatrols[i].update();
                // toggle bounding boxes
                if (engine.input.isKeyClicked(engine.input.keys.B)) 
                    this.mPatrols[i].toggleBounds();
                // activate hit event for patrol
                if (engine.input.isKeyClicked(engine.input.keys.J)) 
                    this.mPatrols[i].hitHead();

                // if patrol collides with bounds, reverse its direction
                if ((this.mPatrols[i].getBoundBox().maxX() > 100  && this.mPatrols[i].getmX() > 0) || 
                (this.mPatrols[i].getBoundBox().minX() < -100 && this.mPatrols[i].getmX() < 0) || 
                (this.mPatrols[i].getBoundBox().maxY() > 75 && this.mPatrols[i].getmY() > 0) || 
                (this.mPatrols[i].getBoundBox().minY() < -75 && this.mPatrols[i].getmY() < 0)) {
                    this.mPatrols[i].switchDirection();
                }

                // if patrol exits world bounds, destroy it
                if ((this.mPatrols[i].getBoundBox().minX() > 100) || 
                (this.mPatrols[i].getBoundBox().maxX() < -100) || 
                (this.mPatrols[i].getBoundBox().minY() > 75) || 
                (this.mPatrols[i].getBoundBox().maxY() < -75)) {
                    this.mPatrols[i].kill();
                }

                // if its state indicates its dead, remove it from the came array
                if (this.mPatrols[i].isDead())
                    this.mPatrols.splice(i, 1);
            }
        }

        // fire dye pack
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.fireDyePack();
        }

        // trigger dye collision event
        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            this.dyeCollision();
        }
        // 'wait' function to wait until oscilation is done (60 frames)
        if (this.isDyeCollision) {
            this.dyeCollisionFrames++;
            if (this.dyeCollisionFrames == 60) {
                this.isDyeCollision = false;
                this.dyeCollisionFrames = 0;
                this.mHeroCameraTarget = null;
            }
        }

        // set auto spawn on
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.autoSpawn = !(this.autoSpawn);
            if(this.autoSpawn){
                currTime = performance.now();
                this.nextInterval = currTime + 2000 + (1000 * (Math.random()));
            }
        }

        // if auto spawn is on, make a patrol at a ransom spot with random direction
        if(this.autoSpawn){
            currTime = performance.now();
            if(currTime >= this.nextInterval){
                this.mPatrols.push(new Patrol(this.kSpriteSheet, [200 * (Math.random() - 0.5), 150 * (Math.random() - 0.5)]));
                this.nextInterval = currTime + 2000 + (1000 * (Math.random()));
            }
        }

        // spawn patrol
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.mPatrols.push(new Patrol(this.kSpriteSheet, [200 * (Math.random() - 0.5), 150 * (Math.random() - 0.5)]));
        }




        this.mMsg.setText("Status: Dyepacks(" + this.mDyePacks.length + ") Patrols(" + this.mPatrols.length + ") Autospawn(" + this.autoSpawn + ")");


        // update camera positions if they are tracking elements
        this.updateCameras();
        // check for collisions with dye pack and patrols
        this.checkForCollisions();
    }

    // function to create a new dye pack game object and add it to the array
    fireDyePack() {
        let dyePack = new DyePack(this.kSpriteSheet, this.mHero.getXform().getPosition()); 
        this.mDyePacks.push(dyePack);
    }

    // function to trigger a dye collision event
    dyeCollision() {
        this.mHero.CollisionEvent(); // hero handles its own collision
        this.mHeroCameraTarget = this.mHero;
        this.isDyeCollision = true;
    }

    // function to check for collisions between patrols and dye or patrols and dye packs
    checkForCollisions() {

        // check for collision between patrol and dye
        let dyeCollision = false;
        for (let i = 0; i < this.mPatrols.length; i++) {
            dyeCollision = this.mPatrols[i].checkCollisionWithDye(this.mHero);
            if (dyeCollision) {
                if (!this.mHero.getCollisionStatus()) {
                    this.dyeCollision();
                    break; // break out of loop if collision found
                } 
            }
        }

        // check for collision between patrol and dye pack
        for (let i = 0; i < this.mPatrols.length; i++) {
            // must loop through all patrols and all dye packs because two collision events can fire on any given frame
            for (let k = 0; k < this.mDyePacks.length; k++) {
                let isCollision = false;
                if(!this.mDyePacks[k].getCollisionStatus()){
                    isCollision = this.mPatrols[i].checkCollisionWithPack(this.mDyePacks[k]);
                    if (isCollision) {
                        // if collided, pack collision event
                        this.mCameraTargets.push(this.mDyePacks[k]);
                        this.mDyePacks[k].collisionEvent();
                    }
                    let boxCollision = false;
                    boxCollision = this.mPatrols[i].checkBoundBoxCollision(this.mDyePacks[k]);
                    if(boxCollision){
                        // if collided with bounding box, slow down pack
                        this.mDyePacks[k].setSpeed(this.mDyePacks[k].getSpeed() - 0.1); 
                    
                    }
                }
            }
        }
    }

    // function to update camera position if there are any collision events to follow
    updateCameras() {
        // if dye is colliding, center camera on her
        if (this.mHeroCameraTarget != null) {
            this.mHeroCamera.setWCCenter(
                this.mHero.getXform().getPosition()[0],
                this.mHero.getXform().getPosition()[1]
            );
            this.mHeroCamera.update();
        }

        // for the first 3 dye pack collision events, center the camera on them
        if (this.mCameraTargets.length > 0) {
            for (let i = 0; i < this.mCameraTargets.length; i++) {
                // only allow the first 3 collision events to be targeted by a camera
                if (i > 2) {
                    break;
                }
                let target = this.mCameraTargets[i];
                let cam = this.mTopCameras[i];
                cam.setWCCenter(
                    target.getXform().getXPos(),
                    target.getXform().getYPos()
                );
                cam.update();
            }
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}