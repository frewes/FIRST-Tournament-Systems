import React from 'react';
import ReactDataSheet from 'react-datasheet';

import { Table } from 'reactstrap';

import Team from './Team';

export default class SingleScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: this.buildGrid(),
        }
    }

    buildGrid() {
        let grid = [];
        let cols = [{value: "#", width:20, readOnly:true, className:'header'},
                    {value: "Time", readOnly:true, className:'header'}];
        this.props.session.locations.forEach(x => {
            cols.push({value: x, readOnly:true, className:'header'});
        });
        grid.push(cols);

        this.props.session.schedule.forEach((instance) => {
            let A = [];
            A.push({value: instance.num, readOnly:true});
            A.push({value: instance.time.time, readOnly:true});
            let diff = this.props.session.nLocs;
            for (let dummy = 0; dummy < instance.loc; dummy++) {
                diff--;
                A.push({value: "--", readOnly:true});
            }
            for (let i = 0; i < instance.teams.length; i++) {
            // instance.teams.forEach(x => {
                let x = instance.teams[i];
                diff--;
                A.push({value: <Team team={x}/>, readOnly:true});
            }
            while (diff-- > 0) A.push({value: "++", readOnly:true});
            grid.push(A);
        });
        return grid;
    }

    render() {
        return (
            <div>
                <strong>{this.props.session.name}</strong>
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