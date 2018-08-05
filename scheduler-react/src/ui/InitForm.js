import React from 'react';
import TextInput from '../inputs/TextInput'
import NumberInput from '../inputs/NumberInput'
import DateTimeInput from '../inputs/DateTimeInput'

import { Container, Form, Table } from 'reactstrap';

import ReactDataSheet from 'react-datasheet';
import TeamList from "../inputs/TeamList";
import TextAreaInput from "../inputs/TextAreaInput";

export default class InitForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....
        this.state = {
            grid: this.getDataGrid()
        }

        this.getDataGrid = this.getDataGrid.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateNTeams = this.updateNTeams.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.updateNDays = this.updateNDays.bind(this);
        this.updateDays = this.updateDays.bind(this);
        this.updateTeamNames = this.updateTeamNames.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }
    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.event.days.length; i++) {
            grid.push([]);
            grid[i].push({value: "Day " + (i+1), readOnly: true});
            grid[i].push({value: this.props.event.days[i]});
        }
        return grid;
    }

    updateTitle(newTitle) {
        let data = this.props.event;
        data.title = newTitle;
        this.handleChange(data);
    }
    updateNTeams(newN) {
        let data = this.props.event;
        data.nTeams = newN;
        this.handleChange(data);
    }
    updateStartTime(newTime) {
        let data = this.props.event;
        data.startTime = newTime;
        this.handleChange(data);
    }
    updateEndTime(newTime) {
        let data = this.props.event;
        data.endTime = newTime;
        this.handleChange(data);
    }

    updateDays(changes) {
        const grid = this.state.grid.map(row => [...row]);
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
        });
        this.setState({grid});
        let A = [];
        for (let i = 0; i < grid.length; i++) {
            A.push(grid[i][1].value);
        }
        let S = this.props.event;
        S.days = A;
        this.props.onChange(S);
    }

    updateNDays(value) {
        let E = this.props.event;
        E.nDays = value;
        E.endTime.mins = (E.endTime.mins % (24*60)) + ((value-1)*24*60);
        this.setState({grid: this.getDataGrid()});
        this.handleChange(E);
    }

    updateTeamNames(e) {
        let E = this.props.event;
        E.tempNames = e;
        this.handleChange(E);
    }

    handleChange(data) {
        if (this.props.onChange) this.props.onChange(data);
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <TextInput large label="Title: " value={this.props.event.title} onChange={this.updateTitle}/>
                    <NumberInput large min="4" label="Number of teams: " value={this.props.event.nTeams} onChange={this.updateNTeams}/>
                    <NumberInput label="Number of days" large min={1} value={this.props.event.days.length} onChange={this.updateNDays}/>
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
                        onCellsChanged={(changes) => this.updateDays(changes)}
                    />
                    <DateTimeInput large label="Start time: " value={this.props.event.startTime} onChange={this.updateStartTime}/>
                    <DateTimeInput large label="End time: " value={this.props.event.endTime} onChange={this.updateEndTime}/>
                    <TextAreaInput large label="Team names:" rows={10} placeholder="List of team names" onChange={this.updateTeamNames}/>
                </Form>
            </Container>
        );
    }
}
