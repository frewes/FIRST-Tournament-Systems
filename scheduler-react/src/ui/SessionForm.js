import React from 'react';
// import ReactDOM from 'react-dom';

import { Form } from 'reactstrap';
import TextInput from '../inputs/TextInput';

export default class SessionForm extends React.Component {
    constructor(props) {
        super(props);

        this.updateName = this.updateName.bind(this);
    }

    updateName(value) {
        let S = this.props.session;
        S.name = value;
        this.props.onChange(S);
    }

    render() {
        return (
            <div>
                <Form>
                    <TextInput label="Title" value={this.props.session.name} onChange={this.updateName}/>
                </Form>
            </div>
        );
    }
}