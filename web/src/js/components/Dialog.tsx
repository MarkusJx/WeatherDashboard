import React from "react";
import {MDCDialog} from "@material/dialog";

import "../../styles/components/Dialog.scss";

namespace Dialog {
    interface ContainerProps {
        labelledby: string;
        describedby: string;
        surfaceStyle?: React.CSSProperties;
    }

    export class Container extends React.Component<ContainerProps> {
        public dialog: MDCDialog | null = null;
        private element: HTMLElement | null = null;

        public render() {
            return (
                <div className="mdc-dialog custom-dialog" ref={e => this.element = e}>
                    <div className="mdc-dialog__container">
                        <div className="mdc-dialog__surface" role="alertdialog" aria-modal="true"
                             style={this.props.surfaceStyle}
                             aria-labelledby={this.props.labelledby} aria-describedby={this.props.describedby}>
                            {this.props.children}
                        </div>
                    </div>
                    <div className="mdc-dialog__scrim"/>
                </div>
            );
        }

        public componentDidMount() {
            this.dialog = new MDCDialog(this.element!);
        }
    }
    
    interface IdProps {
        id: string;
        style?: React.CSSProperties
    }

    export class Title extends React.Component<IdProps> {
        public render() {
            return (
                <h2 className="mdc-dialog__title" id={this.props.id} style={this.props.style}>
                    {this.props.children}
                </h2>
            );
        }
    }

    export class Content extends React.Component<IdProps> {
        public render() {
            return (
                <div className="mdc-dialog__content" id={this.props.id} style={this.props.style}>
                    {this.props.children}
                </div>
            );
        }
    }

    export class Actions extends React.Component {
        public render() {
            return (
                <div className="mdc-dialog__actions">
                    {this.props.children}
                </div>
            );
        }
    }

    interface ButtonProps {
        action: string;
    }

    export class Button extends React.Component<ButtonProps> {
        public render() {
            return (
                <button type="button" className="mdc-button mdc-dialog__button"
                        data-mdc-dialog-action={this.props.action}>
                    <div className="mdc-button__ripple"/>
                    <span className="mdc-button__label">
                        {this.props.children}
                    </span>
                </button>
            );
        }
    }
}

export default Dialog;