import React, { Component } from 'react';
import BasicInputForm from './ui/InitForm'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { EventParams } from "./api/EventParams";
import SessionForm from "./ui/SessionForm";
import DetailView from "./ui/DetailView";

import { Navbar, Container, Jumbotron, Button } from 'reactstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'LoadNew',
        };
        // This binding is necessary to make `this` work in the callback
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.handleLoadButtonClick = this.handleLoadButtonClick.bind(this);
        this.initSchedule= this.initSchedule.bind(this);
    }

    initSchedule(initState) {
        let E = new EventParams( this.props.version,
            initState.title, initState.nTeams, initState.startTime, initState.endTime);

        this.setState({
            eventParams: E,
            display: 'Customise'
        });
    }

    handleLoadButtonClick() {
        alert("Loading not yet implemented");
    }

    handleCreateButtonClick() {
        this.setState({display: 'Initialise'});
    }

    render() {
        let mainWindow = <h1>An error occurred</h1>;
        if (this.state.display=== 'LoadNew') {
            mainWindow = (
                <div>
                    <Button onClick={this.handleCreateButtonClick}>Create new schedule</Button>&nbsp;
                    <Button onClick={this.handleLoadButtonClick}>Load existing schedule</Button>
                </div>
            );
        } else if (this.state.display === 'Initialise') {
            mainWindow = (
                <div>
                    <h1 className="App-intro">
                        Basic setup
                    </h1>
                    <BasicInputForm onSubmit={this.initSchedule}/>
                </div>
            );
        } else if (this.state.display === 'Customise') {
            mainWindow = (
                <div>
                    <DetailView event={this.state.eventParams}/>
                </div>
            )
        } else if (this.state.display === 'unused') {
            console.log(this.state.eventParams);
            mainWindow = (
                <Container>
                    <h1 className="App-intro">
                        Customise parameters
                    </h1>
                    <h1>{this.state.eventParams.title}</h1>
                    <br/>
                    <h2>{this.state.eventParams.startTime.time} - {this.state.eventParams.endTime.time}</h2>
                    <br/>
                    {this.state.eventParams.sessions.map(s =>
                        <SessionForm key={s._id} session={s}/>)
                    }
                    <h2>Teams</h2>
                    <br/>
                    <ul>
                        {this.state.eventParams.teams.map(team =>
                            <li key={team.number}>{team.number}: {team.name}</li>
                        )}
                    </ul>
                </Container>
            )
        }

        return (
            <Container className="App">
                <Navbar light>
                    <h1>FLL Scheduler</h1>
                    <h3>Version {this.props.version}</h3>
                </Navbar>
                <Jumbotron>
                    {mainWindow}
                </Jumbotron>
            </Container>
        );
  }
}

export default App;
