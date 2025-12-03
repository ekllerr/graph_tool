import {graph, nodeRadius, canvas, ctx, loadGraphInput} from "../../app.js";

export function findClickedNode(x, y) {
    for (let i = 0; i < graph.nodes.length; i++) {
        let dx = x - graph.nodes[i].x;
        let dy = y - graph.nodes[i].y;

        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nodeRadius) {
            return graph.nodes[i];
        }
    }

    return null;
}

export function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function isCursorOnEdge(edge,cursor,threshold=4){
    if(edge.fromNode === edge.toNode) return isCursorOnLoop(edge,cursor,threshold);

    const edgeLength = Math.sqrt((edge.toNode.y-edge.fromNode.y)**2 + (edge.toNode.x-edge.fromNode.x)**2);

    if(edgeLength === 0) return;

    if(edge.offset === 0) return isCursorOnStraightEdge(edge.fromNode, edge.toNode, cursor, edgeLength, threshold);

    return isCursorOnCurve(edge,cursor,threshold);
}

function isCursorOnLoop(edge,cursor,threshold){
    const loopRadius = edge.offset === 0 ? nodeRadius * 1.5 : nodeRadius + Math.abs(edge.offset / 2);
    const direction = edge.offset >= 0 ? 1 : -1;
    const [x, y] = [edge.fromNode.x + loopRadius * direction, edge.fromNode.y];

    // Compute distance from click to loop center
    const dist = Math.sqrt((cursor.x - x) ** 2 + (cursor.y - y) ** 2);

    // Check if the click is near the loop's radius
    if (Math.abs(dist - loopRadius) > threshold) return false;

    // Compute click angle
    let thetaClick = Math.atan2(cursor.y - y, cursor.x - x);
    if (thetaClick < 0) thetaClick += 2 * Math.PI; // Normalize to [0, 2π]

    const theta = Math.asin(nodeRadius / loopRadius);
    const startAnglePos1 = 0, endAnglePos1 = Math.PI - theta;
    const startAnglePos2 = Math.PI + theta, endAnglePos2 = Math.PI * 2;
    const startAngleNeg = theta, endAngleNeg = Math.PI * 2 - theta;

    // Check if the angle is within the loop's drawn segments
    if (edge.offset >= 0) {
        console.log( (startAnglePos1 <= thetaClick && thetaClick <= endAnglePos1) ||
            (startAnglePos2 <= thetaClick && thetaClick <= endAnglePos2));
        return (startAnglePos1 <= thetaClick && thetaClick <= endAnglePos1) ||
            (startAnglePos2 <= thetaClick && thetaClick <= endAnglePos2);
    } else {
        console.log(startAngleNeg <= thetaClick && thetaClick <= endAngleNeg    )
        return startAngleNeg <= thetaClick && thetaClick <= endAngleNeg;
    }
}

function isCursorOnStraightEdge(a,b,c,edgeLength,threshold){
    const distance = Math.abs((b.y-a.y)*c.x - (b.x-a.x)*c.y + b.x*a.y - b.y*a.x)/edgeLength;
    const dotProduct1 = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
    const dotProduct2 = (c.x - b.x) * (a.x - b.x) + (c.y - b.y) * (a.y - b.y);

    return distance < threshold && dotProduct1>=0 && dotProduct2;
}

function isCursorOnCurve(edge,cursor,threshold){
    const q = edge.calculateControlPoint(edge.fromNode,edge.toNode, edge.offset);

    const start = edge.fromNode;
    const end = edge.toNode;

    let minDist = Infinity;

    for (let t = 0; t <= 1; t += 0.01) {
        let xt = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * q.x + t ** 2 * end.x;
        let yt = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * q.y + t ** 2 * end.y;
        let dist = Math.sqrt((cursor.x - xt) ** 2 + (cursor.y - yt) ** 2);
        if (dist < minDist) {
            minDist = dist;
        }
    }

    return minDist < threshold;
}

export function downloadGraphJson(){
    const json = graph.saveToJson();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "graph.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function loadGraphByJson(e){
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const json = e.target.result;
        const graphFromJson = graph.loadFromJson(json);
        if(!graphFromJson) loadGraphInput.value = '';
    };
    reader.readAsText(file);
}