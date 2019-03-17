import React from 'react';
import { ListGroup, 
    ListGroupItem, 
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap'
import {FaPlus} from 'react-icons/fa'

export default class SidebarCode extends React.Component {
    state = {
        components: [
            {name:'alerts'},
            {name:'badge'}
        ],
        modal: false
    }

    toggle = ()=> {
        this.setState({modal:!this.state.modal})
    }

    render() {
        return <div>
            <h5>Code</h5>
            <div style={styles.listView}>
                <ListGroup>
                    {
                        this.state.components.map(item=> {
                            return <ListGroupItem action key={item.name}>{item.name}</ListGroupItem>
                        })
                    }
                </ListGroup>
                <Button color="success" style={styles.listItem} onClick={this.toggle}><FaPlus />Element</Button>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Add Element</ModalHeader>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    }
}

const styles = {
    listView: {
        padding:5
    },
    listItem: {
        marginTop:5,
        width:'100%'
    }
}