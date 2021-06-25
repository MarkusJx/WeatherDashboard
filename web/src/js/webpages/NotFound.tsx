import React from "react";

export default class NotFound extends React.Component {
    public render() {
        return (
            <>
                Not found
            </>
        );
    }

    public componentDidMount(): void {
        document.title = "Page Not Found";
    }
}