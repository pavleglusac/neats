import { SensorView } from "./SensorView";
import {CONFIG} from '../config'

const {CAR_HEIGHT} = CONFIG;

export class FrontSensorView extends SensorView {
    drawSafetyZone = () => { 
        const {xStart, xEnd, yStart, yEnd} = this.sensor.getSafetyZone();
        const x = xStart;
        const y = yEnd + CAR_HEIGHT;
        const width = xEnd - xStart;
        const height = yStart - yEnd;
        this.p5.noStroke();
        this.p5.fill(240, 17, 5, this.sensor.safetyZoneActive ? 200 : 100);
        this.p5.rect(x, y, width, height);
    }
}