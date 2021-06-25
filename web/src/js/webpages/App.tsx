import styles from '../../styles/webpages/App.module.scss';
import React from "react";
import Config from "../util/Config";
import Util from "../util/Util";
import SensorData from "../SensorData";
import {FullSensorDTO} from "../api/v1/DataTransferObjects";
import ISensor from "../api/ISensor";

interface AppState {
    sensors: FullSensorDTO[] | null;
}

export default class App extends React.Component<{}, AppState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            sensors: null
        };
    }

    private get sensors(): FullSensorDTO[] {
        return this.state.sensors as FullSensorDTO[];
    }

    private set sensors(sensors: FullSensorDTO[]) {
        this.setState({
            sensors: sensors
        });
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.App}>
                {this.sensorsSet() ? undefined : this.generateSensors()}
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Sensor dashboard";
        ISensor.getInstance().listSensors().then(res => this.sensors = res);
    }

    private generateSensors(): React.ReactNode[] {
        return this.sensors.map((s: FullSensorDTO, i: number) => (
            <SensorData sensorId={s.id} key={i}/>
        ));
    }

    private sensorsSet(): boolean {
        return this.state.sensors == null;
    }
}
