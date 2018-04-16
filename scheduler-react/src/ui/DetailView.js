import React from 'react';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane, Col, Row } from 'reactstrap';

import { TYPES } from '../api/SessionTypes';
import InitForm from "./InitForm";
import TeamList from "../inputs/TeamList";
import SessionForm from "./SessionForm"

export default class DetailView extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'judging'
        };

        this.updateScheduleFromBasics = this.updateScheduleFromBasics.bind(this);
        this.updateSessions = this.updateSessions.bind(this);
        this.updateTeams = this.updateTeams.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    updateScheduleFromBasics(s) {
        console.log(s);
        let E = this.props.event;
        E.title = s.title;
        E.nTeams = s.nTeams;
        E.startTime = s.startTime;
        E.endTime = s.endTime;
        this.props.onChange(E);
    }

    updateTeams(T) {
        let E = this.props.event;
        E.teams = T;
        this.props.onChange(E);
        console.log(this.props.event);
    }

    updateSessions(S) {
        let E = this.props.event;
        for (let i = 0; i < E.sessions.length; i++) {
            if (E.sessions[i].id === S.id) {
                E.sessions[i] = S;
                this.props.onChange(E);
                break;
            }
        }
        console.log(E);
    }

    renderSessions(type) {
        return (
            <Row>
                {this.props.event.sessions.filter(S=>S.type === type).sort((a,b) => {return a.id-b.id;}).map(S => (
                    <Col lg={6} md={12} key={S.id}><SessionForm session={S} onChange={this.updateSessions}/></Col>
                ))}
            </Row>
        )
    }

    render() {
        return (
            <Container>
                <Nav pills>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'basics') ? "active" : ""}
                                 onClick={() => {this.toggle('basics')}}>
                            Basics
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'teams') ? "active" : ""}
                                 onClick={() => {this.toggle('teams')}}>
                            Teams
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'judging') ? "active" : ""}
                                 onClick={() => {this.toggle('judging')}}>
                            Judging
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={this.state.activeTab === 'rounds' ? "active" : ""}
                                 onClick={() => {this.toggle('rounds')}}>
                            Rounds
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'breaks') ? "active" : ""}
                                 onClick={() => {this.toggle('breaks')}}>
                            Breaks
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="basics">
                        &nbsp;
                        <InitForm hideTeams hideSubmit event={this.props.event} onChange={this.updateScheduleFromBasics}/>
                    </TabPane>
                    <TabPane tabId="teams">
                        &nbsp;
                        <TeamList teams={this.props.event.teams} onChange={this.updateTeams}/>
                    </TabPane>
                    <TabPane tabId="judging">
                        &nbsp;
                            {this.renderSessions(TYPES.JUDGING)}
                    </TabPane>
                    <TabPane tabId="rounds">
                        &nbsp;
                        {this.renderSessions(TYPES.MATCH_ROUND)}
                    </TabPane>
                    <TabPane tabId="breaks">
                        &nbsp;
                        {this.renderSessions(TYPES.BREAK)}
                        </TabPane>
                </TabContent>
            </Container>
        );
    }
}
