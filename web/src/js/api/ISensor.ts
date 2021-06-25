import {FullSensorDTO, SensorDTO} from "./v1/DataTransferObjects";
import SensorV1 from "./v1/SensorV1";

/**
 * A class for the sensor api methods
 */
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

    /**
     * Add a new sensor to the sensor dashboard
     *
     * @param data the sensor info to add
     * @param token the jwt authentication token of the current user
     * @return the id of the newly created sensor
     */
    public abstract addSensor(data: SensorDTO, token: string): Promise<number>;

    /**
     * List all registered sensors
     *
     * @return the list of registered sensors
     */
    public abstract listSensors(): Promise<FullSensorDTO[]>;

    /**
     * Delete a sensor from the dashboard
     *
     * @param id the id of the sensor to delete
     * @param token the authentication token of the current user
     */
    public abstract deleteSensor(id: number, token: string): Promise<void>;
}