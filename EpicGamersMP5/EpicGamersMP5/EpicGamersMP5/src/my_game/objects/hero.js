"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;

        this.mXPos = null;
        this.mYPos = null;

        this.lerpX = new engine.Lerp(0, 120, 0.05);
        this.lerpY = new engine.Lerp(0, 120, 0.05);

        this.oscilate = new engine.Oscillate(6, 4, 60);
        this.oscilateCounter = 0;
        this.isOscilating = false;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(35, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.defaultSize = [9, 12];
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);
    }

    update(x, y) {
        // control by mouse pos
        let xform = this.getXform();

        // lerp logic (lerp to mouse pos)
        this.lerpX.setFinal(x);
        this.lerpY.setFinal(y);

        this.lerpX.update();
        this.lerpY.update();

        this.mXPos = this.lerpX.get();
        this.mYPos = this.lerpY.get();

        xform.setPosition(this.mXPos, this.mYPos);
        // end lerp logic

        // if colliding
        if (this.isOscilating) {
            let val = this.oscilate.getNext();
            xform.setSize(
                this.defaultSize[0] + val,
                this.defaultSize[1] + val
            );
            this.oscilateCounter++;
            if (this.oscilateCounter == 60) {
                this.isOscilating = false;
                xform.setSize(this.defaultSize[0], this.defaultSize[1]);
                this.oscilate.reStart();
                this.oscilateCounter = 0;
            }
        }
    }

    getCollisionStatus() {
        return this.isOscilating;
    }
    
    CollisionEvent() {
        this.isOscilating = true;
    }
}

export default Hero;