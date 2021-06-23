import SensorDataV1 from "./v1/SensorDataV1";
import {SensorDataDTO} from "./v1/DataTransferObjects";

export default abstract class ISensorData {
    /**
     * The static instance
     * @private
     */
    private static readonly instance: ISensorData = new SensorDataV1();

    /**
     * Get the static authentication instance
     *
     * @return the static instance
     */
    public static getInstance(): ISensorData {
        return ISensorData.instance;
    }

    public abstract getData(sensorId: number, limit?: number, offset?: number): Promise<SensorDataDTO[]>;
}