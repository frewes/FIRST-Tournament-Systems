import React, { Component } from 'react';
import { PdfGenerator } from '../api/PdfGenerator';
import { CsvGenerator } from '../api/CsvGenerator';

import { Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Button, Card, CardText, CardTitle } from 'reactstrap';
import NumberInput from "../inputs/NumberInput";
import TextInput from "../inputs/TextInput";


export default class OutputGenView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf_modal: false,
            title_size: this.props.data.titleFontSize,
            base_size: this.props.data.baseFontSize,
            footer: this.props.data.footerText
        };
        this.toggle=this.toggle.bind(this);
        this.generatePDF=this.generatePDF.bind(this);
        this.generateCSV=this.generateCSV.bind(this);
        this.updateBaseSize = this.updateBaseSize.bind(this);
        this.updateTitleSize = this.updateTitleSize.bind(this);
        this.updateFooter = this.updateFooter.bind(this);
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

    generateCSV() {
        let c = new CsvGenerator(this.props.data);
        c.makeCSV();
    }

    updateTitleSize(value) {
        let E = this.props.data;
        E.titleFontSize = value;
        this.props.handleChange(E);
        this.setState({
            title_size: value
        });
    }

    updateFooter(value) {
        let E = this.props.data;
        E.footerText = value;
        this.props.handleChange(E);
        this.setState({
            footer: value
        });
    }

    updateBaseSize(value) {
        let E = this.props.data;
        E.baseFontSize = value;
        this.props.handleChange(E);
        this.setState({
            base_size: value
        });
    }

    // To add image uploading...
    // https://codepen.io/hartzis/pen/VvNGZP

    render () {
        return (
            <Container>
                <Modal isOpen={this.state.pdf_modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit PDF Format</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col><img alt={"Top Left Logo"} src={this.props.data.logoTopLeft} height={100}/></Col>
                                <Col><img alt={"Top Right Logo"} src={this.props.data.logoTopRight} height={100}/></Col>
                            </Row>
                            <br/>
                            <NumberInput min={4} value={this.state.title_size} label={"Title font size"} onChange={this.updateTitleSize}/>
                            <br/>
                            <NumberInput min={2} value={this.state.base_size} label={"Base font size"} onChange={this.updateBaseSize}/>
                            <br/>
                            <Row>
                                <Col><img alt={"Bottom Left Logo"} src={this.props.data.logoBotLeft} height={100}/></Col>
                                <Col><img alt={"Bottom Right Logo"} src={this.props.data.logoBotRight} height={100}/></Col>
                            </Row>
                            <br/>
                            <TextInput value={this.state.footer} label={"Footer Text"} onChange={this.updateFooter}/>
                        </Container>
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
                            <Button color="success" onClick={this.generateCSV}>Go!</Button>
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
