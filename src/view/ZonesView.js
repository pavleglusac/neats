import { SensorView } from './SensorView';
import { FrontSensorView } from './FrontSensorView';

export class ZonesView {
    constructor(p5, agent) {
        this.p5 = p5;
        this.agent = agent;
        this.sensors = [];

        this.initializeSensors();
    }

    initializeSensors = () => {
        const {frontSensor, leftSideSensor, rightSideSensor} = this.agent;

        this.sensors.push(new FrontSensorView(frontSensor, this.p5));
        this.sensors.push(new SensorView(leftSideSensor, this.p5));
        this.sensors.push(new SensorView(rightSideSensor, this.p5));
    }
    
    drawSensorZones = () => {
        this.sensors.forEach(sensor => {
            sensor.draw();
        });
    }
}