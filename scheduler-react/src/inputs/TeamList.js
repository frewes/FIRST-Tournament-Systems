import React from 'react';

import ReactDataSheet from 'react-datasheet';

import { Table, Button } from 'reactstrap';
import { TeamParams } from '../api/TeamParams';

import MdHighlightRemove from 'react-icons/lib/md/highlight-remove';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

export default class TeamList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: this.getDataGrid(),
            toAdd: 1
        }

        this.updateCells = this.updateCells.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
        this.changeToAdd = this.changeToAdd.bind(this);
        this.addTeams = this.addTeams.bind(this);
    }

    changeToAdd(ev) {
        this.setState({
            toAdd: ev.target.value
        });
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
        let T = this.props.teams;
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value};
        });
        for (let row = 0; row < this.state.grid.length; row++) {
            T[row].number = grid[row][0].value;
            T[row].name = grid[row][1].value;
        }
        this.setState({grid});
        this.props.onChange(T);
    }

    addTeams() {
        let T = this.props.teams;
        for (let i = 0; i < this.state.toAdd; i++) {
            T.push(new TeamParams(T.length+1));
        }
        this.props.onChange(T);
        this.setState({grid: this.getDataGrid()});
    }

    deleteTeam(idx) {
        let T = this.props.teams;
        T.splice(idx,1);
        this.props.onChange(T);
        this.setState({grid: this.getDataGrid()});
    }

    render() {
        return (
            <div>
                <Button onClick={this.addTeams}><MdAddCircleOutline/> Add</Button>&nbsp;
                <input type="number" value={this.state.toAdd} min="1" onChange={this.changeToAdd}/>&nbsp;
                team{this.state.toAdd>1 && "s"}&nbsp;
                <br/>
                Number of teams: {this.props.teams.length}
                <br/>
                &nbsp;
            <ReactDataSheet
                data={this.state.grid}
                valueRenderer={(cell) => cell.value}
                sheetRenderer={(props) => (
                    <Table className="datagrid-custom">
                        <thead>
                            <tr>
                                <th>Team number</th>
                                <th>Team name</th>
                                <th width="20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.children}
                        </tbody>
                    </Table>
                    )}
                rowRenderer={(props) => (
                    <tr>
                        {props.children}
                        <td className='cell' onClick={() => this.deleteTeam(props.row)}><MdHighlightRemove size={20}/></td>
                    </tr>
                )}
                onCellsChanged={(changes) => this.updateCells(changes)}
            />
            </div>
        )
    }
}