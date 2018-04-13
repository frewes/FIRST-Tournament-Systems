import React from 'react';

import { Input, Col, FormGroup, Label } from 'reactstrap';
import uniqueId from 'react-html-id'

export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        uniqueId.enableUniqueIds(this);
    }

    handleChange(event) {
        const val = event.target.value;
        this.props.onChange(val);
    }

    render() {
        return (
            <FormGroup row>
                <Label sm={2} for={this.nextUniqueId()}>{this.props.label}</Label>
                <Col sm={10}>
                    <Input type="text" id={this.lastUniqueId()} value={this.props.value} onChange={this.handleChange}/>
                </Col>
            </FormGroup>
        );
    }
}