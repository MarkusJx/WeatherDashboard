import {Redirect, Route, Switch, useRouteMatch} from "react-router-dom";
import SensorView from "./SensorView";

export default function Sensors() {
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:sensorId`}>
                <SensorView/>
            </Route>
            <Route path={match.path}>
                <Redirect to="/viewSensors"/>
            </Route>
        </Switch>
    )
}