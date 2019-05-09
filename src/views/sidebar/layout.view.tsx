import React from 'react';
import { Button } from 'reactstrap'
import {FaAngleRight, FaAngleDown, FaTrashAlt, FaArrowAltCircleDown, FaArrowAltCircleUp} from 'react-icons/fa'
import { View } from '../view';
import { Element } from '../../models/element';
import { Action } from '../../utils/constant';
import Utils from '../../utils/utils';

export class Layout extends View {

    removeElement(root?:Element) {
        if (!root) return;
        const target = this.mainCtrl.getSelectedElement();
        let parent;
        Utils.loop(root, (item:Element)=> {
            item.children.forEach((child:Element, i:number)=> {
                if (child.id === target.id) {
                    parent = item;
                }
            })
        })
        this.mainCtrl.elementControl(Action.Delete, parent, target.clone(), undefined);
    }

    moveElement(root:Element|undefined, dir:string) {
        if (!root) return;
        const target = this.mainCtrl.getSelectedElement();
        let parent!:Element;
        let index!:number;
        Utils.loop(root, (item:Element)=> {
            item.children.forEach((child:Element, i:number)=> {
                if (child.id === target.id) {
                    parent = item;
                    index = i;
                }
            })
        });
        if (dir === 'up') {
            if (index !== 0) {
                Utils.arrayMove(parent.children, index, index-1);
                this.mainCtrl.home$.next(true);
                this.mainCtrl.sidebar$.next(true);
            }
        } else if (dir === 'down') {
            if (index < parent.children.length-1) {
                Utils.arrayMove(parent.children, index, index+1);
                this.mainCtrl.home$.next(true);
                this.mainCtrl.sidebar$.next(true);
            }
        }
    }

    treeView(item:Element, index=0, depth=0) {
        return <div key={depth+'/'+index} style={{
                paddingLeft: depth === 0? 0: item.children.length === 0? 15: 10}}>
            {
                item.children.length > 0 && (
                    item.collapse ? <FaAngleDown onClick={()=> {
                        item.collapse = false;
                        this.mainCtrl.sidebar$.next(true);
                    }}/> : <FaAngleRight onClick={()=>{
                        item.collapse = true;
                        this.mainCtrl.sidebar$.next(true);
                    }}/>
                )
            }
            <span 
                style={{
                    color:this.mainCtrl.getSelectedElement().id === item.id ? 'red' : 'black',
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
            <Button color="info" onClick={()=>this.moveElement(file.element, 'up')}><FaArrowAltCircleUp /></Button>
            <Button color="info" onClick={()=>this.moveElement(file.element, 'down')}><FaArrowAltCircleDown /></Button>
            <Button color="danger" onClick={()=>this.removeElement(file.element)}><FaTrashAlt /></Button>
            {file.element && this.treeView(file.element)}
        </div>
    }
} 