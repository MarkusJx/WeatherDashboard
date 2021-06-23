import React from "react";

import "../../styles/MDCComponents.scss";
import styles from "../../styles/MDCComponents.module.scss";

import {MDCTextField} from "@material/textfield";
import {MDCRipple} from "@material/ripple";
import {MDCLinearProgress} from "@material/linear-progress";
import {MDCCheckbox} from "@material/checkbox";
import {MDCSnackbar} from '@material/snackbar';

import {MdVisibility} from "react-icons/md";

/**
 * Any ye olde text field
 */
export interface ITextField {
    /**
     * Get the underlying mdc text field element
     *
     * @return the mdc text field instance
     */
    get textField(): MDCTextField;

    /**
     * Get the text field input element
     *
     * @return the input element
     */
    get input(): HTMLInputElement;
}

/**
 * Properties for a outlined text field
 */
interface OutlinedTextFieldProps extends PasswordOutlinedTextFieldProps {
    // The text field type
    type?: string;
}

/**
 * A outlined text field
 */
export class OutlinedTextField extends React.Component<OutlinedTextFieldProps> implements ITextField {
    /**
     * The html text field element
     * @private
     */
    private element: HTMLElement | null = null;

    /**
     * The mdc text field instance
     */
    public _textField: MDCTextField | null = null;

    public get textField(): MDCTextField {
        return this._textField!;
    }

    /**
     * The text field input element
     */
    public _input: HTMLInputElement | null = null;

    public get input(): HTMLInputElement {
        return this._input!;
    }

    public render() {
        return (
            <label className="mdc-text-field mdc-text-field--outlined" ref={e => this.element = e} id={this.props.id}>
                <span className="mdc-notched-outline">
                    <span className="mdc-notched-outline__leading"/>
                    <span className="mdc-notched-outline__notch">
                        <span className="mdc-floating-label" id={this.props.labelId}>
                            {this.props.children}
                        </span>
                    </span>
                    <span className="mdc-notched-outline__trailing"/>
                </span>
                <input type={this.props.type ? this.props.type : "text"} className="mdc-text-field__input"
                       minLength={this.props.minLength} aria-labelledby={this.props.labelId}
                       maxLength={this.props.maxLength} required={this.props.required === true}
                       name={this.props.name} ref={e => this._input = e} disabled={this.props.disabled}/>
            </label>
        );
    }

    public componentDidMount(): void {
        this._textField = new MDCTextField(this.element!);
    }
}

interface PasswordOutlinedTextFieldProps {
    // The text field id
    id?: string;
    // The text field label id
    labelId?: string;
    // The text field min length
    minLength?: number;
    // The text field max length
    maxLength?: number;
    // Whether this field is required
    required?: boolean;
    // The text field name
    name?: string;
    // Whether the text field is disabled
    disabled?: boolean;
}

/**
 * A outlined password text field
 */
export class PasswordOutlinedTextField extends React.Component<PasswordOutlinedTextFieldProps> implements ITextField {
    /**
     * The html text field element
     * @private
     */
    private element: HTMLElement | null = null;

    /**
     * The visibility icon container element
     * @private
     */
    private iconContainer: HTMLSpanElement | null = null;

    /**
     * The mdc text field instance
     */
    private _textField: MDCTextField | null = null;

    public get textField(): MDCTextField {
        return this._textField!;
    }

    /**
     * The text field input element
     */
    private _input: HTMLInputElement | null = null;

    public get input(): HTMLInputElement {
        return this._input!;
    }

    public render() {
        return (
            <label className="mdc-text-field mdc-text-field--outlined mdc-text-field--with-trailing-icon"
                   ref={e => this.element = e} id={this.props.id}>
                <span className="mdc-notched-outline">
                    <span className="mdc-notched-outline__leading"/>
                    <span className="mdc-notched-outline__notch">
                        <span className="mdc-floating-label" id={this.props.labelId}>
                            {this.props.children}
                        </span>
                    </span>
                    <span className="mdc-notched-outline__trailing"/>
                </span>
                <input type="password" className="mdc-text-field__input" maxLength={this.props.maxLength}
                       minLength={this.props.minLength} aria-labelledby={this.props.labelId}
                       disabled={this.props.disabled}
                       required={this.props.required === true} name={this.props.name} ref={e => this._input = e}/>
                <span className={styles.password_text_field_icon_container} ref={e => this.iconContainer = e}>
                    <MdVisibility size="24px"/>
                </span>
            </label>
        );
    }

    public componentDidMount(): void {
        this._textField = new MDCTextField(this.element!);

        this.iconContainer!.addEventListener('mousedown', () => {
            this.input.type = "text";
        });

        this.iconContainer!.addEventListener('mouseup', () => {
            this.input.type = "password";
        });
    }
}

/**
 * A button
 */
export interface IButton {
    /**
     * Get the button html element
     *
     * @return the element
     */
    get button(): HTMLButtonElement;
}

/**
 * Properties for a text button
 */
interface TextButtonProps {
    // The button id
    id?: string;
    // Whether the button is disabled
    disabled?: boolean;
}

/**
 * A text button
 */
export class TextButton extends React.Component<TextButtonProps> implements IButton {
    /**
     * The button element
     * @private
     */
    private element: HTMLButtonElement | null = null;

    public get button(): HTMLButtonElement {
        return this.element!;
    }

    public render() {
        return (
            <button className="mdc-button" ref={e => this.element = e} id={this.props.id}
                    disabled={this.props.disabled}>
                <span className="mdc-button__ripple"/>
                <span className="mdc-button__label">
                    {this.props.children}
                </span>
            </button>
        );
    }

    public componentDidMount(): void {
        MDCRipple.attachTo(this.button);
    }
}

interface LinearProgressProps {
    indeterminate?: boolean;
}

/**
 * A linear progress bar
 */
export class LinearProgress extends React.Component<LinearProgressProps> {
    /**
     * The progress bar html element
     */
    public element: HTMLDivElement | null = null;

    /**
     * The mdc linear progress instance
     * @private
     */
    private _progressBar: MDCLinearProgress | null = null;

    /**
     * Get the mdc linear progress instance
     *
     * @return the instance
     */
    public get progressBar(): MDCLinearProgress {
        return this._progressBar!;
    }

    public render() {
        const className: string = "mdc-linear-progress" +
            (this.props.indeterminate === true ? " mdc-linear-progress--indeterminate" : "");
        return (
            <div role="progressbar" className={className} aria-valuemin={0} aria-valuemax={1} aria-valuenow={0}
                 ref={e => this.element = e}>
                <div className="mdc-linear-progress__buffer">
                    <div className="mdc-linear-progress__buffer-bar"/>
                    <div className="mdc-linear-progress__buffer-dots"/>
                </div>
                <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                    <span className="mdc-linear-progress__bar-inner"/>
                </div>
                <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                    <span className="mdc-linear-progress__bar-inner"/>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this._progressBar = new MDCLinearProgress(this.element!);
    }
}

/**
 * A mdc checkbox
 */
export class Checkbox extends React.Component {
    /**
     * The checkbox html element
     * @private
     */
    private element: HTMLElement | null = null;

    /**
     * The mdc checkbox instance
     * @private
     */
    private _checkbox: MDCCheckbox | null = null;

    /**
     * Get the mdc checkbox instance
     *
     * @return the instance
     */
    public get checkbox(): MDCCheckbox {
        return this._checkbox!;
    }

    public render(): React.ReactNode {
        return (
            <div className="mdc-touch-target-wrapper" ref={e => this.element = e}>
                <div className="mdc-checkbox mdc-checkbox--touch">
                    <input type="checkbox"
                           className="mdc-checkbox__native-control"
                           id="checkbox-1"/>
                    <div className="mdc-checkbox__background">
                        <svg className="mdc-checkbox__checkmark"
                             viewBox="0 0 24 24">
                            <path className="mdc-checkbox__checkmark-path"
                                  fill="none"
                                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                        </svg>
                        <div className="mdc-checkbox__mixedmark"/>
                    </div>
                    <div className="mdc-checkbox__ripple"/>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        this._checkbox = new MDCCheckbox(this.element!);
    }
}

/**
 * A snackbar
 */
export class Snackbar extends React.Component {
    /**
     * The html snackbar element
     * @private
     */
    private element: HTMLElement | null = null;

    /**
     * The mdc snackbar instance
     * @private
     */
    private _snackbar: MDCSnackbar | null = null;

    /**
     * Get the mdc snackbar instance
     *
     * @return the instance
     */
    public get snackbar(): MDCSnackbar {
        return this._snackbar!;
    }

    public render(): React.ReactNode {
        return (
            <aside className="mdc-snackbar custom-snackbar" ref={e => this.element = e}>
                <div className="mdc-snackbar__surface" role="status" aria-relevant="additions">
                    <div className="mdc-snackbar__label" aria-atomic="false">
                        {this.props.children}
                    </div>
                    <div className="mdc-snackbar__actions" aria-atomic="true">
                        <button type="button" className="mdc-button mdc-snackbar__action">
                            <div className="mdc-button__ripple"/>
                            <span className="mdc-button__label">Ok</span>
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    public componentDidMount(): void {
        this._snackbar = new MDCSnackbar(this.element!);
    }

    /**
     * Open the snackbar
     */
    public open(): void {
        this.snackbar.open();
    }
}