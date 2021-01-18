import { DataCollector } from "./model/DataCollector";

export class KeyEventHandler {
    constructor(traffic, toggleAutoMode, turnOffAutoMode) {
        this.traffic = traffic;
        this.toggleAutoMode = toggleAutoMode;
        this.turnOffAutoMode = turnOffAutoMode;
    }

    handleKeyPressed = (p5, automaticModeActive, setLayers) => {
        this.tryToSaveData(p5.keyCode);
        const direction = this.getDirectionFromKeyCode(p5.keyCode, automaticModeActive, setLayers);
        if(direction !== null) {
            this.controllAgent(direction);
            DataCollector.createSnapshot(this.traffic.agent.getSnapshot(), direction);
            this.turnOffAutoMode();
        }
    }

    tryToSaveData = (keyCode) => {
        const SPACE = 32;
        if(keyCode === SPACE) {
            DataCollector.saveData("data");
        }
    }

    getDirectionFromKeyCode = (keyCode) => {
        const UP_ARROW = 38;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;
        const CTRL = 17;
        let direction = null;
        if(keyCode === LEFT_ARROW) {
            direction = -1;
        } else if(keyCode === RIGHT_ARROW) {
            direction = 1;
        } else if(keyCode === UP_ARROW) {
            direction = 0;
        } else if(keyCode === CTRL) {
            this.toggleAutoMode();
        }
        return direction
    }

    controllAgent = (direction) => {
        this.traffic.agent.changeLane(this.traffic.lanes, direction);
    }

}