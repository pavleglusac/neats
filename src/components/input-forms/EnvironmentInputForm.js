import React from "react"
import { setNumOfLanes } from "../../config";

export class EnvironmentInputForm extends React.Component {

    handleChangeNumOfLanes = (e) => {
        const numOfLanes = e.target.value;
        setNumOfLanes(numOfLanes);
    }

    render() {
        const options = [];
        for(let i = 4; i <= 10; i++) {
            options.push(
                <option value={i} key={i}>{i} lanes</option>
            );
        }
        return (
            <fieldset>
                <legend>
                    <span className="number">1</span> Environment
                </legend>
                <label>Number Of Lanes:</label>
                <select
                    onChange={this.handleChangeNumOfLanes}
                    value={localStorage.getItem('NUM_OF_LANES') ? localStorage.getItem('NUM_OF_LANES') : ""}
                >
                    {options}
                </select>
            </fieldset>
        )
    }

}