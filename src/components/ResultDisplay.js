import React from "react";
import { NetworkCanvas } from "./NetworkCanvas";

export class ResultDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.speedSum = 0;
        this.count = 0;
    }

    componentDidUpdate() {
        const {agentSpeed} = this.props
        this.speedSum += agentSpeed;
        this.count ++;
    }

    normalizeAgentSpeed = () => {
        const {agentSpeed} = this.props;
        return Math.round(agentSpeed * 12) + 60;
    }

    calculateAverageSpeed = () => {
        const avgSpeed = this.speedSum / this.count;
        return Math.round(avgSpeed * 12) + 60;
    }

    render = () => {
        return (
            <div className="form-style-5">
                <form>
                    <legend>
                        <span className="number"></span> Speed: {this.normalizeAgentSpeed()} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Avg Speed: {this.calculateAverageSpeed()} km/h
                    </legend>
                    <legend>
                        <span className="number"></span> Passed Cars: {this.props.passedCars}
                    </legend>
                </form>
                <legend>
                    <span className="number"></span> Network Visualization:
                </legend>
                <NetworkCanvas
                    layers={this.props.layers}
                />
            </div>
        );
    }
}