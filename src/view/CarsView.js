import { ZonesView } from './ZonesView';
import { Agent } from '../model/Agent';

export class CarsView {
    constructor(p5) {
        this.p5 = p5;
    }

    loadImages = () => {
        this.carImg = this.p5.loadImage('car.png');
        this.agentImg = this.p5.loadImage('agent.png');
    }

    draw = (traffic, showSensors) => {
        for(const i in traffic.cars) {
            const car = traffic.cars[i];
            const {x, y} = car.position;
            const {width, height} = car.size;
            const midLanePosition = x - width/2;
            if(car instanceof Agent) {
                if(!this.zones) {
                    this.zones = new ZonesView(this.p5, car);
                }
                showSensors && this.zones.drawSensorZones(this.p5, car);
                this.p5.image(this.agentImg, midLanePosition, y, width, height);
            } else {
                this.p5.image(this.carImg, midLanePosition, y, width, height);
            }
        }
    }
}