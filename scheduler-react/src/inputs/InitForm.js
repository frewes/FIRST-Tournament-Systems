import React from 'react';
import TextInput from './TextInput'
import NumberInput from './NumberInput'
import DateTimeInput from './DateTimeInput'

export default class BasicInputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '2018 FLL Tournament.',
            nTeams: 24,
            startTime: '09:00',
            endTime: '17:00'
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
        alert('An essay was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextInput label="Title: " value={this.state.title} onChange={this.updateTitle}/>
                <br/>
                <h1>{this.state.title}</h1>
                <br/>
                <NumberInput label="Number of teams: " value={this.state.nTeams} onChange={this.updateNTeams}/>
                <br/>
                <h1>{this.state.nTeams}</h1>
                <br/>
                <DateTimeInput label="Start time: " value={this.state.startTime} onChange={this.updateStartTime}/>
                <br/>
                <h1>{this.state.startTime}</h1>
                <br/>
                <DateTimeInput label="End time: " value={this.state.endTime} onChange={this.updateEndTime}/>
                <br/>
                <h1>{this.state.endTime}</h1>
                <br/>
                <input type="submit" value="Set up schedule" />
            </form>
        );
    }
}
