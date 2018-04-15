import React from 'react';
import TextInput from '../inputs/TextInput'
import NumberInput from '../inputs/NumberInput'
import DateTimeInput from '../inputs/DateTimeInput'

import { DateTime } from '../api/DateTime'
import { Container, Form, Button } from 'reactstrap';


export default class InitForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....
        this.state = {
            title: (this.props.event) ? this.props.event.title : '2018 FLL Tournament',
            nTeams: (this.props.event) ? this.props.event.nTeams : 24,
            startTime: (this.props.event) ? this.props.event.startTime: new DateTime(9*60),
            endTime: (this.props.event) ? this.props.event.endTime : new DateTime(17*60)
        };

        this.updateTitle = this.updateTitle.bind(this);
        this.updateNTeams = this.updateNTeams.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    updateTitle(newTitle) {
        this.setState({title: newTitle});
        let data = this.state;
        data.title = newTitle;
        this.handleChange(data);
    }
    updateNTeams(newN) {
        this.setState({nTeams: newN});
        let data = this.state;
        data.nTeams = newN;
        this.handleChange(data);
    }
    updateStartTime(newTime) {
        this.setState({startTime: newTime});
        let data = this.state;
        data.startTime = newTime;
        this.handleChange(data);
    }
    updateEndTime(newTime) {
        this.setState({endTime: newTime});
        let data = this.state;
        data.endTime = newTime;
        this.handleChange(data);
    }

    handleSubmit(event) {
        if (this.props.onSubmit && !this.props.hideSubmit) {
            this.props.onSubmit(this.state);
            event.preventDefault();
        }
    }

    handleChange(data) {
        if (this.props.onChange) this.props.onChange(data);
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <TextInput large label="Title: " value={this.state.title} onChange={this.updateTitle}/>
                    {!this.props.hideTeams && <NumberInput large min="4" label="Number of teams: " value={this.state.nTeams} onChange={this.updateNTeams}/>}
                    <DateTimeInput large label="Start time: " value={this.state.startTime} onChange={this.updateStartTime}/>
                    <DateTimeInput large label="End time: " value={this.state.endTime} onChange={this.updateEndTime}/>
                    {!this.props.hideSubmit && <Button>Set up schedule</Button>}
                </Form>
            </Container>
        );
    }
}
