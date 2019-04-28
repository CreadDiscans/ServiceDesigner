import React from 'react';
import { Button } from 'reactstrap'
import {FaAngleRight, FaAngleDown, FaTrashAlt} from 'react-icons/fa'
import { LayoutManager } from '../../manager/layout.manager';
import { View } from '../view';

export class Layout extends View {

    // layoutManager: LayoutManager;

    // constructor(props:any) {
    //     super(props);
    //     this.layoutManager = LayoutManager.getInstance(LayoutManager);
    // }

    // treeView(item:any, index=0, depth=0) {
    //     return <div key={depth+'/'+index} style={{
    //             paddingLeft: depth === 0? 0: item.children.length === 0? 15: 10}}>
    //         {
    //             item.children.length > 0 && (
    //                 item.collapse ? <FaAngleDown onClick={()=> {
    //                     this.layoutManager.update({id: item.id, collapse: false});
    //                 }}/> : <FaAngleRight onClick={()=>{
    //                     this.layoutManager.update({id: item.id, collapse: true});
    //                 }}/>
    //             )
    //         }
    //         <span 
    //             style={{
    //                 color:this.props.selected === item.id ? 'red' : 'black',
    //                 cursor:'pointer'
    //             }}
    //             onClick={()=> this.layoutManager.select(item.id)}>{item.component}</span>
    //         {
    //             item.collapse && item.children.map((child:any, i:number)=> this.treeView(child, i, depth+1))
    //         }
    //     </div>
    // }

    render() {
        return <div>
            <h5>Layout</h5>
            {/* <Button color="danger" onClick={()=>this.layoutManager.delete()}><FaTrashAlt /></Button>
            {this.treeView(this.props.layout)} */}
        </div>
    }
} 