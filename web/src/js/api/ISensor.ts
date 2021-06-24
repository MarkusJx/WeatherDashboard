import {FullSensorDTO, SensorDTO} from "./v1/DataTransferObjects";
import SensorV1 from "./v1/SensorV1";

export default abstract class ISensor {
    /**
     * The static instance
     * @private
     */
    private static readonly instance: ISensor = new SensorV1();

    /**
     * Get the static authentication instance
     *
     * @return the static instance
     */
    public static getInstance(): ISensor {
        return ISensor.instance;
    }

    public abstract addSensor(data: SensorDTO, token: string): Promise<number>;

    public abstract listSensors(): Promise<FullSensorDTO[]>;

    public abstract deleteSensor(id: number, token: string): Promise<void>;
}