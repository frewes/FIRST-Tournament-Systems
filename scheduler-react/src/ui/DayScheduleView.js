import React from 'react';

import { Table } from 'reactstrap';
// import { TYPES } from '../api/SessionTypes'
import { DateTime } from "../api/DateTime";

export default class DayScheduleView extends React.Component {
    constructor(props) {
        super(props);
        this.getItems = this.getItems.bind(this);
    }


    getItems() {
        let sessions = this.props.event.sessions;
        let sorted = sessions.sort((a,b) => { return a.actualStartTime.mins - b.actualStartTime.mins});
        let items = [];
        items.push({
            _id: 0,
            sTime: new DateTime(this.props.event.startTime.mins-30).time,
            eTime: this.props.event.startTime.time,
            contents: "Opening Ceremony"
        });
        for (let i = 0; i < sorted.length; i++) {
            items.push({
                _id: i+1,
                sTime: sorted[i].actualStartTime.time,
                eTime: sorted[i].actualEndTime.time,
                contents: sorted[i].name
            });
        }
        items.push({
            _id: sorted.length+2,
            sTime: this.props.event.endTime.time,
            eTime: new DateTime(this.props.event.endTime.mins+30).time,
            contents: "Closing Ceremony"
        });
        return items;
    }

    render() {
        let items = this.getItems();
        return (<div>
            <Table>
            <thead>
                <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Event</th>
                </tr>
            </thead>
            <tbody>
            {items.map(x => {
                return (
                    <tr key={x._id}>
                        <td>{x.sTime}</td>
                        <td>{x.eTime}</td>
                        <td>{x.contents}</td>
                    </tr>);
            })}
            </tbody>
        </Table>
        </div>)
    }
}