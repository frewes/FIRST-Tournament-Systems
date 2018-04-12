import React from 'react';
import TextInput from '../inputs/TextInput'
import NumberInput from '../inputs/NumberInput'
import DateTimeInput from '../inputs/DateTimeInput'

import { DateTime } from '../api/DateTime'

export default class BasicInputForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....
        this.state = {
            title: '2018 FLL Tournament',
            nTeams: 24,
            startTime: new DateTime(9*60),
            endTime: new DateTime(17*60)
        };

        this.updateTitle = this.updateTitle.bind(this);
        this.updateNTeams = this.updateNTeams.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateTitle(newTitle) {
        this.setState({title: newTitle});
    }
    updateNTeams(newN) {
        this.setState({nTeams: newN});
    }
    updateStartTime(newTime) {
        this.setState({startTime: newTime});
    }
    updateEndTime(newTime) {
        this.setState({endTime: newTime});
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <TextInput label="Title: " value={this.state.title} onChange={this.updateTitle}/>
                    <br/>
                    <NumberInput label="Number of teams: " value={this.state.nTeams} onChange={this.updateNTeams}/>
                    <br/>
                    <DateTimeInput label="Start time: " value={this.state.startTime} onChange={this.updateStartTime}/>
                    <br/>
                    <DateTimeInput label="End time: " value={this.state.endTime} onChange={this.updateEndTime}/>
                    <br/>
                    <input type="submit" value="Set up schedule" />
                </form>
            </div>
        );
    }
}
