import React from "react";

import styles from "../../styles/components/MiscComponents.module.scss";

export class Checkmark extends React.Component {
    private element: SVGSVGElement | null = null;

    public render(): React.ReactNode {
        return (
            <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"
                 ref={e => this.element = e}>
                <circle className={styles.checkmark__circle} cx="26" cy="26" r="25" fill="none"/>
                <path className={styles.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
        );
    }

    public animate(animate: boolean = true): void {
        if (animate) {
            this.element?.classList?.add(styles.animated);
        } else {
            this.element?.classList?.remove(styles.animated);
        }
    }
}