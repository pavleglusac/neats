import React from "react";
import {DataCollector} from "../model/DataCollector";

export class ControllerDisplay extends React.Component {
    saveTrainingData = () => {
        DataCollector.saveData("data");
    }

    render = () => {
        return (
            <div className="form-style-5">
                <legend>
                    <span className="number">1</span> Driving mode: <br/>
                    Mode: {this.props.automaticModeActive ? "Automatic" : "Manual"}
                </legend>
                <button className="green-button" onClick={this.props.turnOnAutoMode}>Automatic</button>
                <br/>
                <br/>
                <button className="red-button" onClick={this.props.turnOffAutoMode}>Manual</button>
                <br/>
                <legend>
                    <span className="number">2</span> Save Training Data:
                </legend>
                <button className="green-button" onClick={this.saveTrainingData}>Download</button>
            </div>
        );
    }
}