export class MouseEventHandler {
    constructor(traffic) {
        this.traffic = traffic;
    }
    
    handleMousePressed = (e) => {
        // const {mouseX, mouseY} = e;
        // const clickedCarIndex = this.clickedCar(mouseX, mouseY);
        // if(clickedCarIndex) {
        //     this.traffic.cars[clickedCarIndex].toggle();
        // }
    }

    clickedCar = (x, y) => {
        for(const i in this.traffic.cars) {
            const car = this.traffic.cars[i];
            const carPosition = car.position;
            const carSize = car.size;
            const xStart = carSize.width/2 - carSize.width;
            const xEnd = carSize.width/2 + carSize.width;
            const targetedXOfTheCar = (x >= carPosition.x + xStart) && (x <= carPosition.x + xEnd);
            const targetedYOfTheCar = (y >= carPosition.y) && (y <= carPosition.y + carSize.height);
            if(targetedXOfTheCar && targetedYOfTheCar) {
                return i;
            }
        }
        return false;
    }
}