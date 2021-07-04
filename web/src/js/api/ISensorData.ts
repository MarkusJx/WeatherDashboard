import SensorDataV1 from "./v1/SensorDataV1";
import {SensorDataDTO} from "./v1/DataTransferObjects";
import Util from "../util/Util";

export interface SensorData {
    time: string,
    humidity: number,
    temperature: number
}

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

    public static async fetchData(sensorId: number, limit: number = -1, offset: number = -1): Promise<SensorData[]> {
        const data: SensorDataDTO[] = await ISensorData.getInstance().getData(sensorId, limit, offset);

        const format = new Intl.DateTimeFormat("UK", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Need to negate the offset, we're adding it at this point
        const _offset = Util.getUtcOffset() * (-60);
        data.reverse();
        return data.map((value: SensorDataDTO) => {
            const date = new Date((value.timestamp + _offset) * 1000);
            return {
                time: format.format(date),
                //ime: date.toLocaleString(),
                temperature: value.temperature,
                humidity: value.humidity
            };
        });
    }
}