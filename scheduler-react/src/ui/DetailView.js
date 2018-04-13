import React from 'react';
import { Container, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';

// import { DateTime } from '../api/DateTime'
import { TYPES } from '../api/SessionTypes';

export default class DetailView extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    renderSessions(type) {
        return <h1>{type.name}</h1>
    }

    render() {
        return (
            <Container>
                <Nav pills>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === '1') ? "active" : ""}
                                 onClick={() => {this.toggle('1')}}>
                            Judging
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={this.state.activeTab === '2' ? "active" : ""}
                                 onClick={() => {this.toggle('2')}}>
                            Matches
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === '3') ? "active" : ""}
                                 onClick={() => {this.toggle('3')}}>
                            Breaks
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        {this.renderSessions(TYPES.JUDGING)}
                    </TabPane>
                    <TabPane tabId="2">
                        {this.renderSessions(TYPES.MATCH_ROUND)}
                    </TabPane>
                    <TabPane tabId="3">
                        {this.renderSessions(TYPES.BREAK)}
                        </TabPane>
                </TabContent>
            </Container>
        );
    }
}
