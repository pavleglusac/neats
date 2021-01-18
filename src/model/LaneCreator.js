import { CONFIG } from "../config";
import { Lane } from "./Lane";
import { Position } from "./structures/Position";

const {NUM_OF_LANES, LANE_WIDTH} = CONFIG;

export class LaneCreator {
    static createLanes = () => {
        const newLanes = [];
        for(let i = 0; i < NUM_OF_LANES; i++) {
            const lanePosition = LANE_WIDTH * (i + (i + 1)) / 2;
            const newLane = new Lane(new Position(lanePosition, 0), i);
            newLanes.push(newLane);
        }
        return newLanes;
    }
}