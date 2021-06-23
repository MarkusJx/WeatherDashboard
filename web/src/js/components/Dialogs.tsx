import React from "react";

export class DialogRef {
    private readonly id: number;

    public constructor(id: number) {
        this.id = id;
    }

    public get<T extends React.Component>(): T {
        return Dialogs.getInstance().dialogs[this.id] as T;
    }
}

interface DialogsState {
    dialogs: React.ComponentType<any>[];
}

export default class Dialogs extends React.Component<{}, DialogsState> {
    public readonly dialogs: any[] = [];
    private static readonly dialogsToAdd: React.ComponentType<any>[] = [];
    private static instance: Dialogs | null = null;

    public static getInstance(): Dialogs {
        return Dialogs.instance!;
    }

    public static addDialog(dialog: React.ComponentType<any>): DialogRef {
        if (Dialogs.instance !== null) {
            return Dialogs.instance._addDialog(dialog);
        } else {
            const index = Dialogs.dialogsToAdd.push(dialog) - 1;
            return new DialogRef(index);
        }
    }

    private _addDialog(dialog: React.ComponentType<any>): DialogRef {
        const dialogs = this.state.dialogs;
        const index = dialogs.push(dialog) - 1;

        this.setState({
            dialogs: dialogs
        });

        return new DialogRef(index);
    }

    public constructor(props: {}) {
        super(props);

        this.state = {
            dialogs: Dialogs.dialogsToAdd
        };
    }

    public render(): React.ReactNode {
        this.dialogs.length = 0;
        return this.state.dialogs.map((d, i) => {
            return React.createElement(d, {key: i, ref: (e: any) => this.dialogs[i] = e});
        });
    }

    public componentDidMount() {
        Dialogs.instance = this;
    }
}