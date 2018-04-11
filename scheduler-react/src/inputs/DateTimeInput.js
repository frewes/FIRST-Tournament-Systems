import React from 'react';

export default class DateTimeInput extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const val = event.target.value;
        this.props.onChange(val);
    }


    render() {
        return (
            <label>
                {this.props.label}
                <input type="time" value={this.props.value} onChange={this.handleChange}/>
            </label>
        );
    }
}