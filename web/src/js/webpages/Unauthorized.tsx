import React from "react";

export default class Unauthorized extends React.Component {
    public render() {
        return (
            <>
                Unauthorized
            </>
        );
    }

    public componentDidMount(): void {
        document.title = "Unauthorized";
    }
}