import React from 'react';
import SingleScheduleView from "./SingleScheduleView";
import IndivScheduleView from "./IndivScheduleView";
import OutputGenView from "./OutputGenView";

import { TYPES } from "../api/SessionTypes";

import { Container, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import SessionForm from "./SessionForm";
import BasicsForm from "./BasicsForm";
import TeamList from '../inputs/TeamList';


export default class FullScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'sessions',
        }

        this.getItems = this.getItems.bind(this);
        this.updatePDFSettings = this.updatePDFSettings.bind(this);
    }

    getItems() {
        return this.props.event.sessions;
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    //TODO make cosmetic
    updateDays(T) {

    }
    //TODO make cosmetic
    updateTeams(T) {
        let E = this.props.event;
        E.teams = T;
        this.props.onChange(E);
        console.log(this.props.event);
    }

    //TODO make cosmetic
    updateSessions(S) {
        let E = this.props.event;
        for (let i = 0; i < E.sessions.length; i++) {
            if (E.sessions[i].id === S.id) {
                E.sessions[i] = S;
                this.props.onChange(E);
                break;
            }
        }
    }

    updatePDFSettings(S) {
        let E = this.props.event;
        E.titleFontSize = S.titleFontSize;
        E.baseFontSize = S.baseFontSize;
        E.logoTopLeft = S.logoTopLeft;
        E.logoTopRight = S.logoTopRight;
        E.logoBotLeft = S.logoBotLeft;
        E.logoBotRight = S.logoBotRight;
        E.footerText = S.footerText;
        this.props.onChange(E);
    }



    render() {
        return (
            <Container>
                <Nav pills>
                    {/*<NavItem><NavLink>{this.props.event.errors} error{this.props.event.errors !== 1 && "s"}</NavLink></NavItem>*/}
                    {/*<NavItem>*/}
                        {/*<NavLink href="#" className={(this.state.activeTab === 'display') ? "active" : ""}*/}
                                 {/*onClick={() => { this.toggle('display')}}>*/}
                            {/*Display Parameters*/}
                        {/*</NavLink>*/}
                    {/*</NavItem>*/}
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'sessions') ? "active" : ""}
                                 onClick={() => { this.toggle('sessions')}}>
                            Session schedules
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'indiv') ? "active" : ""}
                                 onClick={() => { this.toggle('indiv')}}>
                            Individual schedules
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'outputs') ? "active" : ""}
                                 onClick={() => { this.toggle('outputs')}}>
                            Generate Outputs
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId='display'>
                        &nbsp;
                        <BasicsForm event={this.props.event} cosmetic onChange={this.updateDays}/>
                        {this.props.event.sessions.map(S =>
                            <SessionForm key={S.id} cosmetic session={S} onChange={this.updateSessions}/>)}
                        <TeamList cosmetic teams={this.props.event.teams} onChange={this.updateTeams}/>
                    </TabPane>
                    <TabPane tabId='sessions'>
                        &nbsp;
                        <Row>
                            {this.getItems().filter(x=>x.type !== TYPES.BREAK)
                                .sort((a,b)=>{return a.type.priority-b.type.priority})
                                .map(x => { return (
                                    <Col sm="12" md="6" key={x.id} >
                                        <SingleScheduleView data={this.props.event.getSessionDataGrid(x.id)} session={x}/>
                                    </Col>);
                                })}
                        </Row>
                    </TabPane>
                    <TabPane tabId='indiv'>
                        <IndivScheduleView data={this.props.event.getIndivDataGrid()}/>
                    </TabPane>
                    <TabPane tabId='outputs'>
                        <OutputGenView data={this.props.event} handleChange={this.updatePDFSettings}/>
                    </TabPane>
                </TabContent>
            </Container>
        );
    }
}