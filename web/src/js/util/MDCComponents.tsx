import React from "react";

import "../../styles/MDCComponents.scss";

import {MDCTextField} from "@material/textfield";
import {MDCRipple} from "@material/ripple";
import {MDCLinearProgress} from "@material/linear-progress";
import {MDCCheckbox} from "@material/checkbox";
import {MDCSnackbar} from '@material/snackbar';

interface OutlinedTextFieldProps {
    id: string;
    labelId: string;
    type?: string;
    minLength?: number;
    required?: boolean;
    name?: string;
}

export class OutlinedTextField extends React.Component<OutlinedTextFieldProps> {
    public textField: MDCTextField | null = null;
    public input: HTMLInputElement | null = null;
    private element: HTMLElement | null = null;

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
                       required={this.props.required === true} name={this.props.name} ref={e => this.input = e}/>
            </label>
        );
    }

    public componentDidMount(): void {
        if (this.element != null) {
            this.textField = new MDCTextField(this.element);
        }
    }
}

interface TextButtonProps {
    id?: string;
}

export class TextButton extends React.Component<TextButtonProps, {}> {
    private element: HTMLButtonElement | null = null;

    public get button(): HTMLButtonElement {
        return this.element as HTMLButtonElement;
    }

    public render() {
        return (
            <button className="mdc-button" ref={e => this.element = e} id={this.props.id}>
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

export class LinearProgress extends React.Component<any, any> {
    public element: HTMLDivElement | null = null;
    private _progressBar: MDCLinearProgress | null = null;

    public render() {
        return (
            <div role="progressbar" className="mdc-linear-progress" aria-valuemin={0} aria-valuemax={1}
                 aria-valuenow={0} ref={e => this.element = e}>
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
        this._progressBar = new MDCLinearProgress(this.element as HTMLDivElement);
    }

    public get progressBar(): MDCLinearProgress {
        return this._progressBar as MDCLinearProgress;
    }
}

export class Checkbox extends React.Component<any, any> {
    private _checkbox: MDCCheckbox | null = null;
    private element: HTMLElement | null = null;

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
        this._checkbox = new MDCCheckbox(this.element as HTMLElement);
    }

    public get checkbox(): MDCCheckbox {
        return this._checkbox as MDCCheckbox;
    }
}

export class Snackbar extends React.Component {
    private element: HTMLElement | null = null;
    private _snackbar: MDCSnackbar | null = null;

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
        this._snackbar = new MDCSnackbar(this.element as HTMLElement);
    }

    public open(): void {
        this.snackbar.open();
    }

    public get snackbar(): MDCSnackbar {
        return this._snackbar as MDCSnackbar;
    }
}