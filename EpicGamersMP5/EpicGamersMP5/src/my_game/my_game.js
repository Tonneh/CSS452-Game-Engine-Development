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
        console.log(this.mTopCameras);
    
        this.mHero = new Hero(this.kSpriteSheet);
        this.mBackground = new TextureRenderable(this.kBackground);
        this.mBackground.getXform().setSize(200, 150);
        this.mBackground.getXform().setPosition(0, 0);

        this.mPatrols.push(new Patrol(this.kSpriteSheet, [0, 0]));
        console.log(this.mPatrols);

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
        if (this.mHeroCameraTarget != null) {
            this.drawEverything(this.mHeroCamera);
        }
        for (let i = 0; i < this.mCameraTargets.length; i++) {
            if (i > 2) {
                break;
            }
            this.drawEverything(this.mTopCameras[i]);
        }
        // if (this.mHeroCameraTarget != null) {
        //     this.mHeroCamera.setViewAndCameraMatrix();
        //     this.mHeroCameraTarget.draw(this.mHeroCamera);
        // }
        // if (this.mTopCameras.length > 0) {
        //     console.log(this.mTopCameras.length);
        //     for (let i = 0; i < this.mTopCameras.length; i++) {
        //         let target = this.mTopCameras[i][1];
        //         let cam = this.mTopCameras[i][0];
        //         cam.setViewAndCameraMatrix();
        //         this.mBackground.draw(cam);
        //         target.draw(cam);
        //     }
        // }

        let i, l;
        
        // this.mCamera.setViewAndCameraMatrix();
        
        // this.mBackground.draw(this.mCamera);
        // this.mHero.draw(this.mCamera);

        // if (this.mDyePacks.length > 0) {
        //     for (let i = 0; i < this.mDyePacks.length; i++) {
        //         this.mDyePacks[i].draw(this.mCamera);
        //     }
        // }

        // if (this.mPatrols.length > 0) {
        //     for (let i = 0; i < this.mPatrols.length; i++) {
        //         this.mPatrols[i].draw(this.mCamera);
        //     }
        // }

        
        //this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }

    drawEverything(cam) {
        cam.setViewAndCameraMatrix();
        this.mBackground.draw(cam);
        if (this.mDyePacks.length > 0) {
            for (let i = 0; i < this.mDyePacks.length; i++) {
                this.mDyePacks[i].draw(cam);
            }
        }

        if (this.mPatrols.length > 0) {
            for (let i = 0; i < this.mPatrols.length; i++) {
                this.mPatrols[i].draw(cam);
            }
        }

        this.mHero.draw(cam);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            console.log("moving WC Center");
            this.mCamera.setWCCenter(
                this.mCamera.getWCCenter()[0] + 10, 
                this.mCamera.getWCCenter()[1]
            );
            console.log("new WC Center: " + this.mCamera.getWCCenter());
            this.mCamera.update();
        }
        

        let msg = "Lines: " + this.mLineSet.length + " ";
        let echo = "";
        let x, y;
        let currTime = null;

        x = this.mCamera.mouseWCX();
        y = this.mCamera.mouseWCY();
        this.mHero.update(x, y);

        
        if (this.mDyePacks.length > 0) {
            for (let i = 0; i < this.mDyePacks.length; i++) {
                this.mDyePacks[i].update();
                if (engine.input.isKeyPressed(engine.input.keys.D)) 
                    this.mDyePacks[i].setSpeed(this.mDyePacks[i].getSpeed() - 0.1);
                
                if (engine.input.isKeyClicked(engine.input.keys.S)) 
                    this.mDyePacks[i].collisionEvent();
                    
                if (
                    this.mDyePacks[i].getXform().getXPos() > 100 ||
                    this.mDyePacks[i].getXform().getXPos() < -100 ||
                    this.mDyePacks[i].getXform().getYPos() > 75 ||
                    this.mDyePacks[i].getXform().getYPos() < -75
                ) {
                    this.mDyePacks.splice(i, 1);
                    this.mCameraTargets.splice(i, 1);
                }
                // alive for longer than 5 seconds 
                else if (this.mDyePacks[i].getAliveTime() >= 300) {
                    this.mDyePacks.splice(i, 1); 
                    this.mCameraTargets.splice(i, 1);
                }
                // speed below 0 
                else if (this.mDyePacks[i].getSpeed() <= 0) {
                    this.mDyePacks.splice(i, 1); 
                    this.mCameraTargets.splice(i, 1);
                }                
            }
        }
        
        if (this.mPatrols.length > 0) {
            for (let i = 0; i < this.mPatrols.length; i++) {
                this.mPatrols[i].update();

                if ((this.mPatrols[i].getBoundBox().maxX() > 100  && this.mPatrols[i].getmX() > 0) || 
                (this.mPatrols[i].getBoundBox().minX() < -100 && this.mPatrols[i].getmX() < 0) || 
                (this.mPatrols[i].getBoundBox().maxY() > 75 && this.mPatrols[i].getmY() > 0) || 
                (this.mPatrols[i].getBoundBox().minY() < -75 && this.mPatrols[i].getmY() < 0)) {
                    this.mPatrols[i].switchDirection();
                }

                if ((this.mPatrols[i].getBoundBox().minX() > 100) || 
                (this.mPatrols[i].getBoundBox().maxX() < -100) || 
                (this.mPatrols[i].getBoundBox().minY() > 75) || 
                (this.mPatrols[i].getBoundBox().maxY() < -75)) {
                    this.mPatrols[i].kill();
                }

                if (this.mPatrols[i].isDead())
                    this.mPatrols.splice(i, 1);
            }
        }
        
        // show line or point
        // if  (engine.input.isKeyClicked(engine.input.keys.P)) {
        //     this.mShowLine = !this.mShowLine;
        //     let line = null;
        //     if (this.mCurrentLine !== null)
        //         line = this.mCurrentLine;
        //     else {
        //         if (this.mLineSet.length > 0)
        //             line = this.mLineSet[this.mLineSet.length-1];
        //     }
        //     if (line !== null)
        //         line.setShowLine(this.mShowLine);
        // }
    
        // if (engine.input.isButtonPressed(engine.input.eMouseButton.eMiddle)) {
        //     let len = this.mLineSet.length;
        //     if (len > 0) {
        //         this.mCurrentLine = this.mLineSet[len - 1];
        //         x = this.mCamera.mouseWCX();
        //         y = this.mCamera.mouseWCY();
        //         echo += "Selected " + len + " ";
        //         echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
        //         this.mCurrentLine.setFirstVertex(x, y);
        //     }
        // }
    
        // if (engine.input.isButtonPressed(engine.input.eMouseButton.eLeft)) {
        //     x = this.mCamera.mouseWCX();
        //     y = this.mCamera.mouseWCY();
        //     echo += "[" + x.toPrecision(2) + " " + y.toPrecision(2) + "]";
    
        //     if (this.mCurrentLine === null) { // start a new one
        //         this.mCurrentLine = new engine.LineRenderable();
        //         this.mCurrentLine.setFirstVertex(x, y);
        //         this.mCurrentLine.setPointSize(5.0);
        //         this.mCurrentLine.setShowLine(this.mShowLine);
        //         this.mLineSet.push(this.mCurrentLine);
        //     } else {
        //         this.mCurrentLine.setSecondVertex(x, y);
        //     }
        // } else {
        //     this.mCurrentLine = null;
        //     this.mP1 = null;
        // }
    
        // msg += echo;
        // msg += " Show:" + (this.mShowLine ? "Ln" : "Pt");
        // this.mMsg.setText(msg);

        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.fireDyePack();
        }

        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            this.dyeCollision();
        }
        if (this.isDyeCollision) {
            this.dyeCollisionFrames++;
            if (this.dyeCollisionFrames == 60) {
                this.isDyeCollision = false;
                this.dyeCollisionFrames = 0;
                this.mHeroCameraTarget = null;
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.I)) {
            this.autoSpawn = !(this.autoSpawn);
            if(this.autoSpawn){
                currTime = performance.now();
                this.nextInterval = currTime + 2000 + (1000 * (Math.random()));
            }
        }

        if(this.autoSpawn){
            currTime = performance.now();
            if(currTime >= this.nextInterval){
                this.mPatrols.push(new Patrol(this.kSpriteSheet, [200 * (Math.random() - 0.5), 150 * (Math.random() - 0.5)]));
                this.nextInterval = currTime + 2000 + (1000 * (Math.random()));
            }
        }

        this.mMsg.setText("Status: Dyepacks(" + this.mDyePacks.length + ") Patrols(" + this.mPatrols.length + ") Autospawn(" + this.autoSpawn + ")");


        this.updateCameras();
        this.checkForCollisions();
    }




    fireDyePack() {
        let dyePack = new DyePack(this.kSpriteSheet, this.mHero.getXform().getPosition()); 
        this.mDyePacks.push(dyePack);
    }

    dyeCollision() {
        console.log("dye collision");
        console.log(this.mTopCameras + ", " + this.mTopCameras.length);
        this.mHero.CollisionEvent();
        this.mHeroCameraTarget = this.mHero;
        this.isDyeCollision = true;
    }

    addCameraToDraw(aCamera, target) {
        this.mTopCameras.push([aCamera, target]);
    }

    checkForCollisions() {
        for (let i = 0; i < this.mPatrols.length; i++) {
            let dyeCollision = false;
            dyeCollision = this.mPatrols[i].checkCollisionWithDye(this.mHero);
            if (dyeCollision) {
                if (!this.mHero.getCollisionStatus()) {
                    this.dyeCollision();
                } 
            }
            for (let k = 0; k < this.mDyePacks.length; k++) {
                let isCollision = false;
                if(!this.mDyePacks[k].getCollisionStatus()){
                    isCollision = this.mPatrols[i].checkCollisionWithPack(this.mDyePacks[k]);
                    if (isCollision) {
                        this.mCameraTargets.push(this.mDyePacks[k]);
                        this.mDyePacks[k].collisionEvent();
                    }
                    let boxCollision = false;
                    boxCollision = this.mPatrols[i].checkBoundBoxCollision(this.mDyePacks[k]);
                    if(boxCollision){
                        this.mDyePacks[k].setSpeed(this.mDyePacks[k].getSpeed() - 0.1); 
                    
                    }
                }
            }
        }
    }

    updateCameras() {
        if (this.mHeroCameraTarget != null) {
            this.mHeroCamera.setWCCenter(
                this.mHero.getXform().getPosition()[0],
                this.mHero.getXform().getPosition()[1]
            );
            this.mHeroCamera.update();
        }
        if (this.mCameraTargets.length > 0) {
            for (let i = 0; i < this.mCameraTargets.length; i++) {
                if (i > 2) {
                    break;
                }
                let target = this.mCameraTargets[i];
                let cam = this.mTopCameras[i];
                console.log(i);
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