import React from 'react';

export default class DateTimeInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let x = this.props.value;
        x.time = event.target.value;
        this.props.onChange(x);
    }

    render() {
        return (
            <label>
                {this.props.label}
                <input type="time" pattern="[0-2][0-9]:[0-5][0-9]" step="900" value={this.props.value.time} onChange={this.handleChange}/>
            </label>
        );
    }
}