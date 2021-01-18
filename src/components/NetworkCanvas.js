import React from 'react'
import Sketch from 'react-p5';

export class NetworkCanvas extends React.Component {
    
    setup = (p5, canvasParentRef) => {
        const canvasWidth = 250;
        const canvasHeight = 180;
        p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
        this.inputPositions = [canvasHeight * 0.1, canvasHeight * 0.25, canvasHeight * 0.4, 
            canvasHeight * 0.55, canvasHeight * 0.7, canvasHeight * 0.85];
        this.inputX = canvasWidth * 0.1;
        this.hiddenPositions = [canvasHeight * 0.225, canvasHeight * 0.375, canvasHeight * 0.525, canvasHeight * 0.675];
        this.hiddenX = canvasWidth * 0.5;
        this.outputPositions = [canvasHeight * 0.325, canvasHeight * 0.475, canvasHeight * 0.625];
        this.outputX = canvasWidth * 0.83;
    };

    draw = p5 => {
        this.setBackground(p5);

        this.drawInputHiddenWeights(p5);

        this.drawHiddenOutputWeights(p5);
        
        this.drawInputLayer(p5);

        this.drawHiddenLayer(p5);
        
        this.drawOutputLayer(p5);
    };

    setBackground = (p5) => {
        const WHITE = 255;
        p5.background(WHITE);
    }

    drawInputLayer = (p5) => {
        const {layers} = this.props;
        p5.stroke(51);
        for (let i = 0; i < this.inputPositions.length; i++) {
            const neuronValue = layers.length && layers[0][i];
            const grayscale = 255 - neuronValue * 255;
            p5.fill(grayscale);
            p5.circle(this.inputX, this.inputPositions[i], 20);
        }
    }

    drawHiddenLayer = (p5) => {
        const {layers} = this.props;
        p5.stroke(51);
        for (let i = 0; i < this.hiddenPositions.length; i++) {
            const neuronValue = layers.length && layers[1][0][i];
            const grayscale = 255 - neuronValue * 255;
            p5.fill(grayscale);
            p5.circle(this.hiddenX, this.hiddenPositions[i], 20);
        }
    }

    drawOutputLayer = (p5) => {
        const {layers} = this.props;
        p5.stroke(51);
        for (let i = 0; i < this.outputPositions.length; i++) {
            const neuronValue = layers.length && layers[2][0][i];
            const grayscale = 255 - neuronValue * 255;
            p5.fill(grayscale);
            p5.circle(this.outputX, this.outputPositions[i], 20);
        }
    }

    drawInputHiddenWeights = (p5) => {
        p5.stroke(51);
        this.drawWeightLines(this.inputPositions, this.hiddenPositions, this.inputX, this.hiddenX, 0, 1, p5);
    }

    drawHiddenOutputWeights = (p5) => {
        p5.stroke(51);
        this.drawWeightLines(this.hiddenPositions, this.outputPositions, this.hiddenX, this.outputX, 1, 2, p5);
    }

    drawWeightLines = (pos1, pos2, x1, x2, a, b, p5) => {
        const {layers} = this.props;
        for (let i = 0; i < pos1.length; i++) {
            for (let j = 0; j < pos2.length; j++) {
                const neuronValue1 = layers.length && (a === 0 ?  layers[a][i] : layers[a][0][i]);
                const neuronValue2 = layers.length && layers[b][0][i];
                const grayscale = 255 - (neuronValue1 + neuronValue2) * 128;
                p5.stroke(grayscale);
                p5.line(x1, pos1[i], x2, pos2[j]);
            }
        }
    }

    render() {
        return (
            <Sketch 
                setup={this.setup} 
                draw={this.draw} 
            />
        )
    }
}