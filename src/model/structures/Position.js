export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add = (position) => {
        this.addX(position.x);
        this.addY(position.y);
    }

    addY = (y) => {
        this.y += y;
    }

    addX = (x) => {
        this.x += x
    }
}