/*
 * File: json.js
 *
 * logics for loading a json file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";
// functions from resource_map
let unload = map.unload;
let has = map.has;
let get = map.get;

function decodeJson(data) {
    return data.text();
}

function parseJson(text) {
    return JSON.parse(text);
}

function load(path) {
    return map.loadDecodeParse(path, decodeJson, parseJson);
}

export {has, get, load, unload}