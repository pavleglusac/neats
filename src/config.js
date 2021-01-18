const NUM_OF_LANES = parseInt(localStorage.getItem('NUM_OF_LANES'));
const MAX_SPEED = parseFloat(localStorage.getItem('MAX_SPEED'));
const CARS_TO_CREATE = parseInt(localStorage.getItem('CARS_TO_CREATE'));
const CAR_CREATION_INTERVAL = parseInt(localStorage.getItem('CAR_CREATION_INTERVAL'));

// Logging the current config
// console.log(`MAX SPEED: ${MAX_SPEED}`);
// console.log(`NUM_OF_LANES: ${NUM_OF_LANES}`);
// console.log(`CARS_TO_CREATE: ${CARS_TO_CREATE}`);
// console.log(`CAR_CREATION_INTERVAL: ${CAR_CREATION_INTERVAL}`);
// ***************************

let windowHeight = window.innerHeight * 0.8;

export const CONFIG = {
    API: "http://167.86.94.185:3000",
    CALL_FREQUENCY: 200,
    // Static fields.
    CAR_WIDTH: windowHeight * 0.0375,
    CAR_HEIGHT: windowHeight * 0.0625,
    CANVAS_HEIGHT: windowHeight,
    LANE_WIDTH: windowHeight * 0.1,
    MIN_SPEED: 1,
    // Relative fields.
    ACCELERATION: MAX_SPEED ? MAX_SPEED * 0.005 : 1.66 * 0.005,
    CANVAS_WIDTH: NUM_OF_LANES ? NUM_OF_LANES * windowHeight * 0.1 : windowHeight * 0.4,
    CAR_CREATION_INTERVAL: CAR_CREATION_INTERVAL ? CAR_CREATION_INTERVAL : 200,
    CARS_TO_CREATE: CARS_TO_CREATE ? CARS_TO_CREATE : 1,
    MAX_SPEED: MAX_SPEED ? MAX_SPEED : 1.66,
    NUM_OF_LANES: NUM_OF_LANES ? NUM_OF_LANES : 4,
}

export function setNumOfLanes(n) {
    localStorage.setItem('NUM_OF_LANES', n);
}

export function setMaxSpeed(maxSpeed) {
    localStorage.setItem('MAX_SPEED', maxSpeed);
}

export function setCarsToCreate(carsToCreate) {
    localStorage.setItem('CARS_TO_CREATE', carsToCreate);
}

export function setCarCreationInterval(carCreationInterval) {
    localStorage.setItem('CAR_CREATION_INTERVAL', carCreationInterval);
}