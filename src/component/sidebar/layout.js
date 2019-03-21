import React from 'react';
import { Button } from 'reactstrap'
import {FaAngleRight, FaAngleDown, FaTrashAlt} from 'react-icons/fa'
import PubsubService from './../../service/pubsub.service';

export default class Layout extends React.Component {

    treeView(item, index=0, depth=0) {
        return <div key={depth+'/'+index} style={{
                paddingLeft: depth === 0? 0: item.children.length === 0? 15: 10}}>
            {
                item.children.length > 0 && (
                    item.collapse ? <FaAngleDown onClick={()=> {
                        PubsubService.pub(PubsubService.KEY_SIDEBAR_LAYOUT_UPDATE, {
                            type:'collapse', 
                            id: item.id,
                            value: false
                        })
                    }}/> : <FaAngleRight onClick={()=>{
                        PubsubService.pub(PubsubService.KEY_SIDEBAR_LAYOUT_UPDATE, {
                            type:'collapse', 
                            id: item.id,
                            value: true
                        })
                    }}/>
                )
            }
            <span 
                style={{
                    color:this.props.selected === item ? 'red' : 'black',
                    cursor:'pointer'
                }}
                onClick={()=> {this.selectView(item)}}>{item.component}</span>
            {
                item.collapse && item.children.map((child, i)=> this.treeView(child, i, depth+1))
            }
        </div>
    }
    
    selectView = (item) => {
        PubsubService.pub(PubsubService.KEY_SIDEBAR_LAYOUT_UPDATE, {
            type:'selected',
            item: item
        });
        PubsubService.pub(PubsubService.KEY_SELECT_ELEMENT, item);
    }

    removeElement() {
        PubsubService.pub(PubsubService.KEY_REMOVE_COMPONENT, true);
    }

    render() {
        return <div>
            <h5>Layout</h5>
            <Button color="danger" onClick={()=>this.removeElement()}><FaTrashAlt /></Button>
            {this.treeView(this.props.layout)}
        </div>
    }
} 