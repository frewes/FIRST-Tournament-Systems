import React from 'react';

import ReactDataSheet from 'react-datasheet';

import { Table } from 'reactstrap';

export default class TeamList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: this.getDataGrid()
        }

        this.updateCells = this.updateCells.bind(this);
    }

    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.teams.length; i++) {
            grid.push([]);
            grid[i].push({value: this.props.teams[i].number});
            grid[i].push({value: this.props.teams[i].name});
        }
        return grid;
    }

    updateCells(changes) {
        const grid = this.state.grid.map(row => [...row])
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
        })
        this.setState({grid});
    }

    render() {
        return (
            <ReactDataSheet
                data={this.state.grid}
                valueRenderer={(cell) => cell.value}
                sheetRenderer={(props) => (
                    <Table className="datagrid-custom">
                        <thead>
                            <tr>
                                <th>Team number</th>
                                <th>Team name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.children}
                        </tbody>
                    </Table>
                    )}
                onCellsChanged={(changes) => this.updateCells(changes)}
            />
        )
    }
}