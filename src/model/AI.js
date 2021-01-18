import axios from 'axios'
import {CONFIG} from '../config'

const {API, CALL_FREQUENCY} = CONFIG;

export class AI {
    static apiCallInterval = null;

    static predict(input) {
        return axios.post(API + "/predict_layers", {
            network_name: "self_driving_trained_test",
            input_array: input
        });
    }

    static auto(traffic, automaticMode, setLayers) {
        if(automaticMode) {
            this.apiCallInterval = setInterval(() => {
                AI.predict(traffic.agent.getSnapshot())
                .then(resp => {
                    const layers = this.parseLayersFromResponse(resp);
                    setLayers(layers);

                    const predictedDirection = this.parseDirectionFromResponse(resp);
                    traffic.agent.changeLane(traffic.lanes, predictedDirection);
                })
                .catch(err => {
                    console.error(err);
                });
            }, CALL_FREQUENCY);
        } else {
            this.turnOffAutoMode();
        }
    }

    static parseLayersFromResponse(resp) {
        const layers = [];
        for (let i = 0; i < resp.data.prediction.length; i++) {
            const layer = resp.data.prediction[i];
            layers.push(layer);
        }
        return layers;
    }

    static parseDirectionFromResponse(resp) {
        const responseArray = resp.data.prediction[2][0];
        return responseArray.indexOf(Math.max(...responseArray)) - 1;
    }

    static turnOffAutoMode() {
        clearInterval(this.apiCallInterval);
    }
}