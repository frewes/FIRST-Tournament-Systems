import React, { Component } from 'react';
import InitForm from './ui/InitForm'
import { EventParams } from "./api/EventParams";
import DetailView from "./ui/DetailView";
import TopBar from './ui/TopBar';
import { DateTime } from './api/DateTime';

import { Scheduler } from './scheduling/Scheduler';

import { Container, Jumbotron, Button, Row, Col } from 'reactstrap';
import DayScheduleView from "./ui/DayScheduleView";
import FullScheduleView from "./ui/FullScheduleView";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datasheet/lib/react-datasheet.css';
import './react-datagrid-custom.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'LoadNew',
            eventParams: new EventParams( this.props.version,
                "2018 FLL Competition", 24, new DateTime(540), new DateTime(17*60))
        };
        // This binding is necessary to make `this` work in the callback
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.handleLoadButtonClick = this.handleLoadButtonClick.bind(this);
        this.initSchedule= this.initSchedule.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.generate = this.generate.bind(this);
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
        // I don't love this way of doing it...
        let S = new Scheduler(this.state.eventParams);
        S.buildAllTables();
        console.log(this.state.eventParams);
    }

    handleLoadButtonClick() {
        alert("Loading not yet implemented");
    }

    handleCreateButtonClick() {
        this.setState({display: 'Initialise'});
    }

    generate() {
        console.log("GENERATING");
        let S = new Scheduler(this.state.eventParams);
        S.buildAllTables();
        console.log(this.state.eventParams);
        S.initialFill();
        console.log(this.state.eventParams);
        this.setState ({display: 'Review'});
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
                    <Button color="success" onClick={this.generate}>Generate</Button>
                </Jumbotron>
            );
        } else if (this.state.display === 'Customise') {
            mainWindow = (
                <Row>
                    <Col lg="3">
                        &nbsp;
                        <br/>
                        <Button color="success" onClick={this.generate}>Run schedule generation</Button>
                        <br/>
                        &nbsp;
                        <DayScheduleView event={this.state.eventParams}/>
                    </Col>
                    <Col lg="9">
                        <Jumbotron>
                            <DetailView onChange={this.handleScheduleChange} event={this.state.eventParams}/>
                        </Jumbotron>
                    </Col>
                </Row>
            )
        } else if (this.state.display === 'Review') {
            mainWindow = (
                <Row>
                    <Col lg="3">
                        &nbsp;
                        <br/>
                        <Button color="warning" onClick={() => this.setState({display: 'Customise'})}>Change parameters</Button>&nbsp;
                        <br/>
                        &nbsp;
                        <DayScheduleView event={this.state.eventParams}/>
                    </Col>
                    <Col lg="9">
                        <Jumbotron>
                            <FullScheduleView event={this.state.eventParams}/>
                        </Jumbotron>
                    </Col>
                </Row>
            )
        }

        return (
            <Container fluid className="App">
                <TopBar version={this.props.version}/>
                {mainWindow}
            </Container>
        );
  }
}

export default App;
