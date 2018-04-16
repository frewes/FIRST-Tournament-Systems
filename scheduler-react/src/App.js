import React, { Component } from 'react';
import InitForm from './ui/InitForm'
import { EventParams } from "./api/EventParams";
import DetailView from "./ui/DetailView";
import TopBar from './ui/TopBar';

import { Container, Jumbotron, Button, Row, Col } from 'reactstrap';
import DayScheduleView from "./ui/DayScheduleView";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datasheet/lib/react-datasheet.css';
import './react-datagrid-custom.css';

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
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
    }

    initSchedule(initState) {
        let E = new EventParams( this.props.version,
            initState.title, initState.nTeams, initState.startTime, initState.endTime);

        this.setState({
            eventParams: E,
        });
    }

    handleScheduleChange(E) {
        this.setState({
            eventParams: E
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
                <Jumbotron>
                    <Button onClick={this.handleCreateButtonClick}>Create new schedule</Button>&nbsp;
                    <Button onClick={this.handleLoadButtonClick}>Load existing schedule</Button>
                </Jumbotron>
            );
        } else if (this.state.display === 'Initialise') {
            mainWindow = (
                <Jumbotron>
                    <h1 className="App-intro">
                        Basic setup
                    </h1>
                    <InitForm onChange={this.initSchedule}/>
                    <Button color="warning" onClick={() => this.setState({display: 'Customise'})}>Customise</Button>&nbsp;
                    <Button color="success" onClick={this.initSchedule}>Generate</Button>
                </Jumbotron>
            );
        } else if (this.state.display === 'Customise') {
            mainWindow = (
                <Row>
                    <Col xs="3">
                        &nbsp;
                        <br/>
                        <Button color="success">Run schedule generation</Button>
                        <br/>
                        &nbsp;
                        <DayScheduleView event={this.state.eventParams}/>
                    </Col>
                    <Col xs="9">
                        <Jumbotron>
                            <DetailView onChange={this.handleScheduleChange} event={this.state.eventParams}/>
                        </Jumbotron>
                    </Col>
                </Row>
            )
        }

        return (
            <Container className="App">
                <TopBar version={this.props.version}/>
                {mainWindow}
            </Container>
        );
  }
}

export default App;
