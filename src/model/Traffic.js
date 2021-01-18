import { MovementSimulator } from "./MovementSimulator";
import { CarCreator } from "./CarCreator";
import { LaneCreator } from "./LaneCreator";
import {CONFIG} from "../config";

const {MAX_SPEED} = CONFIG;

export class Traffic {
    constructor(changeSpeed, updatePassedCars) {
        this.lanes = LaneCreator.createLanes();
        
        this.cars = [];
        this.carCreator = new CarCreator();
        this.agent = this.carCreator.createAgent(this.lanes, this.cars);

        this.updateSpeedState = changeSpeed;
        this.updatePassedCarsState = updatePassedCars;
        this.speed = 1;
    }

    changeSpeed = (speed) => {
        if(speed > MAX_SPEED) {
            speed = MAX_SPEED;
        }
        if(speed < 0) {
            speed = 0;
        }
        this.speed = speed;
        this.updateSpeedState(speed);
    }

    simulate = () => {
        this.createCars();
        this.moveCars();
        this.removePassedCars();
    }

    createCars = () => {
        const carMovingFast = this.speed >= MAX_SPEED * 0.4;
        carMovingFast && this.carCreator.createCars(this.lanes, this.cars);
    }

    moveCars = () => {
        MovementSimulator.simulateMovement(this.cars, this.changeSpeed, this.speed);
    }

    removePassedCars = () => {
        const previousCarNum = this.cars.length;
        this.cars = MovementSimulator.removeCarsOutOfSight(this.cars);
        const currentCarNum = this.cars.length;
        const removedCars = previousCarNum - currentCarNum;
        this.updatePassedCarsState(removedCars);
    }
}