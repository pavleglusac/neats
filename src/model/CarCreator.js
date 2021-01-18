import { Car } from "./Car";
import { CONFIG } from "../config";
import { Agent } from "./Agent";

const {CAR_CREATION_INTERVAL, CARS_TO_CREATE} = CONFIG;

export class CarCreator {
    constructor() {
        this.carCreationInterval = CAR_CREATION_INTERVAL;
    }
    
    createCars = (lanes, cars) => {
        this.countdownCarCreation();

        const timeToCreateCar = this.carCreationInterval === 0;
        if(timeToCreateCar) {
            for(let i = 0; i < CARS_TO_CREATE; i++) {
                const randomLaneNum = Math.floor(Math.random() * lanes.length);
                const lane = lanes[randomLaneNum];
                const newCar = new Car(lane);
                cars.push(newCar);
            }
            this.resetCarCreation();
        }
    }

    countdownCarCreation() {
        this.carCreationInterval --;
    }

    resetCarCreation() {
        this.carCreationInterval = CAR_CREATION_INTERVAL;
    }

    createAgent = (lanes, cars) => {
        const agent = new Agent(lanes[3]);
        cars.push(agent);
        return agent;
    }
}