import styles from '../../styles/webpages/App.module.scss';
import React from "react";
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
                <h1 className={styles.heading}>Latest sensor data</h1>
                {this.sensorsSet() ? <h2 className={styles.heading}>Loading...</h2> : this.generateSensors()}
            </div>
        );
    }

    public componentDidMount(): void {
        document.title = "Sensor dashboard";
        ISensor.getInstance().listSensors().then(res => this.sensors = res);
    }

    private generateSensors(): React.ReactNode[] | React.ReactNode {
        if (this.sensors.length > 0) {
            return this.sensors.map((s: FullSensorDTO, i: number) => (
                <div className={styles.data_container} key={i}>
                    <h3 className={styles.text}>{s.name}</h3>
                    <p className={styles.text}>Location: {s.location}</p>
                    <p className={styles.text}>Id: {s.id}</p>
                    <SensorData sensorId={s.id}/>
                </div>
            ));
        } else {
            return (
                <h2 className={styles.heading}>Error: No sensors registered</h2>
            );
        }
    }

    private sensorsSet(): boolean {
        return this.state.sensors == null;
    }
}
