import React from "react";

import styles from "../../styles/webpages/Login.module.scss";
import {
    Checkbox,
    ITextField,
    OutlinedTextField,
    PasswordOutlinedTextField,
    Snackbar,
    TextButton
} from "../util/MDCComponents";
import Credentials from "../util/Credentials";
import {AuthUserDTO} from "../apiV1/DataTransferObjects";
import IAuth from "../apiV1/IAuth";

interface LoginProps {
    history: string[];
}

export default class Login extends React.Component<LoginProps> {
    private emailTextField: ITextField | null = null;
    private passwordTextField: ITextField | null = null;
    private checkbox: Checkbox | null = null;
    private snackbar: Snackbar | null = null;
    private loginButton: TextButton | null = null;

    public constructor(props: LoginProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <>
                <form className={styles.login} action="" method="get" onSubmit={this.onClick}>
                    <h1>Login</h1>
                    <OutlinedTextField id={"login-email-text-field"} labelId={"login-email-text-field-label"}
                                       required={true} minLength={4} ref={e => this.emailTextField = e} type="email"
                                       name="email">
                        Email
                    </OutlinedTextField>
                    <PasswordOutlinedTextField id={"login-pass-text-field"} labelId={"login-pass-text-field-label"}
                                       required={true} minLength={8} ref={e => this.passwordTextField = e}
                                       name="password">
                        Password
                    </PasswordOutlinedTextField>
                    <div className={styles.keep_signed_in_container}>
                        <span>Keep signed in:</span>
                        <Checkbox ref={e => this.checkbox = e}/>
                    </div>
                    <TextButton id={styles.login_button} ref={e => this.loginButton = e}>
                        Login
                    </TextButton>
                </form>
                <Snackbar ref={e => this.snackbar = e}>
                    Could not sign in
                </Snackbar>
            </>
        );
    }

    public async componentDidMount(): Promise<void> {
        if (await Credentials.isSignedIn()) {
            this.props.history.push('/');
        } else {
            document.title = "Login";
        }
    }

    private onClick(event: any): boolean {
        event.preventDefault();
        const data: AuthUserDTO = {
            email: this.emailTextField!.textField.value,
            password: this.passwordTextField!.textField.value,
            keepSignedIn: this.checkbox!.checkbox.checked
        };

        this.loginButton!.button.disabled = true;
        IAuth.getInstance().loginUser(data)
            .then(Credentials.signIn)
            .then(() => this.props.history.push('/'))
            .catch(() => {
                this.snackbar!.open();
                this.loginButton!.button.disabled = false;
            });

        return false;
    }
}