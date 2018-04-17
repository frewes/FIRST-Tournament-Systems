import React from 'react';
import SingleScheduleView from "./SingleScheduleView";

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
                <Row>
                    {this.getItems().filter(x=>x.type !== TYPES.BREAK)
                        .sort((a,b)=>{return a.type.priority-b.type.priority})
                        .map(x => { return (
                            <Col sm="12" md="6" key={x.id} >
                                <SingleScheduleView data={this.props.event.getSessionDataGrid(x.id)} session={x}/>
                            </Col>);
                        })}
                </Row>
            </Container>
        );
    }
}