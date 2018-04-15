import React from 'react';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';

import { TYPES } from '../api/SessionTypes';
import InitForm from "./InitForm";
import TeamList from "../inputs/TeamList";

export default class DetailView extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'judging'
        };

        this.updateScheduleFromBasics = this.updateScheduleFromBasics.bind(this);
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
    }

    renderSessions(type) {
        return <h1>{type.name}</h1>
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
                        <InitForm hideTeams hideSubmit event={this.props.event} onChange={this.updateScheduleFromBasics}/>
                    </TabPane>
                    <TabPane tabId="teams">
                        <TeamList teams={this.props.event.teams} onChange={this.updateTeams}/>
                    </TabPane>
                    <TabPane tabId="judging">
                        {this.renderSessions(TYPES.JUDGING)}
                    </TabPane>
                    <TabPane tabId="rounds">
                        {this.renderSessions(TYPES.MATCH_ROUND)}
                    </TabPane>
                    <TabPane tabId="breaks">
                        {this.renderSessions(TYPES.BREAK)}
                        </TabPane>
                </TabContent>
            </Container>
        );
    }
}
