import { CONFIG } from "../config";
import { Agent } from "./Agent";

const {CANVAS_HEIGHT, ACCELERATION, MAX_SPEED} = CONFIG;

export class MovementSimulator {
    static simulateMovement = (cars, setSpeed, speed) => {
        for(let i = 0; i < cars.length; i++) {
            const currentCar = cars[i];
            if(!(currentCar instanceof Agent)) {
                currentCar.move(speed);
            } else {
                const agent = currentCar;
                agent.scanForCars(cars);

                this.adjustSpeed(agent, speed, setSpeed);
            }
        }
    }

    static adjustSpeed = (agent, speed, setSpeed) => {
        const brakingSpeed = 40;
        if(agent.frontSensor.safetyZoneActive) {
            if(speed > 0.1) {
                setSpeed(speed * (1 - 0.001 * brakingSpeed * MAX_SPEED));
            } else {
                setSpeed(0);
            }
        } else {
            if(speed < 0.1) {
                setSpeed(speed + ACCELERATION);
            } else {
                setSpeed(speed + ACCELERATION/speed);
            }
        }

        const carCrashed = agent.collisionSensor.safetyZoneActive;
        if(carCrashed) {
            setSpeed(0);
        }
    }

    static removeCarsOutOfSight = (cars) => {
        return cars.filter(this.carOutOfSight);
    }

    static carOutOfSight = (currentCar) => {
        return currentCar.position.y < CANVAS_HEIGHT;
    }
    
}