"use strict";

import * as shaderResources from "../core/shader_resources.js";
import * as texture from "../resources/texture.js";
import * as glSys from "../core/gl.js";
import Renderable from "./renderable.js";

const eTexEffectFlag = Object.freeze({
    eNone: 0,
    eTransparent: 1,
    eOverride: 2,
    eBlend: 3,
});

class MultiTextureRenderable extends Renderable {
    // myTexture: covers the entire Renderable
    // secTex, thirdTex: effect textures
    constructor(myTexture, secTex = null, thirdTex = null) {
        super();
        super.setColor([1, 1, 1, 0]);
        super._setShader(shaderResources.getMultiTextureShader());
        this.mTexture = myTexture;
        this.mSecondTexture = secTex;
        this.mSecondTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0];  // u, v, w, h, theta
        this.mThirdTexture = thirdTex;
        this.mThirdTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0];  // u, v, w, h, theta
    }

    setSecondTexture(u, v, w, h, t) {
        this.mSecondTexturePlacement[0] = u;
        this.mSecondTexturePlacement[1] = v;
        this.mSecondTexturePlacement[2] = w;
        this.mSecondTexturePlacement[3] = h;
        this.mSecondTexturePlacement[4] = t;
    }

    setThirdTexture(u, v, w, h, t) {
        this.mThirdTexturePlacement[0] = u;
        this.mThirdTexturePlacement[1] = v;
        this.mThirdTexturePlacement[2] = w;
        this.mThirdTexturePlacement[3] = h;
        this.mThirdTexturePlacement[4] = t;
    }

    // index: 0 is not used
    //        1, 2: the effect textures
    // mode: eTexEffectFlag.eNone, eTransparent, eOverride, or eBlend
    setTexEffectMode(index, mode) {
        switch (mode) {
            case eTexEffectFlag.eNone:
                (index === 1 ? this.mShader.enableSecondTexture(false) : this.mShader.enableThirdTexture(false));
                break;
            case eTexEffectFlag.eTransparent:
                break;
            case eTexEffectFlag.eOverride:
                break;
        }
    }

    // index: 0 not used
    //        1, 2: the effect textures
    // parm: a float array of 5 elements:
    //       0,1: u and v positions of tex in UV space
    //       2,3: w and h of tex in UV space
    //       4: rotation of tex in radian
    setTexAtSize(index, parm) {
        let u = parm[0];
        let v = parm[1];
        let w = parm[2];
        let h = parm[3];
        let t = parm[4];
        (index === 1 ? this.setSecondTexture(u, v, w, h, t) : this.setThirdTexture(u, v, w, h, t));
    }

    // index: 0 not used
    //        1, 2: the effect textures
    // f: blendWeight
    setBlendFactor(index, f) {
    }

    // index: 0 not used
    //        1, 2: the effect textures
    // parm: a float array of 5 elements:
    //       0,1: u and v positions of tex in UV space
    //       2,3: w and h of tex in UV space
    //       4: rotation of tex in radian
    getTexAtSize(index, parm) {
    }

    // index: 0 not used
    //        1, 2: the effect textures
    getBlendFactor(i) {
        return this.mBlendFactor[i];
    }

    // index: 0 not used
    //        1, 2: the effect textures
    getTexMode(i) {
        return this.mEffectMode[i];
    }

    draw(aCamera) {
        let en = false;  // for second texture;
        // activate the texture
        texture.activate(this.mTexture, glSys.get().TEXTURE0);
        if (this.mSecondTexture != null) {
            texture.activate(this.mSecondTexture, glSys.get().TEXTURE1);
            this.mShader.placeAtWithSize(1, this.mSecondTexturePlacement,
                this.getXform().getWidth() / this.getXform().getHeight());
            en = true;
        }
        this.mShader.enableSecondTexture(en);
        en = false;
        if (this.mThirdTexture != null) {
            texture.activate(this.mThirdTexture, glSys.get().TEXTURE2);
            this.mShader.placeAtWithSize(2, this.mThirdTexturePlacement,
                this.getXform().getWidth() / this.getXform().getHeight());
            en = true;
        }
        this.mShader.enableThirdTexture(en);
        super.draw(aCamera);
    }
}

export {eTexEffectFlag}
export default MultiTextureRenderable;