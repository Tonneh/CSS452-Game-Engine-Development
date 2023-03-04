"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {

    constructor(spriteTexture, position) {
        super(null);

        this.oscilate = new engine.Oscillate(4, 20, 300);
        this.oscilateCounter = 0;
        this.isOscilating = false;
        this.oscilatePos = null;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture); 
        this.mRenderComponent.setColor([1, 1, 1, 0]); 
        this.mRenderComponent.getXform().setSize(2, 3.25); 
        this.mRenderComponent.getXform().setPosition(position[0], position[1]); 
        this.mRenderComponent.getXform().setRotationInDegree(90); 
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153)

        this.aliveTime = 0; 
        this.speed = 2; 
    }

    update() { 
        let xform = this.getXform(); 
        xform.incXPosBy(this.speed);
        this.incAliveTime(); 

        if (this.isOscilating) {
            let val = this.oscilate.getNext();
            xform.setPosition(
                this.oscilatePos[0] + val,
                this.oscilatePos[1]
            );
            this.oscilateCounter++;
            if (this.oscilateCounter == 300) {
                this.isOscilating = false;
                xform.setPosition(
                    this.oscilatePos[0],
                    this.oscilatePos[1]
                );
                this.oscilate.reStart();
                this.oscilateCounter = 0;
            }
        }
    }

    incAliveTime() {
        this.aliveTime++; 
    } 

    getAliveTime() {
        return this.aliveTime; 
    }

    setSpeed(speed) {
        this.speed = speed; 
    }

    decSpeed() {
        this.speed -= 0.1; 
    }

    getSpeed() {
        return this.speed;
    }

    getCollisionStatus() {
        return this.isOscilating;
    }

    collisionEvent() {
        if (!this.isOscilating) {
            this.oscilatePos = [
                this.getXform().getXPos(),
                this.getXform().getYPos()
            ];
            this.isOscilating = true;
        }
        // do nothing
    }
}


export default DyePack; 