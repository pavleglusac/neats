import {CONFIG} from "../config";

const {NUM_OF_LANES, LANE_WIDTH, MAX_SPEED, CANVAS_HEIGHT} = CONFIG;

export class LanesView {
    constructor(p5) {
        this.p5 = p5;
        this.lineResetCounter = 0;
    }

    draw = (traffic) => {
        for(let i = 0; i < NUM_OF_LANES + 1; i++) {
            this.drawLane(i);
        }
        this.lineResetCounter += traffic.speed + 4 * MAX_SPEED / 6;
        this.lineResetCounter = this.lineResetCounter >= 80 ? 0 : this.lineResetCounter;
    }

    drawLane = (i) => {
        const WHITE = 255;
        this.drawLines(LANE_WIDTH * i,  this.lineResetCounter, LANE_WIDTH * i, CANVAS_HEIGHT, 40);
        this.p5.stroke(WHITE);
    }

    drawLines = (x1, y1, x2, y2, delta) => {
        let distance = this.p5.dist(x1,y1,x2,y2);
        let dashNumber = distance/delta;
        let xDelta = (x2-x1)/dashNumber;
        let yDelta = (y2-y1)/dashNumber;
        for (let i = 0; i < dashNumber; i+= 2) {
            let xi1 = i*xDelta + x1;
            let yi1 = i*yDelta + y1;
            let xi2 = (i+1)*xDelta + x1;
            let yi2 = (i+1)*yDelta + y1;
        
            this.p5.line(xi1, yi1, xi2, yi2);
        }
    }
}