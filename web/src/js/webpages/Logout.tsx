import React from "react";
import {Redirect} from "react-router-dom";
import Credentials from "../util/Credentials";

export default class Logout extends React.Component {
    public render(): React.ReactNode {
        return <Redirect to="/"/>;
    }

    public componentDidMount(): void {
        Credentials.signOut().then();
    }
}