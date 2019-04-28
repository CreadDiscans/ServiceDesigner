import React from 'react';
import { Button } from 'reactstrap'
import {FaAngleRight, FaAngleDown, FaTrashAlt} from 'react-icons/fa'
import { View } from '../view';
import { Element } from '../../models/element';
import { Action } from '../../utils/constant';
import Utils from '../../utils/utils';

export class Layout extends View {

    removeElement(root?:Element) {
        if (!root) return;
        const target = this.mainCtrl.getSelectedElement();
        Utils.loop(root, (item:Element)=> {
            item.children.forEach((child:Element, i:number)=> {
                if (child === target) {
                    item.children.splice(i, 1);
                    this.mainCtrl.elementControl(Action.Delete, item);
                }
            })
        })
    }

    treeView(item:Element, index=0, depth=0) {
        return <div key={depth+'/'+index} style={{
                paddingLeft: depth === 0? 0: item.children.length === 0? 15: 10}}>
            {
                item.children.length > 0 && (
                    item.collapse ? <FaAngleDown onClick={()=> {
                        item.collapse = false;
                        this.mainCtrl.elementControl(Action.Update, item);
                    }}/> : <FaAngleRight onClick={()=>{
                        item.collapse = true;
                        this.mainCtrl.elementControl(Action.Update, item);
                    }}/>
                )
            }
            <span 
                style={{
                    color:this.mainCtrl.getSelectedElement().name === item.name ? 'red' : 'black',
                    cursor:'pointer'
                }}
                onClick={()=> this.mainCtrl.selectElement(item)}>{item.name}</span>
            {
                item.collapse && item.children.map((child:any, i:number)=> this.treeView(child, i, depth+1))
            }
        </div>
    }

    render() {
        const file = this.mainCtrl.getSelectedFile();
        return <div>
            <h5>Layout</h5>
            <Button color="danger" onClick={()=>this.removeElement(file.element)}><FaTrashAlt /></Button>
            {file.element && this.treeView(file.element)}
        </div>
    }
} 