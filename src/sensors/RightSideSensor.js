import { Sensor } from "./Sensor";
import { CONFIG } from "../config";

const {CAR_HEIGHT, LANE_WIDTH, NUM_OF_LANES} = CONFIG;

export class RightSideSensor extends Sensor {
    getSafetyZone() {
        const {x, y} = this.position;
        const xStart = x + LANE_WIDTH/2;
        const xEnd = x + LANE_WIDTH/2 + LANE_WIDTH;

        const yStart = y - CAR_HEIGHT;
        const yEnd = y + CAR_HEIGHT*2;
        return {yStart, yEnd, xStart, xEnd}
    }

    getDistanceZone() {
        const {x, y} = this.position;
        const xStart = x + LANE_WIDTH/2;
        const xEnd = x + LANE_WIDTH/2 + LANE_WIDTH;
        
        const yStart = y - CAR_HEIGHT*9;
        const yEnd = y - CAR_HEIGHT;
        return {xStart, xEnd, yStart, yEnd}
    }

    scanForLaneEdges(laneIndex) {
        if(!this.safetyZoneActive) {
            const lastLaneIndex = NUM_OF_LANES - 1;
            this.safetyZoneActive = laneIndex === lastLaneIndex;
        }
    }
}