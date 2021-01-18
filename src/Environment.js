import React from 'react'
import { CONFIG } from './config';
import Sketch from 'react-p5';
import { CarsView } from './view/CarsView';
import { LanesView } from './view/LanesView';

const {CANVAS_HEIGHT, CANVAS_WIDTH} = CONFIG;

export class Environment extends React.Component {
    constructor(props) {
        super(props);
        this.lanesView = null;
        this.carsView = null;
    }

    preload = (p5) => {
        this.lanesView = new LanesView(p5);
        this.carsView = new CarsView(p5);
        this.carsView.loadImages();
    }
    
    setup = (p5, canvasParentRef) => {
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
    };

    draw = p5 => {
        this.setBackground(p5);

        this.simulateTraffic();
        this.drawElements();
    };

    setBackground = (p5) => {
        const BLACK = 0;
        p5.background(BLACK);
    }

    simulateTraffic = () => {
        const {traffic} = this.props;
        traffic.simulate();
    }

    drawElements = () => {
        const {traffic} = this.props;
        this.lanesView.draw(traffic);
        this.carsView.draw(traffic, this.props.showSensors);
    }

    render() {
        return (
            <Sketch 
                setup={this.setup} 
                draw={this.draw} 
                preload={this.preload}
                mousePressed={this.props.handleMousePressed}
                keyPressed={this.props.keyPressed}
            />
        )
    }
}