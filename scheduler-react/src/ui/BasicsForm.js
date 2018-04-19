import React from 'react';
import TextInput from '../inputs/TextInput'
import NumberInput from '../inputs/NumberInput'

import { Container } from 'reactstrap';


export default class BasicsForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.event.title,
            minTravel: this.props.event.minTravel,
            extraTime: this.props.event.extraTime
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateMinTravel = this.updateMinTravel.bind(this);
        this.updateExtraTime = this.updateExtraTime.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleChange(this.state);
    }

    updateTitle(newTitle) {
        this.setState({title: newTitle});
        let data = this.state;
        data.title = newTitle;
        this.handleChange(data);
    }
    updateMinTravel(value) {
        this.setState({minTravel: value});
        let data = this.state;
        data.minTravel = value;
        this.handleChange(data);
    }
    updateExtraTime(value) {
        this.setState({extraTime: value});
        let data = this.state;
        data.extraTime = value;
        this.handleChange(data);
    }

    handleChange(data) {
        if (this.props.onChange) this.props.onChange(data);
    }

    render() {
        return (
            <Container>
                <TextInput large label="Title: " value={this.state.title} onChange={this.updateTitle}/>
                {this.props.advanced &&
                    <NumberInput label="Min. travel (mins)" large value={this.state.minTravel} onChange={this.updateMinTravel}/>}
                {this.props.advanced &&
                    <NumberInput label="Extra time (mins)" large value={this.state.extraTime} onChange={this.updateExtraTime}/>}
            </Container>
        );
    }
}
