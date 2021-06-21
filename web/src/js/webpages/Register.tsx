import React from "react";

import {LinearProgress, OutlinedTextField, TextButton} from "../util/MDCComponents";
import Config from "../util/Config";
import {Checkmark} from "../components/MiscComponents";
import {Link} from "react-router-dom";

import styles from "../../styles/webpages/Register.module.scss";
import navbarStyles from "../../styles/components/Navbar.module.scss";
import Credentials from "../util/Credentials";

interface UserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface RegisterProps {
    history: string[];
}

export default class Register extends React.Component<RegisterProps> {
    private emailTextField: OutlinedTextField | null = null;
    private firstNameTextField: OutlinedTextField | null = null;
    private lastNameTextField: OutlinedTextField | null = null;
    private passwordTextField: OutlinedTextField | null = null;
    private repeatPasswordTextField: OutlinedTextField | null = null;
    private registerButton: TextButton | null = null;

    private progressBar: LinearProgress | null = null;
    private slideContainer: HTMLDivElement | null = null;
    private checkmark: Checkmark | null = null;

    public constructor(props: RegisterProps) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.register}>
                <LinearProgress ref={e => this.progressBar = e}/>
                <div className={styles.slide_container} ref={e => this.slideContainer = e}>
                    <div className={styles.register_failed}>
                        <h1 className={styles.heading}>Registration failed</h1>
                        <p>
                            Could not register a new user.
                            You may want to retry again in a few minutes.
                        </p>
                    </div>

                    <form className={styles.register_form} action="" method="get" onSubmit={this.onClick}>
                        <h1 className={styles.heading}>Register a new account</h1>

                        <OutlinedTextField id="email-text-field" labelId="email-text-field-label" type="email"
                                           minLength={4} required={true} ref={e => this.emailTextField = e}
                                           name="email">
                            Email
                        </OutlinedTextField>
                        <div className={styles.first_last_name_container}>
                            <OutlinedTextField id="first-name-text-field" labelId="first-name-text-field-label"
                                               minLength={2} required={true} ref={e => this.firstNameTextField = e}
                                               name="first-name">
                                First name
                            </OutlinedTextField>
                            <OutlinedTextField id="last-name-text-field" labelId="last-name-text-field-label"
                                               minLength={2} required={true} ref={e => this.lastNameTextField = e}
                                               name="last-name">
                                Last name
                            </OutlinedTextField>
                        </div>
                        <OutlinedTextField id="password-text-field" labelId="password-text-field-label" type="password"
                                           minLength={8} required={true} ref={e => this.passwordTextField = e}
                                           name="password">
                            Password
                        </OutlinedTextField>
                        <OutlinedTextField id="repeat-password-text-field" labelId="repeat-password-text-field-label"
                                           type="password" name="repeat-password"
                                           minLength={8} required={true} ref={e => this.repeatPasswordTextField = e}>
                            Repeat password
                        </OutlinedTextField>

                        <TextButton ref={e => this.registerButton = e} id={styles.register_button}>
                            Register
                        </TextButton>
                    </form>

                    <div className={styles.register_registered}>
                        <h1 className={styles.heading}>Successfully registered</h1>
                        <Checkmark ref={e => this.checkmark = e}/>
                        <p>
                            Your user account was successfully created. You may want to
                            <Link to={'/login'} className={navbarStyles.nav_link_inline}>
                                Login
                            </Link>
                            now.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        if (Credentials.isSignedIn()) {
            this.props.history.push('/');
            return;
        }

        document.title = "Register";
        (this.progressBar as LinearProgress).progressBar.progress = 0;

        const validatePassword = () => {
            if (this.passwordTextField?.textField?.value !== this.repeatPasswordTextField?.textField?.value) {
                (this.repeatPasswordTextField?.input as HTMLInputElement).setCustomValidity("Passwords Don't Match");
            } else {
                (this.repeatPasswordTextField?.input as HTMLInputElement).setCustomValidity('');
            }
        }

        (this.passwordTextField?.input as HTMLInputElement).onchange = validatePassword;
        (this.repeatPasswordTextField?.input as HTMLInputElement).onchange = validatePassword;
    }

    private onClick(event: any): boolean {
        event.preventDefault();
        (this.registerButton?.button as HTMLButtonElement).disabled = true;
        (this.progressBar as LinearProgress).progressBar.determinate = false;

        const data: UserDTO = {
            firstName: this.firstNameTextField?.textField?.value as string,
            lastName: this.lastNameTextField?.textField?.value as string,
            email: this.emailTextField?.textField?.value as string,
            password: this.passwordTextField?.textField?.value as string
        };

        fetch(`${Config.SERVER_URL}/api/v1/auth/registerUser`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({'content-type': 'application/json'})
        }).then(r => {
            (this.progressBar as LinearProgress).progressBar.determinate = true;
            setTimeout(() => {
                this.checkmark?.animate();
                (this.progressBar as LinearProgress).progressBar.progress = 1;
            }, 250);

            if (r.ok) {
                this.slideContainer?.classList?.add(styles.right);
            } else {
                setTimeout(() => {
                    (this.progressBar?.element as HTMLDivElement)
                        .style
                        .setProperty("--mdc-theme-primary", "#ff2800");
                }, 250);
                this.slideContainer?.classList?.add(styles.left);
            }

            (this.registerButton?.button as HTMLButtonElement).disabled = false;
        });

        return false;
    }
}