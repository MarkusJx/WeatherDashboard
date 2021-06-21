import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import App from "./App";
import Login from "./Login";
import Navbar from "../components/Navbar";
import Register from "./Register";

export default function Webpages(): JSX.Element {
    return (
        <Router>
            <Navbar/>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
            </Switch>
        </Router>
    );
}
