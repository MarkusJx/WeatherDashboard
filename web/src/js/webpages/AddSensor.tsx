import React from "react";
import Credentials from "../util/Credentials";
import {Redirect} from "react-router-dom";

import styles from "../../styles/webpages/AddSensor.module.scss";
import {ITextField, LinearProgress, OutlinedTextField, Snackbar, TextButton} from "../util/MDCComponents";
import {SensorDTO} from "../api/v1/DataTransferObjects";
import ISensor from "../api/ISensor";

interface AddSensorState {
    signedIn: boolean | null;
}

export default class AddSensor extends React.Component<{}, AddSensorState> {
    private progressBar: LinearProgress | null = null;
    private nameTextField: ITextField | null = null;
    private locationTextField: ITextField | null = null;
    private submitButton: TextButton | null = null;
    private snackbar: Snackbar | null = null;

    public constructor(props: {}) {
        super(props);
        this.state = {
            signedIn: null
        };

        this.onClick = this.onClick.bind(this);
    }

    private set disabled(disabled: boolean) {
        if (this.progressBar !== null)
            this.progressBar.progressBar.determinate = !disabled;
        if (this.nameTextField !== null)
            this.nameTextField.textField.disabled = disabled;
        if (this.locationTextField !== null)
            this.locationTextField.textField.disabled = disabled;
        if (this.submitButton !== null)
            this.submitButton.button.disabled = disabled;
    }

    public render(): React.ReactNode {
        if (this.state.signedIn !== false) {
            return (
                <>
                    <div className={styles.create_sensor}>
                        <LinearProgress ref={e => this.progressBar = e} indeterminate={true}/>
                        <h1>Register a new sensor</h1>
                        <form action="" method="post" onSubmit={this.onClick} className={styles.form}>
                            <OutlinedTextField id="sensor-name-text-field" labelId="sensor-name-text-field-label"
                                               minLength={4} required={true} ref={e => this.nameTextField = e}
                                               name="name" type="text" maxLength={32} disabled={true}>
                                Sensor name
                            </OutlinedTextField>
                            <OutlinedTextField id="sensor-location-text-field"
                                               labelId="sensor-location-text-field-label"
                                               minLength={4} required={true} ref={e => this.locationTextField = e}
                                               name="location" type="text" maxLength={32} disabled={true}>
                                Location
                            </OutlinedTextField>
                            <TextButton id={styles.submit_button} disabled={true} ref={e => this.submitButton = e}>
                                Submit
                            </TextButton>
                        </form>
                    </div>
                    <Snackbar ref={e => this.snackbar = e}/>
                </>
            );
        } else {
            return (
                <Redirect to="/unauthorized"/>
            );
        }
    }

    public async componentDidMount(): Promise<void> {
        const signedIn: boolean = await Credentials.isSignedIn();
        this.setState({
            signedIn: signedIn
        });

        this.disabled = false;
    }

    private async onClick(event: any): Promise<void> {
        event.preventDefault();
        this.disabled = true;
        const data: SensorDTO = {
            name: this.nameTextField?.textField?.value!,
            location: this.locationTextField?.textField?.value!
        };

        await Credentials.refreshToken();
        const token: string | null = Credentials.getToken();
        try {
            const id: number = await ISensor.getInstance().addSensor(data, token!);
            this.snackbar!.snackbar.labelText = `Successfully registered the sensor. Id: '${id}'`;
            this.snackbar!.open();
            this.nameTextField!.textField.value = "";
            this.locationTextField!.textField.value = "";
        } catch (e) {
            this.snackbar!.snackbar.labelText = `Could not register the sensor. Error: ${e.message}`;
            this.snackbar!.open();
        }
        this.disabled = false;
    }
}