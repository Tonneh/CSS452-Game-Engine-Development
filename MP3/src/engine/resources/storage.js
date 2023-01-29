"use strict"

import * as Map from "../core/resource_map.js"

function setSmallCamera(smallCamera) {
    Map.loadRequested("smallCamera", smallCamera);
    Map.set("smallCamera", smallCamera);
    Map.incRef("smallCamera");
}
function getSmallCamera() {
    return Map.get("smallCamera");
}
function hasSmallCamera() {
    return Map.has("smallCamera");
}

function unload() {
    Map.unload("smallCamera");
}

export {
    setSmallCamera,
    getSmallCamera,
    hasSmallCamera,
    unload
}