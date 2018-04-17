import React from 'react';
import ReactDataSheet from 'react-datasheet';

import { Table } from 'reactstrap';


export default class IndivScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: this.buildGrid(),
        }
    }

    buildGrid() {
        let grid = this.props.data.slice();
        grid[0] = this.props.data[0].map(x => {
            x.className = "header";
            return x;
        });
        grid[1] = this.props.data[1].map(x => {
            x.className = "header";
            return x;
        });

        for (let i = 1; i < grid.length; i++) {
            grid[i] = this.props.data[i];
        }
        console.log(grid);
        return grid;
    }

    render() {
        return (
            <div>
                <strong>Individual Schedules</strong>
                <ReactDataSheet
                    data={this.state.grid}
                    valueRenderer={(cell) => cell.value}
                    sheetRenderer={(props) => (
                        <Table className="datagrid-custom">
                            <tbody>
                            {props.children}
                            </tbody>
                        </Table>
                    )}
                />
            </div>
        )
    }
}