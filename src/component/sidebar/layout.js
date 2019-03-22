import React from 'react';
import { Button } from 'reactstrap'
import {FaAngleRight, FaAngleDown, FaTrashAlt} from 'react-icons/fa'
import PubsubService from './../../service/pubsub.service';
import { ActionService } from './../../service/action.service';
import Utils from './../../service/utils';
import DataService from './../../service/data.service';

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
        if (this.props.selected) {
            let parent;
            Utils.loop(DataService.data[DataService.page], (item)=> {
                item.children.forEach(child=> {
                    if (child.id === this.props.selected.id) {
                        parent = item
                    }
                })
            });
            if (parent) {
                ActionService.do({
                    type: ActionService.ACTION_DELETE_LAYOUT,
                    tab: this.props.tab,
                    page: DataService.page,
                    target: Utils.deepcopy(this.props.selected),
                    parent: Utils.deepcopy(parent)
                })
            }
        }
    }

    render() {
        return <div>
            <h5>Layout</h5>
            <Button color="danger" onClick={()=>this.removeElement()}><FaTrashAlt /></Button>
            {this.treeView(this.props.layout)}
        </div>
    }
} 