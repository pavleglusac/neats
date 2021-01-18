import { Agent } from "../model/Agent";
import { CONFIG } from "../config";

const {CAR_HEIGHT} = CONFIG;
const MAX_DISTANCE_POSITION = {x: 0, y: 0};

export class Sensor {
    constructor(position) {
        this.setPosition(position);
        this.setInitialValues();
    }

    setPosition(position) {
        this.position = {...position};
        this.position.y -= CAR_HEIGHT;
    }

    setInitialValues() {
        this.safetyZoneActive = false;
        this.distance = this.getDistance(MAX_DISTANCE_POSITION);
    }

    isDistanceZoneActive() {
        return this.distance === this.getDistance(MAX_DISTANCE_POSITION);
    }

    getNormalizedDistance() {
        const normalizedDistance = this.distance / this.getDistance(MAX_DISTANCE_POSITION);
        return Math.round(normalizedDistance * 100) / 100;
    }

    checkCar(car) {
        const carPosition = car.position;
        const carNotAgent = !(car instanceof Agent);
        if(carNotAgent) {
            if(this.isInSafetyZone(carPosition)) {
                this.safetyZoneActive = true;
            }
            if(this.isInDistanceZone(carPosition)) {
                const currentDistance = this.getDistance(carPosition);
                this.distance = currentDistance < this.distance ? currentDistance : this.distance;
            }
        }
    }

    isInSafetyZone(position) {
        return this.isInZone(position, this.getSafetyZone());
    }

    isInDistanceZone(position) {
        if(this.getDistanceZone()) {
            return this.isInZone(position, this.getDistanceZone());
        }
    }

    getDistance(position) {
        return this.position.y - position.y;
    }

    isInZone(position, zone) {
        const {yStart, yEnd, xStart, xEnd} = zone;
        const y2 = position.y;
        const x2 = position.x;
        const inYZone = y2 <= yEnd && y2 >= yStart;
        const inXZone = x2 <= xEnd && x2 >= xStart;
        return inXZone && inYZone;
    }

    getSafetyZone() {}
    
    getDistanceZone() {}
}