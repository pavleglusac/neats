import React from "react"
import { setNumOfLanes } from "../../config";
import { ConnectionStatus } from "../../ConnectionStatus";

export class AgentInputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false
        }
        this.checkConnectionStatus();
        setInterval(() => {
            this.checkConnectionStatus();
        }, 10000);
    }

    handleChangeNumOfLanes = (e) => {
        const numOfLanes = e.target.value;
        setNumOfLanes(numOfLanes);
    }

    checkConnectionStatus = () => {
        ConnectionStatus.check()
        .then(resp => {
            this.setState({connected: resp.status === 200});
        })
        .catch(err => {
            this.setState({connected: false});
        });
    }

    renderConnectionStatus = () => {
        const style = this.state.connected ? "good five-bars" : "bad one-bar"
        return (
            <div className={"signal-bars mt1 sizing-box " + style} style={{marginLeft: 10}}>
                <div className="first-bar bar"></div>
                <div className="second-bar bar"></div>
                <div className="third-bar bar"></div>
                <div className="fourth-bar bar"></div>
                <div className="fifth-bar bar"></div>
            </div>
        )
    }

    render() {
        return (
            <fieldset>
                <legend>
                    <span className="number">4</span> Agent
                    {this.renderConnectionStatus()}
                </legend>
                <input
                    type="checkbox"
                    checked={this.props.showSensors}
                    onChange={this.props.toggleShowSensors}
                />
                <span style={{padding: 0, paddingLeft: 10}}>Show Sensor Zones</span>
            </fieldset>
        )
    }

}