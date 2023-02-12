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
    constructor(textureArr) {
        super();
        super.setColor([1, 1, 1, 0]);
        super._setShader(shaderResources.getMultiTextureShader());
        this.mTexturesArr = [];
        this.mTexturesPlacementMatrix = [];
        this.mTexturesBlendModeArr = [];

        this.mTexturesArr = textureArr;
        this.disableArr = [];
    }

    setTexture(index, u, v, w, h, t) {
        this.mTexturesPlacementMatrix[index] = [u, v, w, h, t];
    }

    // index: 0 is not used
    //        1, 2: the effect textures
    // mode: eTexEffectFlag.eNone, eTransparent, eOverride, or eBlend
    setTexEffectMode(index, mode) {
        switch (mode) {
            case eTexEffectFlag.eNone:
                this.disableArr[index] = true;
                break;
            case eTexEffectFlag.eTransparent:
                this.disableArr[index] = false;
                this.setBlendFactor(index, 1);
                break;
            case eTexEffectFlag.eOverride:
                this.disableArr[index] = false;
                this.setBlendFactor(index, 0.0);
                break;
            case eTexEffectFlag.eBlend:
                this.disableArr[index] = false;
                this.setBlendFactor(index, 0.5);
                break;
        }
    }

    setTexAtSize(index, parm) {
        let u = parm[0];
        let v = parm[1];
        let w = parm[2];
        let h = parm[3];
        let t = parm[4];
        this.setTexture(index, u, v, w, h, t);
    }

    setBlendFactor(index, f) {
        this.mTexturesBlendModeArr[index] = f;
    }

    getBlendFactor(index) {
        return this.mTexturesBlendModeArr[index];
    }

    draw(aCamera) {
        let en = false;  // for second texture;
        // activate the texture
        texture.activate(this.mTexturesArr[0], glSys.get().TEXTURE0);
        if (this.mTexturesArr[1] != null && !this.disableArr[1]) {
            texture.activate(this.mTexturesArr[1], glSys.get().TEXTURE1);
            this.mShader.placeAtWithSize(1, this.mTexturesPlacementMatrix[1],
                this.getXform().getWidth() / this.getXform().getHeight(), this.mTexturesBlendModeArr[1]);
            en = true;
        }
        this.mShader.enableTexture(1, en);
        en = false;
        if (this.mTexturesArr[2] != null && !this.disableArr[2]) {
            texture.activate(this.mTexturesArr[2], glSys.get().TEXTURE2);
            this.mShader.placeAtWithSize(2, this.mTexturesPlacementMatrix[2],
                this.getXform().getWidth() / this.getXform().getHeight(), this.mTexturesBlendModeArr[2]);
            en = true;
        }
        this.mShader.enableTexture(2, en);
        super.draw(aCamera);
    }
}

export {eTexEffectFlag}
export default MultiTextureRenderable;