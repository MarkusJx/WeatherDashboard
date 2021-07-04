import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Logout from "./Logout";
import Sidebar from "../components/Sidebar";
import Unauthorized from "./Unauthorized";
import AddSensor from "./AddSensor";
import ViewSensors from "./ViewSensors";
import NotFound from "./NotFound";
import GenerateConfig from "./GenerateConfig";
import Dialogs from "../components/Dialogs";

import styles from "../../styles/webpages/Webpages.module.scss";
import Sensors from "./sensors/Sensors";

export default function Webpages(): JSX.Element {
    return (
        <Router>
            <Sidebar/>
            <div className={styles.content}>
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/addSensor" component={AddSensor}/>
                    <Route path="/viewSensors" component={ViewSensors}/>
                    <Route path="/generateConfig" component={GenerateConfig}/>
                    <Route path="/sensors" component={Sensors}/>
                    <Route path="/unauthorized" component={Unauthorized}/>
                    <Route component={NotFound}/>
                </Switch>
            </div>
            <Dialogs/>
        </Router>
    );
}
