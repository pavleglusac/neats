import React from "react"
import { setMaxSpeed } from "../../config";

export class MovementInputForm extends React.Component {

    handleChangeMaximumSpeed = (e) => {
        const maxSpeed = e.target.value;
        setMaxSpeed(maxSpeed);
    }

    render() {
        const value = localStorage.getItem('MAX_SPEED');
        return (
            <fieldset>
                <legend>
                    <span className="number">3</span> Movement
                </legend>
                <label>Maximum speed:</label>
                <select
                    onChange={this.handleChangeMaximumSpeed}
                    value={value ? value : 1.66}
                >
                    <option value={1.66}>80 km/h</option>
                    <option value={5}>120 km/h</option>
                    <option value={8.33}>160 km/h</option>
                </select>    
            </fieldset>
        )
    }

}