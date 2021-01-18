import axios from 'axios'
import {CONFIG} from './config'

const {API} = CONFIG;

export class ConnectionStatus {
    static check() {
        return axios.get(API + "/heartbeat");
    }
}