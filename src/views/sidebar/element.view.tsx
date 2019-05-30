import React, { CSSProperties } from 'react';
import { ListGroup, 
    ListGroupItem, 
} from 'reactstrap'
import { Layout } from './layout.view'
import { View } from '../view';
import { Element } from '../../models/element';
import { Action } from '../../utils/constant';
import Utils from '../../utils/utils';

export class SidebarElement extends View {
    state = {
        selectedGroup: ''
    }

    addElement(item:Element) {
        const file = this.mainCtrl.getSelectedFile();
        const parent = this.mainCtrl.getSelectedElement();
        const newOne = item.clone();
        newOne.id = Utils.maxId(file.element) + 1;
        this.mainCtrl.elementControl(Action.Create, parent, undefined, newOne);
    }

    render() {
        const elements = this.mainCtrl.getElements();
        if (!elements) return <div></div>
        return <div>
            <Layout />
            <h5>Element</h5>
            <div style={styles.listView}>
                {Object.keys(elements).map((group:string)=> {
                    return <ListGroup key={group}>
                        <ListGroupItem color={group===this.state.selectedGroup?'primary':'secondary'} style={{cursor:'pointer', padding:'0 10px'}} onClick={()=>{
                            if (group === this.state.selectedGroup) {
                                this.setState({selectedGroup:''})
                            } else {
                                this.setState({selectedGroup: group})
                            }
                        }}> {group}</ListGroupItem>
                        {
                            this.state.selectedGroup === group && elements[group].map((item:Element)=> {
                                return <ListGroupItem action key={item.name} style={{cursor:'pointer', padding:'0 10px'}} onClick={()=>{
                                        this.addElement(item);
                                    }}>
                                    {item.name}
                                </ListGroupItem>
                            })
                        }
                    </ListGroup>
                })}
                    
            </div>
        </div>
    }

}

const styles:{[s: string]: CSSProperties;} = {
    listView: {
        padding:5,
        height:500,
        overflow:'auto'
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