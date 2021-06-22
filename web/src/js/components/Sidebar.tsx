import React from "react";
import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader, SubMenu} from 'react-pro-sidebar';
import {Link} from "react-router-dom";
import {FaHome} from "react-icons/fa";
import {IoLogInOutline, IoLogOutOutline} from "react-icons/io5";
import {AiOutlineEdit} from "react-icons/ai";

import 'react-pro-sidebar/dist/css/styles.css';
import styles from "../../styles/components/Sidebar.module.scss";
import Credentials from "../util/Credentials";

interface SidebarState {
    isSignedIn: boolean;
}

export default class Sidebar extends React.Component<{}, SidebarState> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false
        };

        this.updateState = this.updateState.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <ProSidebar>
                <SidebarHeader>
                    <h3 className={styles.heading}>
                        Sensor Dashboard
                    </h3>
                </SidebarHeader>
                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem icon={<FaHome/>}>
                            Home
                            <Link to="/"/>
                        </MenuItem>
                        <SubMenu title="Components">
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </SubMenu>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu iconShape="circle">
                        {this.getFooter()}
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        );
    }

    public async componentDidMount(): Promise<void> {
        this.updateState(await Credentials.isSignedIn());
        Credentials.listenLogInChange(this.updateState);
    }

    public componentWillUnmount(): void {
        Credentials.unlistenLogInChange(this.updateState);
    }

    private getFooter(): React.ReactNode {
        if (this.state.isSignedIn) {
            return (
                <MenuItem icon={<IoLogOutOutline/>}>
                    Logout
                    <Link to="/logout"/>
                </MenuItem>
            );
        } else {
            return (
                <>
                    <MenuItem icon={<IoLogInOutline/>}>
                        Login
                        <Link to="/login"/>
                    </MenuItem>
                    <MenuItem icon={<AiOutlineEdit/>}>
                        Register
                        <Link to="/register"/>
                    </MenuItem>
                </>
            );
        }
    }

    private updateState(signedIn: boolean): void {
        this.setState({
            isSignedIn: signedIn
        });
    }
}