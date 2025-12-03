import {setUpEventListeners} from "./src/utils/domUtils.js";
import {Graph} from "./src/graph/Graph.js";

export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");
export const identifierInput = document.getElementById("nodeIdentifier");

export const saveGraphButton = document.getElementById("saveGraph");
export const loadGraphInput = document.getElementById("loadGraph");
export const clearGraphButton = document.getElementById("clearGraph");

export const toggleEdgeDirectionInput = document.getElementById("toggleEdgeDirection");


const width = 500;
const height = 500;

canvas.width = width;
canvas.height = height;


export const nodeRadius = 10;

export const graph = new Graph();

setUpEventListeners(canvas);

graph.getAdjacencyMatrix