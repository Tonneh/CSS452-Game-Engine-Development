"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Patrol extends engine.GameObject {
    constructor(spriteTexture, position) {
        super(null);

        this.mXPos = null;
        this.mYPos = null;

        this.deltaX = null;
        this.deltaY = null;

        this.desiredX = Math.floor(Math.random() * (45 - -45) + -45);
        this.desiredY = Math.floor(Math.random() * (32.5 - -32.5) + -32.5);

        let diffX = this.desiredX;
        let diffY = this.desiredY;
        this.deltaX = diffX / 100.0;
        this.deltaY = diffY / 100.0;


        this.isAlive = true;
        this.pushBack = false;
        this.showBounds = true;
        this.finalXPos = null;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);  // tints red
        this.mRenderComponent.getXform().setPosition(position[0], position[1]);
        this.mRenderComponent.getXform().setSize(7.5, 7.5);
        this.mRenderComponent.setElementPixelPositions(130, 310, 0, 180);

        this.mBottomMinion = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mBottomMinion.setColor([1, 1, 1, 0]);
        this.mBottomMinion.getXform().setPosition(position[0], position[1]);
        this.mBottomMinion.getXform().setSize(10, 8);
        this.mBottomMinion.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
             204, 164,       // width x height in pixels
             5,              // number of elements in this sequence
             0);             // horizontal padding in between
        this.mBottomMinion.setAnimationType(engine.eAnimationType.eSwing);
        this.mBottomMinion.setAnimationSpeed(20);

        this.mTopMinion = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mTopMinion.setColor([1, 1, 1, 0]);
        this.mTopMinion.getXform().setPosition(position[0], position[1]);
        this.mTopMinion.getXform().setSize(10, 8);
        this.mTopMinion.setSpriteSequence(348, 0,      // first element pixel position: top-left 164 from 512 is top of image, 0 is left of image
             204, 164,       // width x height in pixels
             5,              // number of elements in this sequence
             0);             // horizontal padding in between
        this.mTopMinion.setAnimationType(engine.eAnimationType.eSwing);
        this.mTopMinion.setAnimationSpeed(20);

        this.mTopWing = new engine.GameObject(this.mTopMinion);
        this.mBottomWing = new engine.GameObject(this.mBottomMinion);
        
        this.lerpXBot = new engine.Lerp(this.getXform().getXPos(), 120, 0.05);
        this.lerpYBot = new engine.Lerp(this.getXform().getYPos(), 120, 0.05); 
 
        this.lerpXTop = new engine.Lerp(this.getXform().getXPos(), 120, 0.05);
        this.lerpYTop = new engine.Lerp(this.getXform().getYPos(), 120, 0.05); 

        this.mainBB = new engine.BoundingBox(
            [this.getXform().getXPos() + 5, this.getXform().getYPos() + this.mBottomMinion.getXform().getHeight()], 
            (this.mRenderComponent.getXform().getWidth() + this.mTopMinion.getXform().getWidth() + 3),
            ((this.mRenderComponent.getXform().getHeight() + this.mTopMinion.getXform().getHeight() + this.mBottomMinion.getXform().getHeight()) * 1.5) 
        );
        
        this.brainBB = new engine.BoundingBox(
            [this.mRenderComponent.getXform().getXPos(), this.mRenderComponent.getXform().getYPos()], 
            this.mRenderComponent.getXform().getWidth(), 
            this.mRenderComponent.getXform().getHeight()); 
        
        this.topMinionBB = new engine.BoundingBox(
            [this.mTopMinion.getXform().getXPos(), this.mTopMinion.getXform().getYPos()], 
            this.mTopMinion.getXform().getWidth(),
            this.mTopMinion.getXform().getHeight()
        );

        this.bottomMinionBB = new engine.BoundingBox(
            [this.mBottomMinion.getXform().getXPos(), this.mBottomMinion.getXform().getYPos()], 
            this.mBottomMinion.getXform().getWidth(),
            this.mBottomMinion.getXform().getHeight()
        );

        this.lines = [];
        this.createLines(this.brainBB); 
        this.createLines(this.topMinionBB); 
        this.createLines(this.bottomMinionBB); 
        this.createLines(this.mainBB);
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].setShowLine(true);
        }


        this.mX = 0.3 * (Math.random() - 0.3);
        this.mY = 0.3 * (Math.random() - 0.3);

    }

    update() {
        // control by mouse pos
        let xform = this.getXform();

        // collision event
        if(this.pushBack){
            if(this.mRenderComponent.getXform().getXPos() < this.finalXPos){
                this.mRenderComponent.getXform().setXPos(this.mRenderComponent.getXform().getXPos() + 1);
                this.mRenderComponent.setColor([1, 0, 0, 1]);
            }else{
                this.pushBack = false;
            }
        } else {
            this.mRenderComponent.setColor([1, 0, 0, 0]);
        }

        if (xform.getXPos() == this.desiredX && xform.getYPos() == this.desiredY) {
        }

        // lerp logic to lerp the wings towards the head
        this.lerpXBot.setFinal(xform.getXPos() + 10);
        this.lerpYBot.setFinal(xform.getYPos() - 6);

        this.lerpXTop.setFinal(xform.getXPos() + 10);
        this.lerpYTop.setFinal(xform.getYPos() + 6);

        this.lerpXBot.update();
        this.lerpYBot.update();

        this.lerpXTop.update();
        this.lerpYTop.update();
        
        this.mTopWing.getRenderable().getXform().setPosition(this.lerpXBot.get(), this.lerpYTop.get());
        this.mBottomWing.getRenderable().getXform().setPosition(this.lerpXBot.get(), this.lerpYBot.get());
        // end lerp logic

        
        // logic to update the bounding box and lines for the head
        this.brainBB.setBounds(
            [this.mRenderComponent.getXform().getXPos(), this.mRenderComponent.getXform().getYPos()], 
            this.mRenderComponent.getXform().getWidth(),
            this.mRenderComponent.getXform().getHeight()
        );
        this.editLines([0, 1, 2, 3], this.brainBB);

        // logic to update the bounding box and lines for the top wing
        this.topMinionBB.setBounds(
            [this.mTopMinion.getXform().getXPos(), this.mTopMinion.getXform().getYPos()], 
            this.mTopMinion.getXform().getWidth(),
            this.mTopMinion.getXform().getHeight()
        );
        this.editLines([4, 5, 6, 7], this.topMinionBB);

        // logic to update the bounding box and lines for the bottom wing
        this.bottomMinionBB.setBounds(
            [this.mBottomMinion.getXform().getXPos(), this.mBottomMinion.getXform().getYPos()], 
            this.mBottomMinion.getXform().getWidth(),
            this.mBottomMinion.getXform().getHeight()
        );
        this.editLines([8, 9, 10, 11], this.bottomMinionBB); 

         // logic to update the bounding box and lines for the whole patrol
        this.mainBB.setBounds( 
            [((this.bottomMinionBB.maxX() - this.brainBB.minX()) / 2) + this.brainBB.minX(), this.bottomMinionBB.minY() + (this.mainBB.mHeight / 2)], 
            this.bottomMinionBB.maxX() - this.brainBB.minX(), 
            (this.topMinionBB.maxY() - this.bottomMinionBB.minY()) * 1.5
        );
        this.editLines([12, 13, 14, 15], this.mainBB);
        
        // animation logic
        this.mBottomMinion.updateAnimation();
        this.mTopMinion.updateAnimation();

        this.mTopWing.getRenderable().updateAnimation();
        this.mBottomWing.getRenderable().updateAnimation();
        // end animation logic


        // movemeent logic
        this.mRenderComponent.getXform().incXPosBy(this.mX);
        this.mRenderComponent.getXform().incYPosBy(this.mY);  
        
        this.mTopWing.getXform().incXPosBy(this.mX);
        this.mTopWing.getXform().incYPosBy(this.mY);  

        this.mBottomWing.getXform().incXPosBy(this.mX);
        this.mBottomWing.getXform().incYPosBy(this.mY);
        // end movement logic
    }

    // function to check collision with dye pack
    // returns true if collision
    checkCollisionWithPack(other) {
        let arr = [];
        let alpha;
        // collision check for head
        if (super.pixelTouches(other, arr)) {
            this.pushBack = true;
            this.finalXPos = this.mRenderComponent.getXform().getXPos() + 5;
            return true;
        }

        // collision check for top wing
        if (this.mTopWing.pixelTouches(other, arr)) {
            alpha = this.mTopMinion.getColor()[3] + 0.2;
            this.mTopMinion.setColor([1, 1, 1, alpha]);
            if(alpha >= 1.0){
                this.isAlive = false;
            }
            return true;
        }

        // collision check for bottom wing
        if (this.mBottomWing.pixelTouches(other, arr)) {
            alpha = this.mBottomMinion.getColor()[3] + 0.2;
            this.mBottomMinion.setColor([1, 1, 1, alpha]);
            if(alpha >= 1.0){
                this.isAlive = false;
            }
            return true;
        }


        return false;
    }

    // functino to check collision with dye
    // returns true if collision
    checkCollisionWithDye(dye) {
        let arr = [];
        if (super.pixelTouches(dye, arr)) {
            return true;
        }
        return false;
    }

    // function to check collision with another bounding box
    // returns true if collision
    checkBoundBoxCollision(obj){
        let otherBbox = obj.getBBox();
        if (this.mainBB.boundCollideStatus(otherBbox) > 0) {
            return true;
        }
        return false; 
    }


    isDead() {
        return !this.isAlive;
    }

    draw(aCamera){
        // draw head
        super.draw(aCamera);
        // draw wings
        this.mTopWing.draw(aCamera);
        this.mBottomWing.draw(aCamera);

        // draw lines
        if(this.showBounds){
            for (let i = 0; i < this.lines.length; i++) {
                this.lines[i].draw(aCamera);
            }
        }
    }

    // functin to create lines based on bounding box
    createLines(bb)
    {
        let line;
        line = new engine.LineRenderable(
            bb.maxX(), 
            bb.maxY(),
            bb.maxX(), 
            bb.minY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines.push(line); 
        line = new engine.LineRenderable(
            bb.maxX(), 
            bb.maxY(),
            bb.minX(),
            bb.maxY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines.push(line); 
        line = new engine.LineRenderable(
            bb.minX(), 
            bb.minY(),
            bb.minX(),
            bb.maxY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines.push(line); 
        line = new engine.LineRenderable(
            bb.minX(), 
            bb.minY(),
            bb.maxX(),
            bb.minY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines.push(line); 
    }

    // function to edit lines for bounding box
    editLines(lineNum, bb) 
    {
        let line;
        line = new engine.LineRenderable(
            bb.maxX(), 
            bb.maxY(),
            bb.maxX(), 
            bb.minY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines[lineNum[0]] = line;
        line = new engine.LineRenderable(
            bb.maxX(), 
            bb.maxY(),
            bb.minX(),
            bb.maxY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines[lineNum[1]] = line;
        line = new engine.LineRenderable(
            bb.minX(), 
            bb.minY(),
            bb.minX(),
            bb.maxY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines[lineNum[2]] = line;
        line = new engine.LineRenderable(
            bb.minX(), 
            bb.minY(),
            bb.maxX(),
            bb.minY()
        );
        line.setColor([1, 1, 1, 1]); 
        this.lines[lineNum[3]] = line;
    }

    getmX(){ return this.mX }
    getmY(){ return this.mY }

    switchDirection(){ 
        this.mX *= -1;
        this.mY *= -1;
    }

    kill(){
        this.isAlive = false;
    }


    getBoundBox(){
        return this.mainBB;
    }

    getTopWing(){
        return this.mTopWing;
    }

    getBottomWing(){
        return this.mBottomWing;
    }

    // function to show/hide lines
    toggleBounds(){
        this.showBounds = !this.showBounds;
    }

    //funciton for hit event 
    hitHead(){
        this.pushBack = true;
        this.finalXPos = this.mRenderComponent.getXform().getXPos() + 5;
    }


}

export default Patrol;