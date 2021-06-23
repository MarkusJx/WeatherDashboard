import ISensorData from "../ISensorData";
import {SensorDataDTO} from "./DataTransferObjects";
import Config from "../../util/Config";
import Util from "../../util/Util";

export default class SensorDataV1 implements ISensorData {
    public getData(sensorId: number, limit: number = -1, offset: number = -1): Promise<SensorDataDTO[]> {
        return fetch(`${Config.SERVER_URL}/api/v1/data/get/${sensorId}?limit=${limit}&offset=${offset}`, {
            method: 'GET'
        }).then(Util.toJson);
    }
}