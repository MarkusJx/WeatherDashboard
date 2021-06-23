import React from "react";
import styles from "../../styles/components/ExpirationDatePicker.module.scss";
import DatePicker from "react-date-picker";

interface ExpirationDatePickerState {
    date: Date | null;
}

interface ExpirationDatePickerProps {
    style?: React.CSSProperties;
    title?: string;
}

export default class ExpirationDatePicker extends React.Component<ExpirationDatePickerProps, ExpirationDatePickerState> {
    public constructor(props: ExpirationDatePickerProps) {
        super(props);
        this.state = {
            date: null
        };

        this.onChange = this.onChange.bind(this);
    }

    public get value(): Date | null {
        return this.state.date;
    }

    public set value(value: Date | null) {
        this.onChange(value);
    }

    public render(): React.ReactNode {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        minDate.setHours(0, 0, 0, 0);
        return (
            <div className={styles.date_picker_container} style={this.props.style}>
                <span className={styles.expiration_text}>
                    {
                        this.props.title ? this.props.title : "Expiration date:"
                    }
                </span>
                <DatePicker onChange={this.onChange} value={this.state.date} minDate={minDate} format="dd/MM/yyyy"
                            openCalendarOnFocus={false}/>
            </div>
        );
    }

    private onChange(value: Date | null): void {
        this.setState({
            date: value
        });
    }
}