import React from 'react';
import TextInput from '../inputs/TextInput'
import NumberInput from '../inputs/NumberInput'
import DateTimeInput from '../inputs/DateTimeInput'

import { DateTime } from '../api/DateTime'
import { Container, Form } from 'reactstrap';


export default class InitForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....

        this.updateTitle = this.updateTitle.bind(this);
        this.updateNTeams = this.updateNTeams.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(data) {
        if (this.props.onChange) this.props.onChange(data);
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <TextInput large label="Title: " value={this.props.event.title} onChange={this.updateTitle}/>
                    <NumberInput large min="4" label="Number of teams: " value={this.props.event.nTeams} onChange={this.updateNTeams}/>
                    <DateTimeInput large label="Start time: " value={this.props.event.startTime} onChange={this.updateStartTime}/>
                    <DateTimeInput large label="End time: " value={this.props.event.endTime} onChange={this.updateEndTime}/>
                </Form>
            </Container>
        );
    }
}
