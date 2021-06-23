import React from "react";
import DataTable from "../components/DataTable";
import {AuthSensorDTO, FullSensorDTO} from "../api/v1/DataTransferObjects";
import ISensor from "../api/ISensor";

import {AiOutlineSafetyCertificate} from "react-icons/ai";
import {MDCRipple} from "@material/ripple";
import Dialog from "../components/Dialog";
import Dialogs from "../components/Dialogs";
import {TextButton} from "../util/MDCComponents";

import styles from "../../styles/webpages/ViewSensors.module.scss";
import Credentials from "../util/Credentials";
import IAuth from "../api/IAuth";
import ExpirationDatePicker from "../components/ExpirationDatePicker";

class TableHeader extends React.Component {
    public render(): React.ReactNode {
        return (
            <DataTable.DataTableHead>
                <DataTable.DataTableHeaderRow>
                    {this.props.children}
                </DataTable.DataTableHeaderRow>
            </DataTable.DataTableHead>
        );
    }
}

class Table extends React.Component {
    public render(): React.ReactNode {
        return (
            <DataTable.DataTable>
                <DataTable.DataTableContainer>
                    <DataTable.DataTableTable>
                        {this.props.children}
                    </DataTable.DataTableTable>
                </DataTable.DataTableContainer>
            </DataTable.DataTable>
        );
    }
}

interface TableElementProps {
    name: string;
    location: string;
    id: number;
}

class TableElement extends React.Component<TableElementProps> {
    public render(): React.ReactNode {
        return (
            <DataTable.DataTableRow>
                <DataTable.DataTableCellFirst>
                    {this.props.name}
                </DataTable.DataTableCellFirst>
                <DataTable.DataTableCell>
                    {this.props.location}
                </DataTable.DataTableCell>
                <DataTable.DataTableCell>
                    {this.props.id}
                </DataTable.DataTableCell>
                <DataTable.DataTableCell>
                    <AuthSensorButton sensorId={this.props.id}/>
                </DataTable.DataTableCell>
            </DataTable.DataTableRow>
        );
    }
}

interface SingleTableElementProps {
    text: string;
}

class SingleTableElement extends React.Component<SingleTableElementProps> {
    public render(): React.ReactNode {
        return (
            <DataTable.DataTableRow>
                <DataTable.DataTableCellFirst>
                    {this.props.text}
                </DataTable.DataTableCellFirst>
                <DataTable.DataTableCell/>
                <DataTable.DataTableCell/>
                <DataTable.DataTableCell/>
            </DataTable.DataTableRow>
        );
    }
}

class TableHeaderCell extends DataTable.DataTableHeaderCell {
}

class TableBody extends DataTable.DataTableContent {
}

interface AuthSensorButtonProps {
    sensorId: number;
}

interface AuthSensorButtonState {
    signedIn: boolean;
}

class AuthSensorButton extends React.Component<AuthSensorButtonProps, AuthSensorButtonState> {
    private button: HTMLButtonElement | null = null;

    public constructor(props: AuthSensorButtonProps) {
        super(props);
        this.state = {
            signedIn: false
        };

        this.onAuthClick = this.onAuthClick.bind(this);
        this.signInChange = this.signInChange.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <button className="mdc-icon-button material-icons main-data-table__action-button"
                    onClick={this.onAuthClick} ref={e => this.button = e} disabled={!this.state.signedIn}>
                <AiOutlineSafetyCertificate/>
            </button>
        );
    }

    public componentDidMount(): void {
        MDCRipple.attachTo(this.button!).unbounded = true;
        Credentials.isSignedIn().then(this.signInChange);
        Credentials.listenLogInChange(this.signInChange)
    }

    public componentWillUnmount(): void {
        Credentials.unlistenLogInChange(this.signInChange);
    }

    private onAuthClick(): void {
        dialogRef.get<AuthSensorDialog>().open(this.props.sensorId);
    }

    private signInChange(signedIn: boolean): void {
        this.setState({
            signedIn: signedIn
        });
    }
}

interface AuthDataState {
    value: string;
}

class AuthData extends React.Component<{}, AuthDataState> {
    public constructor(props: {}) {
        super(props);
        this.state = {
            value: "<The token will be displayed in here>"
        }
    }

    public set value(value: string) {
        this.setState({
            value: value
        });
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.auth_data_container}>
                <span>Your token</span>
                <code className={styles.auth_data}>
                    {this.state.value}
                </code>
            </div>
        );
    }
}

export class AuthSensorDialog extends React.Component {
    private container: Dialog.Container | null = null;
    private currentId: number = -1;
    private requestButton: TextButton | null = null;
    private authData: AuthData | null = null;
    private expirationDatePicker: ExpirationDatePicker | null = null;

    public render(): React.ReactNode {
        return (
            <Dialog.Container labelledby="auth-dialog-title" describedby={styles.auth_dialog_content}
                              ref={e => this.container = e}>
                <Dialog.Title id="auth-dialog-title">
                    Authenticate Sensor
                </Dialog.Title>
                <Dialog.Content id={styles.auth_dialog_content}>
                    <ExpirationDatePicker ref={e => this.expirationDatePicker = e}/>
                    <TextButton ref={e => this.requestButton = e}>
                        Request token
                    </TextButton>
                    <AuthData ref={e => this.authData = e}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Dialog.Button action="accept">
                        Ok
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog.Container>
        );
    }

    public componentDidMount(): void {
        this.requestButton!.button.addEventListener('click', async () => {
            this.requestButton!.button.disabled = true;
            this.authData!.value = "Please wait...";

            await Credentials.refreshToken();
            const token: string | null = Credentials.getToken();

            const expirationDate: Date | null = this.expirationDatePicker!.value;
            expirationDate?.setHours(0, 0, 0, 0);
            const data: AuthSensorDTO = {
                expiration: expirationDate !== null ? Math.round(expirationDate.getTime() / 1000) : null,
                sensorId: this.currentId
            };

            try {
                this.authData!.value = await IAuth.getInstance().authSensor(data, token!);
            } catch (e) {
                this.authData!.value = `Error: ${e.message}`;
            } finally {
                this.requestButton!.button.disabled = false;
            }
        });

        this.container!.dialog!.listen('MDCDialog:closed', () => {
            this.requestButton!.button.disabled = false;
            this.expirationDatePicker!.value = null;
            this.authData!.value = "<The token will be displayed in here>";
        });
    }

    public open(id: number): void {
        this.currentId = id;
        this.container?.dialog?.open();
    }
}

const dialogRef = Dialogs.addDialog(AuthSensorDialog);

interface ViewSensorsState {
    sensors: FullSensorDTO[] | null;
}

export default class ViewSensors extends React.Component<{}, ViewSensorsState> {
    public constructor(props: {}) {
        super(props);

        this.state = {
            sensors: null
        };
    }

    public render(): React.ReactNode {
        return (
            <Table>
                <TableHeader>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Location</TableHeaderCell>
                    <TableHeaderCell>Id</TableHeaderCell>
                    <TableHeaderCell>Generate token</TableHeaderCell>
                </TableHeader>
                <TableBody>
                    {this.getElements()}
                </TableBody>
            </Table>
        );
    }

    public componentDidMount(): void {
        ISensor.getInstance().listSensors().then(sensors => {
            this.setState({
                sensors: sensors
            });
        })
    }

    private getElements(): React.ReactNode | React.ReactNode[] {
        if (this.state.sensors !== null) {
            if (this.state.sensors.length === 0) {
                return (
                    <SingleTableElement text="There's nothing here to display"/>
                );
            } else {
                return this.state.sensors
                    .map((s, i) =>
                        <TableElement name={s.name} location={s.location} id={s.id} key={i}/>);
            }
        } else {
            return (
                <SingleTableElement text="Loading..."/>
            );
        }
    }
}