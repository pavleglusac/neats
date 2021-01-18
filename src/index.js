import React from "react";
import ReactDOM from "react-dom";
import { Traffic } from "./model/Traffic";
import { ResultDisplay } from "./components/ResultDisplay";
import { Environment } from "./Environment";
import { KeyEventHandler } from "./KeyEventHandler";
import { AI } from "./model/AI";
import { MouseEventHandler } from "./MouseEventHandler";
import {InputForm} from "./components/InputForm";
import { ControllerDisplay } from "./components/ControllerDisplay";

export default class MainWindow extends React.Component {
    constructor(props) {
        super(props);
        this.traffic = new Traffic(this.changeSpeed, this.updatePassedCars);
        this.state = {
            speed: 1,
            passedCars: 0,
            showSensors: true,
            automaticModeActive: false,
            layers: []
        }
        this.keyEventHandler = new KeyEventHandler(this.traffic, this.toggleAutoMode, this.turnOffAutoMode);
        this.mouseEventHandler = new MouseEventHandler(this.traffic);
        this.apiCallInterval = null;
    }

    componentDidMount() {
        this.turnOnAutoMode();
    }

    toggleAutoMode = () => {
        if(this.state.automaticModeActive) {
            this.turnOffAutoMode();
        } else {
            this.turnOnAutoMode();
        }
        
    }

    turnOnAutoMode = () => {
        this.setState({
            automaticModeActive: true
        }, () => {
            AI.auto(this.traffic, this.state.automaticModeActive, this.setLayers);
            !this.state.automaticModeActive && this.turnOffAutoMode();
        });
    }

    turnOffAutoMode = () => {
        this.setState({
            automaticModeActive: false
        });
        AI.turnOffAutoMode();
    }

    toggleShowSensors = () => {
        this.setState({showSensors: !this.state.showSensors});
    }
    
    changeSpeed = (speed) => {
        this.setState({speed: speed})
    }

    updatePassedCars = (passedCars) => {
        this.setState({passedCars: this.state.passedCars + passedCars});
    }

    setLayers = (layers) => {
        this.setState({layers: layers});
    }

    handleKeyPressed = (p5) => {
        this.keyEventHandler.handleKeyPressed(p5);
    }

    handleMousePressed = (e) => {
        this.mouseEventHandler.handleMousePressed(e);
    }

    render() {
        return (
            <div>
                <div className="flex-container">
                    <div>
                        <ResultDisplay
                            agentSpeed={this.state.speed}
                            passedCars={this.state.passedCars}
                            layers={this.state.layers}
                        />
                    </div>
                    <div>
                        <Environment
                            showSensors={this.state.showSensors}
                            handleMousePressed={this.handleMousePressed}
                            keyPressed={this.handleKeyPressed}
                            traffic={this.traffic}
                        />
                    </div>
                </div>
                <div className="flex-container">
                    <div>
                        <InputForm
                            showSensors={this.state.showSensors}
                            toggleShowSensors={this.toggleShowSensors}
                        />
                    </div>
                    <div>
                        <ControllerDisplay
                            turnOnAutoMode={this.turnOnAutoMode}
                            turnOffAutoMode={this.turnOffAutoMode}
                            automaticModeActive={this.state.automaticModeActive}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<MainWindow />, document.getElementById("root"));