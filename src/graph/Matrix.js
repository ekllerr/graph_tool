export class Matrix{

    constructor(arr){
        if(!arr || arr.length === 0) throw new Error("No data provided");
        this.data = arr;
    }

    length(){
        return this.data.length;
    }
}