
import {graph, canvas, identifierInput, saveGraphButton, loadGraphInput, clearGraphButton, toggleEdgeDirectionInput} from "../../app.js";
import {findClickedNode, isCursorOnEdge, downloadGraphJson, loadGraphByJson} from "./helpers.js";



export function setUpEventListeners(){
    setUpCanvasListeners();
    setUpInputsListeners();

}

function setUpCanvasListeners(){
    canvas.addEventListener("click", e => handleCanvasClick(e));

    canvas.addEventListener("contextmenu", e => handleRightClick(e));

    canvas.addEventListener("mousedown", e => handleMouseDown(e));

    canvas.addEventListener("mousemove", e => handleMouseMove(e));

    canvas.addEventListener("mouseup", handleMouseUp);
}

function setUpInputsListeners(){
    identifierInput.addEventListener("input", () => {
        graph.redrawGraph();
    });

    saveGraphButton.addEventListener("click", ()=>{
        downloadGraphJson();
    });

    loadGraphInput.addEventListener("change", (e)=>{
        loadGraphByJson(e);
    });

    clearGraphButton.addEventListener("click", () => {
        graph.clearGraph();
        graph.redrawGraph();
        loadGraphInput.value = "";
    });

    toggleEdgeDirectionInput.addEventListener("input", () => {
        if(toggleEdgeDirectionInput.checked){
            for(const edge of graph.edges){
                if(edge.isDirected === 'false') edge.isDirected = 'directed';
            }
        }
        else{
            for(const edge of graph.edges){
                edge.isDirected = 'false';
            }
        }
        graph.redrawGraph();
    });


}

function handleCanvasClick(e){
    let [x,y] = getClientCoordinates(e);
    let clickedNode = null;

    for(let edge of graph.edges){
        if(findClickedNode(x,y)) continue;
        if(isCursorOnEdge(edge,{x,y})){
            if(edge.isDirected === 'false'){
                edge.isDirected = 'directed';
                graph.redrawGraph();
                return;
            }
            if(edge.isDirected === 'directed'){
                edge.isDirected = 'reverse';
                [edge.fromNode, edge.toNode] = [edge.toNode, edge.fromNode];
                edge.offset *= -1;
                graph.redrawGraph();
                return;
            }
            if(edge.isDirected === 'reverse'){
                edge.isDirected = 'false';
                graph.redrawGraph();
                return;
            }
            return;
        }
    }

    if(graph.justDragged){
        graph.justDragged = false;
        return;
    }

    if(graph.nodes.length > 0){
        clickedNode = findClickedNode(x,y);
    }

    if(graph.tempEdge && !clickedNode){
        graph.clearSelectedNode();
        graph.clearTempEdge();
        graph.redrawGraph();
        return;
    }

    if(clickedNode){
        handleNodeClick(clickedNode);
    }else{
        graph.addNode(x,y);
        graph.clearSelectedNode();
    }
}

function handleRightClick(e){
    e.preventDefault();

    let [x, y] = getClientCoordinates(e);

    let clickedNode = findClickedNode(x,y);

    if(clickedNode){
        graph.removeNode(clickedNode);
        graph.redrawGraph();
    }

    for(let edge of graph.edges){
        if(isCursorOnEdge(edge,{x,y})){
            graph.removeEdge(edge);
            graph.redrawGraph();
            return;
        }
    }
}

function handleMouseDown(e){
    let [x, y] = getClientCoordinates(e);
    let clickedNode = null;
    if(graph.nodes.length > 0){
        clickedNode = findClickedNode(x,y);
    }

    if(clickedNode){
        graph.draggingNode = clickedNode;
    }
}

function handleMouseMove(e){
    let [x,y] = getClientCoordinates(e);
    if(graph.selectedNode){
        graph.tempEdge = {x:x,y:y};
        requestAnimationFrame(graph.redrawGraph.bind(graph));
    }

    if(graph.draggingNode){
        graph.clearSelectedNode();
        graph.justDragged = true;
        graph.draggingNode.x = x;
        graph.draggingNode.y = y;
        requestAnimationFrame(graph.redrawGraph.bind(graph));
    }
}

function handleMouseUp(){
    if(graph.draggingNode){
        graph.clearDraggingNode();
        graph.redrawGraph();
    }
}

function getClientCoordinates(e){
    const canvasRect = canvas.getBoundingClientRect();
    return [e.clientX - canvasRect.x, e.clientY - canvasRect.y];
}

function handleNodeClick(clickedNode){
    if(!graph.selectedNode){
        graph.selectedNode = clickedNode;
        graph.redrawGraph();
    } /*else if(graph.selectedNode !== clickedNode){
        graph.addEdge(graph.selectedNode,clickedNode);
        graph.clearTempEdge();
        graph.redrawGraph();
    } else{
        graph.clearSelectedNode();
        graph.clearTempEdge();
        graph.redrawGraph();
    }*/
    else{
        graph.addEdge(graph.selectedNode, clickedNode);
        graph.clearTempEdge();
        graph.redrawGraph();
    }
}