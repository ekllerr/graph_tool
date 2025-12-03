import {ctx, nodeRadius, identifierInput} from "../../app.js";

export class Node {
    constructor(x, y, number, label) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.label = label;
    }

    draw(color) {
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';
        ctx.arc(this.x, this.y, nodeRadius, 0, Math.PI * 2);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        if (identifierInput.checked) {
            ctx.fillText(this.number, this.x, this.y);
        } else {
            ctx.fillText(this.label, this.x, this.y);
        }

        if(color){
            ctx.fillStyle = color;
            ctx.fill();
        }

        ctx.stroke();
    }


}