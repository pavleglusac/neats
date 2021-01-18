import React from "react"
import { EnvironmentInputForm } from "./input-forms/EnvironmentInputForm";
import { TrafficInputForm } from "./input-forms/TrafficInputForm";
import { MovementInputForm } from "./input-forms/MovementInputForm";
import {AgentInputForm} from "./input-forms/AgentInputForm";

export class InputForm extends React.Component {

    render = () => {
        return (
            <div className="form-style-5">
                <form>
                    <EnvironmentInputForm />
                    <TrafficInputForm />
                    <MovementInputForm />
                    <AgentInputForm
                        showSensors={this.props.showSensors}
                        toggleShowSensors={this.props.toggleShowSensors}
                    />
                    <input type="submit" value="Apply" />
                </form>
            </div>
        );
    }
}