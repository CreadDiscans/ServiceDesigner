import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Navbar,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem
} from 'reactstrap'

export default class Header extends React.Component {
    state = {
        isOpen: false,
        path: ''
    }
    render() {
        return <div>
            <Navbar color="dark" dark expand="md">
                <Link className="navbar-brand" to="/">Service Deigner</Link>
                    <span style={styles.path}>{this.state.path}</span>
                    <NavbarToggler onClick={()=>this.setState({isOpen: true})} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Link className="nav-link" to="/">Load</Link>
                        </NavItem>
                        <NavItem>
                            <Link className="nav-link" to="/">Save</Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    }
}

const styles = {
    path: {
        color:'white'
    }
}