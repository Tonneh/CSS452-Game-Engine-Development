/*
 * File: vertex_buffer.js
 *
 * defines the module that supports the loading and using of the buffer that
 * contains vertex positions of a square onto the gl context
 *
 */
"use strict";

import * as core from "./core.js";

// reference to the vertex positions for the square in the gl context
let mGLVertexBuffer = null;

function get() { return mGLVertexBuffer; }

// First: define the vertices for a square
let mVerticesOfSquare = [
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0
];

// ref: https://gyazo.com/ffbeca468fa61e6d1b403649e3aaad90
let mVerticesOfTriangle = [
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
];

// Number of vertices for circle
let mCircleNumVertex = 100;

let mVerticesOfCircle = [];
function createCirclesArray() {
    var delta = (2.0 * Math.PI) / (mCircleNumVertex - 1);
    for (let i = 1; i <= mCircleNumVertex; i++) {
        var angle = (i-1) * delta;
        mVerticesOfCircle.push(0.5 * Math.cos(angle));
        mVerticesOfCircle.push(0.5 * Math.sin(angle));
        mVerticesOfCircle.push(0);
    }
}

function drawTriangle() {
    let gl = core.getGL();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfTriangle), gl.STATIC_DRAW);
}

function drawSquare() {
    let gl = core.getGL();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfSquare), gl.STATIC_DRAW);
}

function drawCircle() {
    let gl = core.getGL();

    createCirclesArray();

    // Step A: Create a buffer on the gl context for our vertex positions
    mGLVertexBuffer = gl.createBuffer();

    // Step B: Activate vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, mGLVertexBuffer);

    // Step C: Loads mVerticesOfSquare into the vertexBuffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mVerticesOfCircle), gl.STATIC_DRAW);
}

// export these symbols
export {drawTriangle, get, drawSquare, drawCircle}