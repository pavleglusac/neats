import {Size} from './structures/Size';
import { Position } from './structures/Position';
import {CONFIG} from "../config";

const {CAR_WIDTH, CAR_HEIGHT} = CONFIG;

export class Car {
    constructor(lane) {
        this.active = true;
        this.size = new Size(CAR_WIDTH, CAR_HEIGHT);
        this.position = new Position(lane.position.x, -100);
        this.lane = lane;
        this.direction = 1;
        this.speed = 1;
        this.carIndex = 0;
    }

    move = (speed) => {
        if(this.active) {
            this.speed = speed;
            this.position.addY(speed * this.direction);
        }
    }

    toggle = () => {
        if(this.active) {
            this.speed = 0;
            this.active = false;
        } else {
            this.active = true;
        }
    }
}