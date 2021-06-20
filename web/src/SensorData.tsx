import React from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis} from "recharts";
import Config from "./Config";
import Util from "./Util";

export interface SensorDataProps {
    sensorId: number
}

interface SensorDataState {
    data: chartData | null;
}

enum Unit {
    temperature = "TEMPERATURE",
    humidity = "HUMIDITY"
}

interface SensorDataDTO {
    timestamp: number,
    unit: Unit,
    value: number
}

export default class SensorData extends React.Component<SensorDataProps, SensorDataState> {
    public constructor(props: SensorDataProps) {
        super(props);

        this.state = {
            data: null
        };

        this.fetchData().then();
    }

    public render(): React.ReactNode {
        if (this.state.data == null) {
            return (
                <></>
            );
        } else {
            return (
                <SensorDataChart data={this.state.data}/>
            );
        }
    }

    private fetchSensorData(unit: Unit): Promise<SensorDataDTO[]> {
        return fetch(`${Config.SERVER_URL}/api/v1/data/get/${this.props.sensorId}?unit=${unit}&limit=${Config.MAX_FETCH_VALUES}`)
            .then(r => Util.toJson<SensorDataDTO[]>(r));
    }

    private async fetchData(): Promise<void> {
        const temperatures = await this.fetchSensorData(Unit.temperature);
        const humidityValues = await this.fetchSensorData(Unit.humidity);

        type data_t = {temperature: number, humidity: number};
        const data: data_t[] = [];

        temperatures.forEach(t => data[t.timestamp] = {temperature: t.value, humidity: 0});
        humidityValues.forEach(h => {
            if (data[h.timestamp] == undefined) {
                data[h.timestamp] = {
                    temperature: 0,
                    humidity: h.value
                };
            } else {
                data[h.timestamp] = {
                    temperature: data[h.timestamp].temperature,
                    humidity: h.value
                };
            }
        });

        this.data = data.map((value: data_t, index: number) => {
            return {
                name: new Date(index).toDateString(),
                temperature: value.temperature,
                humidity: value.humidity
            };
        });
    }

    private set data(data: chartData) {
        this.setState({
            data: data
        });
    }
}

type chartData = {
    name: string,
    temperature: number,
    humidity: number
}[];

interface SensorDataChartProps {
    data: chartData
}

class SensorDataChart extends React.Component<SensorDataChartProps> {
    public render(): React.ReactNode {
        return (
            <LineChart width={400} height={400} data={this.props.data}
                       margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                <XAxis dataKey="name"/>
                <Tooltip/>
                <CartesianGrid stroke="#f5f5f5"/>
                <Line type="monotone" dataKey="temperature" stroke="#ff7300" yAxisId={0}/>
                <Line type="monotone" dataKey="humidity" stroke="#387908" yAxisId={1}/>
            </LineChart>
        );
    }
}