import { Car } from "./Car";
import { Position } from "./structures/Position";
import { sleep } from "../utils/functions"; 
import { FrontSensor } from "../sensors/FrontSensor";
import { CollisionSensor } from "../sensors/CollisionSensor";
import { LeftSideSensor } from "../sensors/LeftSideSensor";
import { RightSideSensor } from "../sensors/RightSideSensor";
import {CONFIG} from "../config";

const {CANVAS_HEIGHT} = CONFIG;

export class Agent extends Car {
    constructor(lane) {
        super(lane);
        this.position = new Position(lane.position.x, CANVAS_HEIGHT * 0.875);
        this.speed = 0;
        this.transitioning = false;
        this.frontSensor = new FrontSensor(this.position);
        this.leftSideSensor = new LeftSideSensor(this.position);
        this.rightSideSensor = new RightSideSensor(this.position);
        this.collisionSensor = new CollisionSensor(this.position);
    }

    getSnapshot = () => {
        const frontSafetyActive = this.frontSensor.safetyZoneActive ? 1 : 0;
        const leftSideSafetyActive = this.leftSideSensor.safetyZoneActive ? 1 : 0;
        const rightSideSafetyActive = this.rightSideSensor.safetyZoneActive ? 1 : 0;

        const frontDistance = this.frontSensor.getNormalizedDistance();
        const leftSideDistance = this.leftSideSensor.getNormalizedDistance();
        const rightSideDistance = this.rightSideSensor.getNormalizedDistance();
        
        return [
            frontSafetyActive,
            frontDistance,
            leftSideSafetyActive,
            leftSideDistance,
            rightSideSafetyActive,
            rightSideDistance
        ];
    }

    scanForCars = (cars) => {
        this.frontSensor.setInitialValues();
        this.collisionSensor.setInitialValues();
        this.rightSideSensor.setInitialValues();
        this.leftSideSensor.setInitialValues();
        
        for(const i in cars) {
            const car = cars[i];
            this.frontSensor.checkCar(car);
            this.collisionSensor.checkCar(car);

            this.rightSideSensor.checkCar(car);
            this.rightSideSensor.scanForLaneEdges(this.lane.laneNum);

            this.leftSideSensor.checkCar(car);
            this.leftSideSensor.scanForLaneEdges(this.lane.laneNum);
        }
    }

    changeLane = (lanes, direction) => {
        const newLaneIndex = this.lane.laneNum + direction;
        if(this.canChangeLane(lanes, direction, newLaneIndex)) {
            this.lane = lanes[newLaneIndex]
            const newPosition = new Position(this.lane.position.x, CANVAS_HEIGHT * 0.875);
            this.animateLaneChange(this.position, newPosition);
        }
    }

    canChangeLane = (lanes, direction, newLaneIndex) => {
        const validLane = lanes[newLaneIndex];
        const canMoveLeft = direction === -1 && this.leftSideSensor.safetyZoneActive === false;
        const canMoveRight = direction === 1 && this.rightSideSensor.safetyZoneActive === false;
        return validLane && (canMoveLeft || canMoveRight) && !this.transitioning;
    }

    animateLaneChange = async (oldPosition, newPosition) => {
        const frames = 30;
        this.transitioning = true;
        for(let i = 0; i <= frames; i++) {
            const delta = i / frames;
            const dX = delta * (newPosition.x - oldPosition.x);
            const dY = delta * (newPosition.y - oldPosition.y);
            const deltaPosition = new Position(dX, dY);
            deltaPosition.add(oldPosition)
            this.updatePosition(deltaPosition);
            await sleep(1);
        }
        this.transitioning = false;
    }

    updatePosition = (newPosition) => {
        this.position = newPosition;
        this.frontSensor.setPosition(newPosition);
        this.leftSideSensor.setPosition(newPosition);
        this.rightSideSensor.setPosition(newPosition);
        this.collisionSensor.setPosition(newPosition);
    }
}