export class DataCollector {
    static dataPool = [];
    static numData = 0;

    static createSnapshot = (agentsSnapshot, direction) => {
        const snapshot = [
            ...agentsSnapshot,
            direction + "\n"
        ];
        this.collectData(snapshot);
    }

    static collectData = (data) => {
        this.dataPool.push(data);
    }

    static saveData(fileName) {
        var file = new Blob(this.dataPool, {type: "text/plain"});
        this.saveBlob(file, fileName);
        this.dataPool = [];
        this.numData++;
    }
    
    static saveBlob = (blob, fileName) => {
        var link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", fileName + this.numData + ".csv");
        document.body.appendChild(link);
        link.click();
    }
}