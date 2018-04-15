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
        let rounds = sessions.sort((a,b) => { return a.id - b.id});
        // Estimate round times; this can be done better!
        // let timeAvailable = this.props.event.endTime.mins - this.props.event.startTime.mins - 60;
        // let timePerMatch = Math.round(timeAvailable / (this.props.event.nTeams * 3 / 2));
        // let matchLen = Math.ceil(timePerMatch/2);
        // let matchBuf = Math.floor(timePerMatch/2);
        // let roundDur = (matchLen + matchBuf) * Math.ceil(this.props.event.nTeams / 2);
        // let lastRoundEnd = new DateTime(this.props.event.startTime.mins);
        // let nLocs = Math.round(this.props.event.nTeams / 10);
        // let nJudgings = Math.ceil(this.props.event.nTeams/nLocs);
        // let startLunch = new DateTime(this.props.event.startTime.mins + nJudgings*15);
        // let endLunch = new DateTime(startLunch.mins + 60);

        // for (let i = 0; i < rounds.length; i++) {
        //     if (rounds[i].type !== TYPES.MATCH_ROUND) continue;
        //     rounds[i].startTime = lastRoundEnd;
        //     let eTime = new DateTime(rounds[i].startTime.mins + roundDur);
        //     if (rounds[i].startTime.mins < startLunch.mins && eTime.mins > endLunch.mins)
        //         eTime.mins += (endLunch.mins - startLunch.mins);
        //     rounds[i].endTime = eTime;
        //     lastRoundEnd = eTime;
        // }


        let sorted = rounds.sort((a,b) => { return a.startTime.mins - b.startTime.mins});
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
                sTime: sorted[i].startTime.time,
                eTime: sorted[i].endTime.time,
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