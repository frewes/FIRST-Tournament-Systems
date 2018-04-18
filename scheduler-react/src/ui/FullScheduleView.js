import React from 'react';
import SingleScheduleView from "./SingleScheduleView";
import IndivScheduleView from "./IndivScheduleView";

import { TYPES } from "../api/SessionTypes";

import { Container, Row, Col } from 'reactstrap';

export default class FullScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.getItems = this.getItems.bind(this);
    }

    getItems() {
        return this.props.event.sessions;
    }

    render() {
        return (
            <Container>
                <h1>{this.props.event.errors} error{this.props.event.errors !== 1 && "s"} found</h1>
                <Row>
                    {this.getItems().filter(x=>x.type !== TYPES.BREAK)
                        .sort((a,b)=>{return a.type.priority-b.type.priority})
                        .map(x => { return (
                            <Col sm="12" md="6" key={x.id} >
                                <SingleScheduleView data={this.props.event.getSessionDataGrid(x.id)} session={x}/>
                            </Col>);
                        })}
                </Row>
                <Row>
                    <Col xs={12}><IndivScheduleView data={this.props.event.getIndivDataGrid()}/></Col>
                </Row>
            </Container>
        );
    }
}