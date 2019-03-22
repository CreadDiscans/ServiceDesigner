import React from 'react';
import { ListGroup, 
    ListGroupItem, 
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label
} from 'reactstrap'
import {FaPlus, FaEdit} from 'react-icons/fa'
import DataService from '../../service/data.service'
import { ActionService } from './../../service/action.service';
import ReactJSONEditor from '../reactJsonEditor'
import Utils from '../../service/utils'
import AceEditor from 'react-ace'
import Layout from './layout'
import 'brace/mode/jsx'
import 'brace/theme/github'

export default class SidebarCode extends React.Component {
    state = {
        components: [],
        modal: false,
        id:-1,
        code: '',
        name:'',
        import: '',
        property: {},
    }

    componentDidMount() {
        this.setState({components:DataService.components})
    }

    toggle = ()=> {
        this.setState({modal:!this.state.modal})
    }

    save = () => {
        if (this.isValid()) {
            this.toggle()
            if (this.state.id === -1) {
                let maxId = 0
                this.state.components.forEach(com=> {
                    if (maxId < com.id) {
                        maxId = com.id
                    }
                })
                ActionService.do({
                    type: ActionService.ACTION_CREATE_ELEMENT,
                    page: DataService.page,
                    tag: 'code',
                    item: {
                        id: maxId +1,
                        name:this.state.name,
                        import: this.state.import,
                        code:this.state.code,
                        property: Utils.deepcopy(this.state.property) 
                    },
                })
            } else {
                let target;
                this.state.components.forEach(item=> {
                    if (item.id === this.state.id) target = item;
                })
                ActionService.do({
                    type: ActionService.ACTION_UPDATE_ELEMENT,
                    page: DataService.page,
                    tab: 'code',
                    before: Utils.deepcopy(target),
                    after: {
                        id: this.state.id,
                        name:this.state.name,
                        import: this.state.import,
                        code:this.state.code,
                        property: Utils.deepcopy(this.state.property) 
                    }
                })
            }
        }
    }

    delete = () => {
        if (this.state.id !== -1) {
            let target;
            this.state.components.forEach((item)=> {
                if (this.state.id === item.id) {
                    target = item;
                }
            });
            ActionService.do({
                type:ActionService.ACTION_DELETE_ELEMENT,
                page: DataService.page,
                tab: 'code',
                item: Utils.deepcopy(target)
            })
        }
        this.toggle();
    }

    isValid() {
        return true
    }

    editComponent = (e, item) => {
        this.setState({
            modal: true,
            id: item.id,
            name: item.name,
            code: item.code,
            import: item.import,
            property: Utils.deepcopy(item.property),
        })
        e.stopPropagation();
    }

    addComponent = () => {
        this.setState({
            modal: true,
            id: -1,
            name: '',
            code: '',
            import: '',
            property: {}
        })
    }

    clickComponent = (component) => {
        const convertImport = () => {
            const imp = []
            component.import.split('\n').forEach(line=> {
                line = line.replace(/;/gi, '')
                const lib = line.split('from')[1].replace(/ /, '').replace(/'/gi, '')
                const items = []
                line.split('{')[1].split('}')[0].split(',').forEach(it=> {
                    items.push(it.replace(/ /gi, ''))
                })
                imp.push({from:lib, items:items})
            })
            return imp
        }
        if (this.props.selected) {
            const prop = Utils.deepcopy(component.property)
            let style = {}
            if (prop.style) {
                style = prop.style
                delete prop.style
            }
    
            ActionService.do({
                type: ActionService.ACTION_INSERT_LAYOUT,
                tab: 'code',
                page: DataService.page,
                parent: Utils.deepcopy(this.props.selected),
                item: {
                    id: Utils.maxId(DataService.data[DataService.page])+1,
                    component: component.name,
                    import: convertImport(),
                    code: component.code,
                    style: style,
                    property: prop,
                    children: []
                }
            })
        }

    }

    componentDidUpdate() {
        DataService.components = this.state.components
    }

    render() {
        return <div>
            <Layout layout={this.props.layout} selected={this.props.selected} tab={'code'}/>
            <h5>Code</h5>
            <div style={styles.listView}>
                <ListGroup>
                    {
                        this.state.components.map(item=> {
                            return <ListGroupItem action key={item.name} style={{cursor:'pointer'}} onClick={()=>{
                                    this.clickComponent(item)
                                }}>
                                {item.name}
                                <FaEdit style={styles.editIcon} onClick={(e)=> this.editComponent(e, item)}/>
                            </ListGroupItem>
                        })
                    }
                </ListGroup>
                <Button color="success" style={styles.listItem} onClick={this.addComponent}><FaPlus />Element</Button>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Add Element</ModalHeader>
                <ModalBody>
                    <Label>Name</Label>
                    <Input type="text" onChange={(e)=>this.setState({name:e.target.value})} value={this.state.name} />
                    <Label>import</Label>
                    <AceEditor 
                        style={{width:'100%', height:45}}
                        theme="github" 
                        mode="jsx" 
                        value={this.state.import}
                        onChange={(value)=> this.setState({import:value})}
                        editorProps={{
                          $blockScrolling: false,
                        }} />
                    <Label>Code</Label>
                    {this.sandbox()}
                    <Label>Property</Label>
                    {this.setProperty()}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.save}>Save</Button>{' '}
                    <Button color="danger" onClick={this.delete}>Delete</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    }

    sandbox() {
        return <AceEditor 
            style={{width:'100%', height:200}}
            theme="github" 
            mode="jsx" 
            value={this.state.code}
            onChange={(value)=> this.setState({code:value})}
            editorProps={{
              $blockScrolling: false,
            }} />
    }

    setProperty() {
        return <ReactJSONEditor values={this.state.property} onChange={(values)=>this.setState({property:values})}/>
    }
}

const styles = {
    listView: {
        padding:5
    },
    listItem: {
        marginTop:5,
        width:'100%'
    },
    editIcon:{
        fontSize:20,
        float:'right',
        cursor:'pointer'
    },
    propertyKey: {
        width:'40%',
        display:'inline-block'
    },
    propertyValue: {
        width:'60%',
        display:'inline-block'
    }
}