"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import SimpleShader from "./simple_shader.js";

class MultiTextureShader extends SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        this.mTexMat = mat3.create();
        this.mTexMat2 = mat3.create();

        this.mTexMatArr = [];
        this.mTexMatArr[1] = this.mTexMat;
        this.mTexMatArr[2] = this.mTexMat2;

        this.mTextureCoordinateRefArr = [];
        this.mTextureRefArr = [];
        this.mHasTextureRefArr = [];
        this.mBlendWeightRefArr = [];

        this.mHasTextureArr = [];
        this.mBlendWeightArr = [];

        let gl = glSys.get();

        // get the reference of aTextureCoordinate within the shader
        this.mTextureRefArr[0] = gl.getUniformLocation(this.mCompiledShader, "uSampler");
        this.mTextureCoordinateRefArr[0] = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");
        // supporting second set
        this.mTextureCoordinateRefArr[1] = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate2");
        this.mTextureRefArr[1] = gl.getUniformLocation(this.mCompiledShader, "uSecondTexture");
        this.mHasTextureRefArr[1] = gl.getUniformLocation(this.mCompiledShader, "uHasSecondTexture");
        this.mBlendWeightRefArr[1] = gl.getUniformLocation(this.mCompiledShader, "rBlendWeight");
        // supporting third set
        this.mTextureCoordinateRefArr[2] = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate3");
        this.mTextureRefArr[2] = gl.getUniformLocation(this.mCompiledShader, "uThirdTexture");
        this.mHasTextureRefArr[2] = gl.getUniformLocation(this.mCompiledShader, "uHasThirdTexture");
        this.mBlendWeightRefArr[2] = gl.getUniformLocation(this.mCompiledShader, "rBlendWeight2");

        this.mMyTexXfromMatArr = [];
        this.mMyTexXfromMatArr[1] = gl.getUniformLocation(this.mCompiledShader, "uMyTexXfromMat");
        this.mMyTexXfromMatArr[2] = gl.getUniformLocation(this.mCompiledShader, "uMyTexXfromMat2");

        // second set of tex coordinate
        let initTexCoord = [
            1.0, 1.0,       // right, top
            0.0, 1.0,       // left, top
            1.0, 0.0,       // right, bottom,
            0.0, 0.0        // left, bottom
        ];

        let initTexCoord2 = [
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ];

        this.mTextureCoordArr = [];

        this.mTextureCoordArr[1] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureCoordArr[1]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);

        this.mTextureCoordArr[2] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureCoordArr[2]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord2), gl.DYNAMIC_DRAW);
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = glSys.get();

        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRefArr[0], 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.mTextureCoordinateRefArr[0]);

        for (let i = 1; i < this.mTextureCoordArr.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureCoordArr[i]);
            gl.vertexAttribPointer(this.mTextureCoordinateRefArr[i], 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.mTextureCoordinateRefArr[i]);
            gl.enableVertexAttribArray(this.mBlendWeightRefArr[i]);
        }
        for (let i = 0; i < this.mTextureRefArr.length; i++) {
            gl.uniform1i(this.mTextureRefArr[i], i);
            if (i !== 0) {
                gl.uniformMatrix3fv(this.mMyTexXfromMatArr[i], false, this.mTexMatArr[i]);
                gl.uniform1i(this.mHasTextureRefArr[i], this.mHasTextureArr[i]);
                gl.uniform1f(this.mBlendWeightRefArr[i], this.mBlendWeightArr[i]);
            }
        }
    }

    enableTexture(index, en) {
        this.mHasTextureArr[index] = en;
    }

    placeAtWithSize(index, placement, aspectRatio, blendFactor) {
        // How to use aspectRatio?
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];
        let t = placement[4];
        this.mBlendWeightArr[index] = blendFactor;

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mTextureCoordArr[index]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft, useTop,
            useRight, useBot,
            useLeft, useBot]));

        mat3.identity(this.mTexMatArr[index]);
        mat3.scale(this.mTexMatArr[index], this.mTexMatArr[index], [ 1.0 / w, 1 / h]); // scale such that top-right is (1, 1)
        mat3.translate(this.mTexMatArr[index], this.mTexMatArr[index], vec2.fromValues(-left, -bottom)); // bottom-left is now (0, 0)
        mat3.translate(this.mTexMatArr[index], this.mTexMatArr[index], vec2.fromValues(u, v)); // return to original position
        mat3.rotate(this.mTexMatArr[index], this.mTexMatArr[index], -t);  // rotation wrt to center of u,v
        mat3.translate(this.mTexMatArr[index], this.mTexMatArr[index], vec2.fromValues(-u, -v));

        mat3.translate(this.mTexMatArr[index], this.mTexMatArr[index], vec2.fromValues(left, bottom));
        mat3.scale(this.mTexMatArr[index], this.mTexMatArr[index], [w, h]);
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}
export default MultiTextureShader;