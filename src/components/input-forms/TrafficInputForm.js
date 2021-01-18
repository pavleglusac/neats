import React from "react"
import { setCarsToCreate, setCarCreationInterval } from "../../config";

export class TrafficInputForm extends React.Component {

    handleChangeCarsToCreate = (e) => {
        const carsToCreate = e.target.value;
        setCarsToCreate(carsToCreate);
    }

    handleChangeCarCreationInterval = (e) => {
        const carCreationInterval = e.target.value;
        setCarCreationInterval(carCreationInterval);
    }

    renderNumberOfCarsSpawning = () => {
        const options = [];
        for(let i = 2; i <= 5; i++) {
            options.push(
                <option value={i} key={i}>{i} cars</option>
            );
        }
        const value = localStorage.getItem('CARS_TO_CREATE');
        return (
            <select
                onChange={this.handleChangeCarsToCreate}
                value={value ? value : 1}
            >
                <option value={1}>1 car</option>
                {options}
            </select>      
        );
    }

    renderCarSpawningInterval = () => {
        const value = localStorage.getItem('CAR_CREATION_INTERVAL');
        return (
            <select
                onChange={this.handleChangeCarCreationInterval}
                value={value ? value : 200}
            >
                <option value={200}>Slow</option>
                <option value={100}>Normal</option>
                <option value={50}>Fast</option>
            </select>      
        );
    }

    render() {
        return (
            <fieldset>
                <legend>
                    <span className="number">2</span> Traffic
                </legend>
                <label>Number of Cars Spawning:</label>
                {this.renderNumberOfCarsSpawning()}
                <label>Car Spawning Speed:</label>
                {this.renderCarSpawningInterval()}
            </fieldset>
        )
    }

}