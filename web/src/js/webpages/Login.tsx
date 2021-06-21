import React from "react";

import styles from "../../styles/webpages/Login.module.scss";
import {Checkbox, OutlinedTextField, Snackbar, TextButton} from "../util/MDCComponents";
import Config from "../util/Config";
import Credentials from "../util/Credentials";

interface AuthUserDTO {
    email: string;
    password: string;
    keepSignedIn: boolean;
}

interface LoginProps {
    history: string[];
}

export default class Login extends React.Component<LoginProps> {
    private emailTextField: OutlinedTextField | null = null;
    private passwordTextField: OutlinedTextField | null = null;
    private checkbox: Checkbox | null = null;
    private snackbar: Snackbar | null = null;

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
                    <OutlinedTextField id={"login-pass-text-field"} labelId={"login-pass-text-field-label"}
                                       required={true} minLength={8} ref={e => this.passwordTextField = e}
                                       type="password" name="password">
                        Password
                    </OutlinedTextField>
                    <div className={styles.keep_signed_in_container}>
                        <span>Keep signed in:</span>
                        <Checkbox ref={e => this.checkbox = e}/>
                    </div>
                    <TextButton id={styles.login_button}>
                        Login
                    </TextButton>
                </form>
                <Snackbar ref={e => this.snackbar = e}>
                    Could not sign in
                </Snackbar>
            </>
        );
    }

    public componentDidMount(): void {
        if (Credentials.isSignedIn()) {
            this.props.history.push('/');
        } else {
            document.title = "Login";
        }
    }

    private onClick(event: any): boolean {
        event.preventDefault();
        const data: AuthUserDTO = {
            email: this.emailTextField?.textField?.value as string,
            password: this.passwordTextField?.textField?.value as string,
            keepSignedIn: this.checkbox?.checkbox?.checked as boolean
        };

        fetch(`${Config.SERVER_URL}/api/v1/auth/authUser`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({'Content-Type': 'application/json'})
        }).then(r => {
            if (r.ok) {
                r.text().then(Credentials.signIn).then(() => {
                    this.props.history.push('/');
                });
            } else {
                this.snackbar?.open();
            }
        });

        return false;
    }
}