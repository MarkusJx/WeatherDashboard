import styles from '../../styles/webpages/App.module.scss';
import React from "react";
import Config from "../util/Config";
import Util from "../util/Util";
import SensorData from "../SensorData";

interface SensorDTO {
    name: string;
    id: number;
}

interface AppState {
    sensors: SensorDTO[] | null;
}

export default class App extends React.Component<{}, AppState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            sensors: null
        };
    }

    private get sensors(): SensorDTO[] {
        return this.state.sensors as SensorDTO[];
    }

    private set sensors(sensors: SensorDTO[]) {
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
        fetch(`${Config.SERVER_URL}/api/v1/sensor/list`)
            .then(r => Util.toJson<SensorDTO[]>(r))
            .then(res => this.sensors = res);
    }

    private generateSensors(): React.ReactNode[] {
        let i: number = 0;
        return this.sensors.map(s => (
            <SensorData sensorId={s.id} key={i++}/>
        ));
    }

    private sensorsSet(): boolean {
        return this.state.sensors == null;
    }
}
