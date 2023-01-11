/*
 * File: core.js 
 */
"use strict";

// import all symbols that are exported from vertex_buffer.js, as symbols under the module "vertexBuffer"
//
import * as vertexBuffer from "./vertex_buffer.js";
import SimpleShader from "./simple_shader.js";

// variables
//
// The graphical context to draw to
let mGL = null;
function getGL() { return mGL; }

// The shader
let mShader = null;
function createShader() {
    mShader = new SimpleShader(
        "src/glsl_shaders/simple_vs.glsl",        // Path to the VertexShader
        "src/glsl_shaders/simple_fs.glsl");       // Path to the FragmentShader
}

// initialize the WebGL
function initWebGL(htmlCanvasID) {
    let canvas = document.getElementById(htmlCanvasID);

    // Get the standard or experimental webgl and binds to the Canvas area
    // store the results to the instance variable mGL
    mGL = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2");

    if (mGL === null) {
        document.write("<br><b>WebGL 2 is not supported!</b>");
        return;
    }
}

// initialize the WebGL, and the vertex buffer
function init(htmlCanvasID) {
    initWebGL(htmlCanvasID);    // setup mGL
    createShader();             // create the shader
}

// Clears the draw area and draws one square
function clearCanvas(color) {
    mGL.clearColor(color[0], color[1], color[2], color[3]);  // set the color to be cleared
    mGL.clear(mGL.COLOR_BUFFER_BIT);      // clear to the color previously set
}

// function to draw a square
// two steps to draw: activate the shader, and issue the gl draw command
function drawSquare(color, offset, scale) {
    vertexBuffer.drawSquare();  // setup mGLVertexBuffer
    // Step A: Activate the shader
    mShader.activate(color, offset, scale);
    // Step B: Draw with the currently activated geometry and the activated shader
    mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 4);
}

/* Drawing Triangle with 3 vertices */
function drawTriangle(color, offset, scale) {
    vertexBuffer.drawTriangle();
    mShader.activate(color, offset, scale);
    mGL.drawArrays(mGL.TRIANGLE_STRIP, 0, 3);
}

/* Drawing Circle with 100 vertices */
function drawCircle(color, offset, scale) {
    vertexBuffer.drawCircle();
    mShader.activate(color, offset, scale);
    mGL.drawArrays(mGL.TRIANGLE_FAN, 0, 100);
}

/* Drawing Hexagon with 6 vertices */
function drawHexagon(color, offset, scale) {
    vertexBuffer.drawHexagon();
    mShader.activate(color, offset, scale);
    mGL.drawArrays(mGL.TRIANGLE_FAN, 0, 6);
}
// export these symbols
export { getGL, init, clearCanvas, drawSquare, drawTriangle, drawCircle, drawHexagon}