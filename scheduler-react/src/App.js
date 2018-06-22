import React, { Component } from 'react';
import InitForm from './ui/InitForm'
import { EventParams } from "./api/EventParams";
import DetailView from "./ui/DetailView";
import TopBar from './ui/TopBar';
import { DateTime } from './api/DateTime';

import { Scheduler } from './scheduling/Scheduler';

import { freeze, thaw, saveToFile, loadFromFile } from './scheduling/utilities';

import { Container, Jumbotron, Button, Row, Col } from 'reactstrap';
import DayScheduleView from "./ui/DayScheduleView";
import FullScheduleView from "./ui/FullScheduleView";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datasheet/lib/react-datasheet.css';
import './react-datagrid-custom.css';

// Should set this up as github.io page under the firstaustralia repo
// That way github manages load balancing and doesn't crash

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'LoadNew',
            eventParams: new EventParams( this.props.version,
                "2018 FLL Competition", 24, new DateTime(8.5*60), new DateTime(17*60)),
            processing: false
        };
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.handleLoadButtonClick = this.handleLoadButtonClick.bind(this);
        this.initSchedule= this.initSchedule.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.customise = this.customise.bind(this);
        this.generate = this.generate.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
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
        let S = new Scheduler(E);
        S.buildAllTables();
        console.log(E);
    }

    handleLoadButtonClick() {
        alert("Loading not yet implemented");
    }

    handleCreateButtonClick() {
        this.setState({display: 'Initialise'});
    }

    customise() {
        this.state.eventParams.populateFLL();
        let S = new Scheduler(this.state.eventParams);
        S.buildAllTables();
        this.setState({display: 'Customise'});
    }

    generate() {
        console.log("GENERATING");
        this.setState({processing: true})
        setTimeout((() => {
            let S = new Scheduler(this.state.eventParams);
            let count = 1000;
            do {
                S.buildAllTables();
                console.log(this.state.eventParams);
                S.fillAllTables();
                console.log(this.state.eventParams);
                S.evaluate();
            } while (this.state.eventParams.errors > 0 && count-- > 0);
            this.setState ({display: 'Review'});
            this.setState({processing: false});
        }), 50);
    }

    onSave() {
      var filename =prompt("Enter filename", this.eventParams.title.replace(/ /g, '_'));
      let json_str = JSON.stringify(this.state.eventParams,freeze);
      if (filename != null) saveToFile(filename+".schedule",json_str);
      // Write to file
    }

    onLoad() {
      let json_str = ""; // Load from file
      let E = JSON.parse(json_str,thaw);
      this.setState({eventParams: E});
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
                    <InitForm event={this.state.eventParams} onChange={this.handleScheduleChange}/>
                    <Button color="warning" onClick={this.customise}>Customise</Button>&nbsp;
                    <Button color="success" onClick={()=> {
                        this.state.eventParams.populateFLL();
                        this.generate();
                    }}>{this.state.processing ? "Generating..." : "Generate"}</Button>

                </Jumbotron>
            );
        } else if (this.state.display === 'Customise') {
            mainWindow = (
                <Row>
                    <Col lg="3">
                        &nbsp;
                        <br/>
                        <Button color="success" onClick={this.generate}>{this.state.processing ? "Generating..." : "Run Schedule Generation"}</Button>
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
                <TopBar version={this.props.version} onSave={this.onSave} onLoad={this.onLoad}/>
                {mainWindow}
            </Container>
        );
  }
}

export default App;
