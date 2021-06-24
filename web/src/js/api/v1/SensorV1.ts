import ISensor from "../ISensor";
import {FullSensorDTO, SensorDTO} from "./DataTransferObjects";
import Config from "../../util/Config";
import Util from "../../util/Util";

export default class SensorV1 implements ISensor {
    public addSensor(data: SensorDTO, token: string): Promise<number> {
        return fetch(`${Config.SERVER_URL}/api/v1/sensor`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }).then(Util.toJson);
    }

    public listSensors(): Promise<FullSensorDTO[]> {
        return fetch(`${Config.SERVER_URL}/api/v1/sensor/list`, {
            method: 'GET'
        }).then(Util.toJson);
    }

    public deleteSensor(id: number, token: string): Promise<void> {
        return fetch(`${Config.SERVER_URL}/api/v1/sensor/${id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        }).then(r => {
            if (!r.ok) {
                return Util.toJson(r);
            }
        });
    }
}