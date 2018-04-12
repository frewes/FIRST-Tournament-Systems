import React from 'react';
// import ReactDOM from 'react-dom';

export default class SessionForm extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div>
                <h1>{this.props.session.name}</h1>
            </div>
        );
    }
}