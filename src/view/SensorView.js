import {CONFIG} from '../config'

const {CAR_HEIGHT} = CONFIG;

export class SensorView {
    constructor(sensor, p5) {
        this.sensor = sensor;
        this.p5 = p5;
    }

    draw() {
        this.drawDistanceZone();
        this.drawSafetyZone();
    }

    drawDistanceZone = () => {
        const {xStart, xEnd, yStart, yEnd} = this.sensor.getDistanceZone();
        const x = xStart;
        const y = yEnd + CAR_HEIGHT;
        const width = xEnd - xStart;
        const height = yStart - yEnd;
        this.p5.noStroke();
        this.p5.fill(58, 201, 22, this.sensor.isDistanceZoneActive() ? 100 : 200);
        this.p5.rect(x, y, width, height);
    }

    drawSafetyZone = () => { 
        const {xStart, xEnd, yStart, yEnd} = this.sensor.getSafetyZone();
        const x = xStart;
        const y = yEnd;
        const width = xEnd - xStart;
        const height = yStart - yEnd + CAR_HEIGHT;
        this.p5.noStroke();
        this.p5.fill(240, 17, 5, this.sensor.safetyZoneActive ? 200 : 100);
        this.p5.rect(x, y, width, height);
    }
}