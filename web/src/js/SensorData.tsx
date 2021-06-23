import React from "react";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis} from "recharts";
import ISensorData from "./api/ISensorData";
import {SensorDataDTO} from "./api/v1/DataTransferObjects";
import Util from "./util/Util";

export interface SensorDataProps {
    sensorId: number
}

interface SensorDataState {
    data: chartData | null;
}

export default class SensorData extends React.Component<SensorDataProps, SensorDataState> {
    public constructor(props: SensorDataProps) {
        super(props);

        this.state = {
            data: null
        };
    }

    private set data(data: chartData) {
        this.setState({
            data: data
        });
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

    public componentDidMount(): void {
        this.fetchData().then();
    }

    private async fetchData(): Promise<void> {
        const data: SensorDataDTO[] = await ISensorData.getInstance().getData(this.props.sensorId, 50);

        const format = new Intl.DateTimeFormat("UK", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const offset = Util.getUtcOffset() * 60;
        data.reverse();
        this.data = data.map((value: SensorDataDTO) => {
            const date = new Date((value.timestamp + offset) * 1000);
            return {
                name: format.format(date),
                temperature: value.temperature,
                humidity: value.humidity
            };
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
            <LineChart width={1200} height={600} data={this.props.data}
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