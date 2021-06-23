import ISensor from "../ISensor";
import {FullSensorDTO, SensorDTO} from "./DataTransferObjects";
import Config from "../../util/Config";

export default class SensorV1 implements ISensor {
    private static getNumber(r: Response): Promise<number> {
        if (r.ok) {
            return r.json();
        } else {
            throw new Error(r.statusText);
        }
    }

    public addSensor(data: SensorDTO, token: string): Promise<number> {
        return fetch(`${Config.SERVER_URL}/api/v1/sensor`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        }).then(SensorV1.getNumber);
    }

    public listSensors(): Promise<FullSensorDTO[]> {
        return fetch(`${Config.SERVER_URL}/api/v1/sensor/list`, {
            method: 'GET'
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(res.statusText);
            }
        });
    }
}