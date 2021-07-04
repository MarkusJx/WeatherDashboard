import React from "react";
import ISensorData, {SensorData} from "../../api/ISensorData";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import styles from "../../../styles/SensorData.module.scss";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface SensorViewRoute {
    sensorId: string;
}

interface SensorViewState {
    data: SensorData[] | null;
}

class SensorView extends React.Component<RouteComponentProps<SensorViewRoute>, SensorViewState> {
    public constructor(props: RouteComponentProps<SensorViewRoute>) {
        super(props);

        this.state = {
            data: null
        };
    }

    public render(): React.ReactNode {
        if (this.state.data !== null) {
            return (
                <>
                    <SensorDataChart data={this.state.data.map(d => d.temperature)} title="Temperature values"
                                     timestamps={this.state.data.map(d => d.time)} name="Temperature (°C)"
                                     yAxis="Temperature (°C)"/>
                    <SensorDataChart data={this.state.data.map(d => d.humidity)} title="Humidity values"
                                     timestamps={this.state.data.map(d => d.time)} name="Humidity (%)"
                                     yAxis="Humidity (%)"/>
                </>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

    public async componentDidMount(): Promise<void> {
        this.setState({
            data: await ISensorData.fetchData(Number(this.props.match.params.sensorId), 50)
        });
    }
}

interface SensorDataChartProps {
    data: number[];
    timestamps: string[];
    title: string;
    name: string;
    yAxis: string;
}

class SensorDataChart extends React.Component<SensorDataChartProps> {
    public render(): React.ReactNode {
        if (this.props.data.length > 0) {
            const options = {
                chart: {
                    type: 'spline'
                },
                title: {
                    text: this.props.title
                },
                series: [
                    {
                        name: this.props.name,
                        data: this.props.data
                    }
                ],
                xAxis: {
                    categories: this.props.timestamps
                },
                yAxis: {
                    title: {
                        text: this.props.yAxis
                    }
                },
                plotOptions: {
                    spline: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true,
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },
            };

            return (
                <HighchartsReact highcharts={Highcharts} options={options}/>
            );
        } else {
            return (
                <div className={styles.nodata}>
                    <h3 className={styles.text}>No data available</h3>
                </div>
            );
        }
    }
}

export default withRouter(SensorView);