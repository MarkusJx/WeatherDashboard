import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Logout from "./Logout";
import Sidebar from "../components/Sidebar";

export default function Webpages(): JSX.Element {
    return (
        <Router>
            <Sidebar/>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/logout" component={Logout}/>
            </Switch>
        </Router>
    );
}
