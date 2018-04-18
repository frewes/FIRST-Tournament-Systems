import React from 'react';

import { Input, Col, FormGroup, Label } from 'reactstrap';
import uniqueId from 'react-html-id'

import { DateTime } from '../api/DateTime'

export default class DateTimeInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        uniqueId.enableUniqueIds(this);
    }

    handleChange(event) {
        let x = this.props.value;
        if (!x) x = new DateTime(0);
        x.time = event.target.value;
        this.props.onChange(x);
    }

    render() {
        return (
            <FormGroup row>
                <Label sm={this.props.large? 2 : 6} for={this.nextUniqueId()}>{this.props.label}</Label>
                <Col sm={this.props.large? 10 : 6}>
                    <Input type="time" id={this.lastUniqueId()} pattern="[0-2][0-9]:[0-5][0-9]" step="900"
                           value={this.props.value ? this.props.value.time : null} onChange={this.handleChange}/>
                </Col>
            </FormGroup>
        );
    }
}