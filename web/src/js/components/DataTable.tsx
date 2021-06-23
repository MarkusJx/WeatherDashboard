import {MDCDataTable} from "@material/data-table";
import React from "react";

import "../../styles/components/DataTable.scss";

/**
 * The data table properties
 */
interface DataTableProps {
    // The data table style
    className?: string;
}

namespace DataTable {
    /**
     * A mdc data table
     */
    export class DataTable extends React.Component<DataTableProps> {
        /**
         * The underlying html element
         */
        public element: HTMLElement | null = null;

        /**
         * The actual mdc data table
         */
        public dataTable: MDCDataTable | null = null;

        public render(): React.ReactNode {
            return (
                <div className={`mdc-data-table themed-data-table ${this.props.className}`}
                     ref={e => this.element = e}>
                    {this.props.children}
                </div>
            );
        }

        public componentDidMount(): void {
            if (this.dataTable) {
                this.dataTable.destroy();
            }

            this.dataTable = new MDCDataTable(this.element!);
        }

        public componentWillUnmount(): void {
            if (this.dataTable) {
                this.dataTable.destroy();
                this.dataTable = null;
            }
        }
    }

    export class DataTableContainer extends React.Component {
        public render(): React.ReactNode {
            return (
                <div className="mdc-data-table__table-container">
                    {this.props.children}
                </div>
            );
        }
    }

    interface DataTableTableProps {
        label?: string;
    }

    export class DataTableTable extends React.Component<DataTableTableProps> {
        public render(): React.ReactNode {
            return (
                <table className="mdc-data-table__table" aria-label={this.props.label}>
                    {this.props.children}
                </table>
            );
        }
    }

    export class DataTableHead extends React.Component {
        public render(): React.ReactNode {
            return (
                <thead>
                {this.props.children}
                </thead>
            );
        }
    }

    export class DataTableHeaderRow extends React.Component {
        public render(): React.ReactNode {
            return (
                <tr className="mdc-data-table__header-row">
                    {this.props.children}
                </tr>
            );
        }
    }

    export class DataTableHeaderCell extends React.Component {
        public render(): React.ReactNode {
            return (
                <th className="mdc-data-table__header-cell" role="columnheader" scope="col">
                    {this.props.children}
                </th>
            );
        }
    }

    export class DataTableContent extends React.Component {
        public render(): React.ReactNode {
            return (
                <tbody className="mdc-data-table__content">
                {this.props.children}
                </tbody>
            );
        }
    }

    export class DataTableRow extends React.Component {
        public render(): React.ReactNode {
            return (
                <tr className="mdc-data-table__row">
                    {this.props.children}
                </tr>
            );
        }
    }

    export class DataTableCellFirst extends React.Component {
        public render(): React.ReactNode {
            return (
                <th className="mdc-data-table__cell" scope="row">
                    {this.props.children}
                </th>
            );
        }
    }

    interface DataTableCellProps {
        numeric?: boolean;
    }

    export class DataTableCell extends React.Component<DataTableCellProps> {
        public render(): React.ReactNode {
            const className = "mdc-data-table__cell" +
                (this.props.numeric === true ? "  mdc-data-table__cell--numeric" : "");
            return (
                <td className={className}>
                    {this.props.children}
                </td>
            );
        }
    }
}

export default DataTable;