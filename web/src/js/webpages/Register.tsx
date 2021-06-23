import React from "react";

import {
    ITextField,
    LinearProgress,
    OutlinedTextField,
    PasswordOutlinedTextField,
    TextButton
} from "../util/MDCComponents";
import {Checkmark} from "../components/MiscComponents";
import {Link} from "react-router-dom";

import styles from "../../styles/webpages/Register.module.scss";
import navbarStyles from "../../styles/components/Navbar.module.scss";
import Credentials from "../util/Credentials";
import {UserDTO} from "../api/v1/DataTransferObjects";
import IAuth from "../api/IAuth";

interface RegisterProps {
    history: string[];
}

export default class Register extends React.Component<RegisterProps> {
    private emailTextField: ITextField | null = null;
    private firstNameTextField: ITextField | null = null;
    private lastNameTextField: ITextField | null = null;
    private passwordTextField: ITextField | null = null;
    private repeatPasswordTextField: ITextField | null = null;
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

                    <form className={styles.register_form} action="" method="post" onSubmit={this.onClick}>
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
                        <PasswordOutlinedTextField id="password-text-field" labelId="password-text-field-label"
                                                   minLength={8} required={true} ref={e => this.passwordTextField = e}
                                                   name="password">
                            Password
                        </PasswordOutlinedTextField>
                        <PasswordOutlinedTextField id="repeat-password-text-field" minLength={8} required={true}
                                                   labelId="repeat-password-text-field-label" name="repeat-password"
                                                   ref={e => this.repeatPasswordTextField = e}>
                            Repeat password
                        </PasswordOutlinedTextField>

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

    public async componentDidMount(): Promise<void> {
        if (await Credentials.isSignedIn()) {
            this.props.history.push('/');
            return;
        }

        document.title = "Register";
        this.progressBar!.progressBar.progress = 0;

        const validatePassword = () => {
            if (this.passwordTextField?.textField?.value !== this.repeatPasswordTextField?.textField?.value) {
                this.repeatPasswordTextField!.input!.setCustomValidity("Passwords Don't Match");
            } else {
                this.repeatPasswordTextField!.input!.setCustomValidity('');
            }
        }

        this.passwordTextField!.input!.onchange = validatePassword;
        this.repeatPasswordTextField!.input!.onchange = validatePassword;
    }

    private onClick(event: any): boolean {
        event.preventDefault();
        this.registerButton!.button.disabled = true;
        this.progressBar!.progressBar.determinate = false;

        const data: UserDTO = {
            firstName: this.firstNameTextField?.textField?.value!,
            lastName: this.lastNameTextField?.textField?.value!,
            email: this.emailTextField?.textField?.value!,
            password: this.passwordTextField?.textField?.value!
        };

        const before = () => {
            this.progressBar!.progressBar.determinate = true;
            setTimeout(() => {
                this.checkmark!.animate();
                this.progressBar!.progressBar.progress = 1;
            }, 250);
        };

        IAuth.getInstance().registerUser(data)
            .then(() => {
                before();
                this.slideContainer!.classList.add(styles.right);
                this.registerButton!.button.disabled = false;
            })
            .catch(() => {
                before();
                setTimeout(() => {
                    this.progressBar!.element!.style.setProperty("--mdc-theme-primary", "#ff2800");
                }, 250);
                this.slideContainer!.classList.add(styles.left);
                this.registerButton!.button.disabled = false;
            });

        return false;
    }
}