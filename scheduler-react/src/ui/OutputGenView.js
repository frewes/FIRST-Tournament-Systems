import React, { Component } from 'react';
import { PdfGenerator } from '../api/PdfGenerator';

import { Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Button, Card, CardText, CardTitle } from 'reactstrap';

export default class OutputGenView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf_modal: false,
        }
        this.toggle=this.toggle.bind(this);
        this.generatePDF=this.generatePDF.bind(this);
    }
    toggle() {
        this.setState({
            pdf_modal: !this.state.pdf_modal
        });
    }

    generatePDF() {
      let p = new PdfGenerator(this.props.data);
      p.makePDFs();
    }

    // To add image uploading...
    // https://codepen.io/hartzis/pen/VvNGZP

    render () {
        return (
            <Container>
                <Modal isOpen={this.state.pdf_modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit PDF Format</ModalHeader>
                    <ModalBody>
                        Not yet implemented...
                        <br/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>

                <strong>Outputs</strong>
                <hr/>
                <Row>
                    <Col lg="6">
                        <Card body>
                            <CardTitle>CSV</CardTitle>
                            <CardText>Export to CSV format used by the FLL scoring system</CardText>
                            <Button color="success">Go!</Button>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card body>
                            <CardTitle>PDF</CardTitle>
                            <CardText>Export ready-to-print formatted PDFs</CardText>
                            <Button color="primary" block onClick={this.toggle}>Edit format...</Button>
                            <Button color="success" block onClick={this.generatePDF}>Go!</Button>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}
