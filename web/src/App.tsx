import './styles/App.css';
import React from "react";
import {CartesianGrid, Line, Tooltip, XAxis, LineChart} from "recharts";

export default class App extends React.Component {
    public render(): React.ReactNode {
        return (
            <div className="App">
                <LineChart width={400} height={400} data={[]} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                    <XAxis dataKey="name"/>
                    <Tooltip/>
                    <CartesianGrid stroke="#f5f5f5"/>
                    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0}/>
                    <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1}/>
                </LineChart>
            </div>
        );
    }
}

