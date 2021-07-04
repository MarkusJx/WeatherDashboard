import React from "react";
import ISensorData, {SensorData} from "./api/ISensorData";

import styles from "../styles/SensorData.module.scss";

import {FiThermometer} from "react-icons/fi";
import {BsDropletHalf} from "react-icons/bs";

export interface SensorDataProps {
    sensorId: number
}

interface SensorDataState {
    data: SensorData | null;
}

export default class SensorDataField extends React.Component<SensorDataProps, SensorDataState> {
    public constructor(props: SensorDataProps) {
        super(props);

        this.state = {
            data: null
        };
    }

    private get data(): SensorData | null {
        return this.state.data;
    }

    private set data(data: SensorData | null) {
        this.setState({
            data: data
        });
    }

    public render(): React.ReactNode {
        if (this.state.data == null) {
            return (
                <>
                    Loading...
                </>
            );
        } else {
            return (
                <div className={styles.data} onClick={() => window.location.href = `/sensors/${this.props.sensorId}`}>
                    <h2 className={styles.heading}>Last update: {this.data!.time}</h2>
                    <div className={styles.sensor_data}>
                        <FiThermometer/>
                        <span>{this.data!.temperature}°C</span>
                    </div>
                    <div className={styles.sensor_data}>
                        <BsDropletHalf/>
                        <span>{this.data!.humidity}%</span>
                    </div>
                </div>
            );
        }
    }

    public componentDidMount(): void {
        this.fetchData().then();
    }

    private async fetchData(): Promise<void> {
        this.data = (await ISensorData.fetchData(this.props.sensorId, 1))[0];
    }
}
