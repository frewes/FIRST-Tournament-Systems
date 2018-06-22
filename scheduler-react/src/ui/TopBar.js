import React from 'react';

import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';

import MdInfoOutline from 'react-icons/lib/md/info-outline'
import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'

import first from "../resources/first.png"

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            advanced: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
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
                            </NavLink>
                        </NavItem>
                        <NavItem><NavLink><MdInfoOutline size={20}/></NavLink></NavItem>
                        <NavItem onClick={this.props.onSave}><NavLink><MdFileDownload size={20}/></NavLink></NavItem>
                        <NavItem><NavLink><MdFileUpload size={20}/></NavLink></NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
