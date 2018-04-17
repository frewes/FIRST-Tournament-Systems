import React from 'react';

export default class Team extends React.Component {
    render() {
        return (
            <div>
            {this.props.team ? (
                <div>
                    {this.props.team.number}
                    <small>{this.props.team.name}</small>
                </div>
            ) : " X "}
            </div>
        );
    }
}