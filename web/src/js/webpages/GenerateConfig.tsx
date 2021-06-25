import React from "react";
import {
    Checkbox,
    ITextField,
    OutlinedTextField,
    PasswordOutlinedTextField,
    Snackbar,
    TextButton
} from "../util/MDCComponents";
import Util from "../util/Util";

import styles from "../../styles/webpages/GenerateConfig.module.scss";
import ExpirationDatePicker from "../components/ExpirationDatePicker";
import Credentials from "../util/Credentials";
import {AuthSensorDTO} from "../api/v1/DataTransferObjects";
import IAuth from "../api/IAuth";
import Dialog from "../components/Dialog";
import Dialogs from "../components/Dialogs";
import {Redirect} from "react-router-dom";

interface GenerateConfigState {
    signedIn: boolean | null;
}

export default class GenerateConfig extends React.Component<{}, GenerateConfigState> {
    private wifiSsidField: ITextField | null = null;
    private wifiPasswordField: ITextField | null = null;
    private dhtPinField: ITextField | null = null;
    private dhtTypeField: ITextField | null = null;
    private sendIntervalField: ITextField | null = null;
    private hostnameField: ITextField | null = null;
    private ntpServerField: ITextField | null = null;
    private utcOffsetField: ITextField | null = null;
    private apiUrlField: ITextField | null = null;
    private apiPortField: ITextField | null = null;
    private sensorIdField: ITextField | null = null;
    private sslCheckbox: Checkbox | null = null;
    private expirationPicker: ExpirationDatePicker | null = null;
    private submitButton: TextButton | null = null;
    private errorSnackbar: Snackbar | null = null;

    public constructor(props: {}) {
        super(props);
        this.state = {
            signedIn: null
        };

        this.submit = this.submit.bind(this);
    }

    private set disabled(disabled: boolean) {
        this.wifiSsidField!.textField.disabled = disabled;
        this.wifiPasswordField!.textField.disabled = disabled;
        this.dhtPinField!.textField.disabled = disabled;
        this.dhtTypeField!.textField.disabled = disabled;
        this.sendIntervalField!.textField.disabled = disabled;
        this.hostnameField!.textField.disabled = disabled;
        this.ntpServerField!.textField.disabled = disabled;
        this.utcOffsetField!.textField.disabled = disabled;
        this.apiUrlField!.textField.disabled = disabled;
        this.apiPortField!.textField.disabled = disabled;
        this.sensorIdField!.textField.disabled = disabled;
        this.sslCheckbox!.checkbox.disabled = disabled;
        this.submitButton!.button.disabled = disabled;
    }

    public render(): React.ReactNode {
        if (this.state.signedIn !== false) {
            return (
                <>
                    <form method="post" className={styles.generate_config_form} onSubmit={this.submit}>
                        <h1>Generate a config file for a sensor</h1>
                        <OutlinedTextField required ref={e => this.wifiSsidField = e}>
                            WiFi SSID
                        </OutlinedTextField>
                        <PasswordOutlinedTextField required ref={e => this.wifiPasswordField = e}>
                            WiFi password
                        </PasswordOutlinedTextField>
                        <OutlinedTextField required ref={e => this.dhtPinField = e} type="number" min={0}>
                            Sensor Pin
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.dhtTypeField = e}>
                            DHT Type
                        </OutlinedTextField>
                        <OutlinedTextField required type="number" ref={e => this.sendIntervalField = e} min={1}>
                            Send interval (seconds)
                        </OutlinedTextField>
                        <div className={styles.use_ssl_container}>
                            <div className={styles.use_ssl_content}>
                                <span>Use SSL:</span>
                                <Checkbox ref={e => this.sslCheckbox = e}/>
                            </div>
                        </div>
                        <OutlinedTextField required ref={e => this.hostnameField = e}>
                            Hostname
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.ntpServerField = e}>
                            NTP Server
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.utcOffsetField = e} type="number">
                            UTC Offset
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.apiUrlField = e}>
                            API Url
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.apiPortField = e} type="number" min={0}>
                            API Port
                        </OutlinedTextField>
                        <OutlinedTextField required ref={e => this.sensorIdField = e} type="number" min={1}>
                            Sensor ID
                        </OutlinedTextField>
                        <ExpirationDatePicker ref={e => this.expirationPicker = e} style={{gridColumn: '1/3'}}
                                              title="Token expiration date:"/>

                        <TextButton ref={e => this.submitButton = e}>
                            Generate
                        </TextButton>
                    </form>
                    <Snackbar ref={e => this.errorSnackbar = e}/>
                </>
            );
        } else {
            return (
                <Redirect to="/unauthorized"/>
            );
        }
    }

    public async componentDidMount(): Promise<void> {
        this.disabled = true;
        const signedIn: boolean = await Credentials.isSignedIn();
        this.setState({
            signedIn: signedIn
        });

        if (!signedIn) return;

        this.dhtPinField!.textField.value = "5";
        this.dhtTypeField!.textField.value = "DHT11";
        this.sendIntervalField!.textField.value = "60";
        this.ntpServerField!.textField.value = "pool.ntp.org";
        this.utcOffsetField!.textField.value = String(Util.getUtcOffset() * 60);
        this.apiUrlField!.textField.value = window.location.hostname;
        this.apiPortField!.textField.value = window.location.port.length === 0 ? "80" : window.location.port;
        this.sslCheckbox!.checkbox.checked = window.location.protocol === 'https:';
        this.disabled = false;
    }

    private async submit(event: any): Promise<void> {
        event.preventDefault();
        this.disabled = true;

        await Credentials.refreshToken();
        const token: string | null = Credentials.getToken();

        const expirationDate: Date | null = this.expirationPicker!.value;
        expirationDate?.setHours(0, 0, 0, 0);
        const data: AuthSensorDTO = {
            expiration: expirationDate !== null ? Math.round(expirationDate.getTime() / 1000) : null,
            sensorId: Number(this.sensorIdField!.textField.value)
        };

        try {
            const configData: GeneratedConfigProps = {
                utc_offset: Number(this.utcOffsetField!.textField.value),
                ssl: this.sslCheckbox!.checkbox.checked,
                ssid: this.wifiSsidField!.textField.value,
                sleep: Number(this.sendIntervalField!.textField.value),
                sensor_id: Number(this.sensorIdField!.textField.value),
                password: this.wifiPasswordField!.textField.value,
                jwt_token: await IAuth.getInstance().authSensor(data, token!),
                ntp_server: this.ntpServerField!.textField.value,
                hostname: this.hostnameField!.textField.value,
                dht_type: this.dhtTypeField!.textField.value,
                dht_pin: this.dhtPinField!.textField.value,
                api_url: this.apiUrlField!.textField.value,
                api_port: Number(this.apiPortField!.textField.value),
            };

            dialogRef.get<GeneratedConfig>().open(configData);
        } catch (e) {
            this.errorSnackbar!.snackbar.labelText = `Could not generate the config. Error: ${e.message}`;
            this.errorSnackbar!.open();
        } finally {
            this.disabled = false;
        }
    }
}

interface GeneratedConfigProps {
    ssid: string;
    password: string;
    dht_pin: string;
    dht_type: string;
    sleep: number;
    ssl: boolean;
    hostname: string;
    jwt_token: string;
    ntp_server: string;
    utc_offset: number;
    api_url: string;
    api_port: number;
    sensor_id: number;
}

class GeneratedConfig extends React.Component {
    private codeElement: HTMLElement | null = null;
    private container: Dialog.Container | null = null;

    public render() {
        return (
            <Dialog.Container labelledby="generated-config-title" describedby="generated-config-surface"
                              ref={e => this.container = e} surfaceStyle={{maxWidth: '1200px'}}>
                <Dialog.Title id="generated-config-title">
                    Here's your generated config file
                </Dialog.Title>
                <Dialog.Content id="generated-config-surface">
                    <code className={styles.generated_config} ref={e => this.codeElement = e}/>
                </Dialog.Content>
                <Dialog.Actions>
                    <Dialog.Button action="accept">
                        Ok
                    </Dialog.Button>
                </Dialog.Actions>
            </Dialog.Container>
        );
    }

    public open(data: GeneratedConfigProps): void {
        let api_url: string;
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g.test(data.api_url)) {
            const parts: string[] = data.api_url.split('.');
            api_url = `IPAddress api_url(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parts[3]});`;
        } else {
            api_url = `const char *api_url = "${data.api_url}";`;
        }

        this.codeElement!.innerText = `// DHT definitions
#define DHTPIN D${data.dht_pin}         // pin of the arduino where the sensor is connected to
#define DHTTYPE ${data.dht_type}     // define the type of sensor (DHT11 or DHT22)

// The delay between sending values in seconds
#define SLEEP_SECONDS ${data.sleep}

// Whether to use ssl
const bool ssl = ${data.ssl};

// The hostname of this wifi client
const char *hostname = "${data.hostname}";

// WiFi credentials
const char* ssid = "${data.ssid}";
const char* password = "${data.password}";

// NTP server address
const char *ntp_server = "${data.ntp_server}";

// The utc offset in seconds
const long utcOffsetInSeconds = ${data.utc_offset};

// The jwt authentication token
const String auth_token = "${data.jwt_token}";
// The id of this sensor
const int sensor_id = ${data.sensor_id};

// The api url and port
${api_url}
const uint16_t api_port = ${data.api_port};
        `;

        this.container!.dialog!.open();
    }
}

const dialogRef = Dialogs.addDialog(GeneratedConfig);
