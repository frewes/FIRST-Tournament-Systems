import React from 'react';

import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, Container, Row } from 'reactstrap';

import MdInfoOutline from 'react-icons/lib/md/info-outline'
import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'

import ToggleButton from 'react-toggle-button';

import first from "../resources/first.png"

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            advanced: false
        }

        this.toggle = this.toggle.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleAdvanced() {
        this.setState({
            advanced:!this.state.advanced
        });
    }

    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand><img alt="" width="80px" src={first}/></NavbarBrand>
                <NavbarBrand>FLL Scheduler <small>Version {this.props.version}</small></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink>
                                <Container onClick={this.toggleAdvanced}>
                                    <Row><small>Advanced</small></Row>
                                    <Row><ToggleButton value={this.state.advanced} onToggle={this.toggleAdvanced}/></Row>
                                </Container>
                            </NavLink>
                        </NavItem>
                        <NavItem><NavLink><MdInfoOutline/></NavLink></NavItem>
                        <NavItem><NavLink><MdFileDownload/></NavLink></NavItem>
                        <NavItem><NavLink><MdFileUpload/></NavLink></NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}