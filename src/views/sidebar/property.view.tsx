import { View } from '../view';
import React, {CSSProperties} from 'react';
import { ElementProperty, ElementPropertyType } from '../../models/element';

export class PropertyView extends View {

    render() {
        const elem = this.mainCtrl.getSelectedElement();
        console.log(elem);
        return <div style={style.layout}>
            <h5>Property</h5>
            {elem.property.map((item:ElementProperty, i:number)=> 
                <div key={i}>
                    <div>
                        <input type="checkbox" checked={item.isActive} onChange={(e)=>{
                            item.isActive=!item.isActive;
                            this.mainCtrl.refresh()}}/>
                        {item.isActive && item.type != ElementPropertyType.Func &&
                        <input type="checkbox" checked={item.isVariable} onChange={(e)=>{
                            item.isVariable=!item.isVariable
                            this.mainCtrl.refresh()}}/>}
                        {item.name}
                    </div>
                    {item.isActive && <div>{
                        item.isVariable ? <div>
                            <select style={{flex:1}} value={item.value} onChange={(e)=> {
                                item.value = e.target.value;
                                this.mainCtrl.refresh()}}>
                                {['state'].map((op:any)=><option value={op}>{op}</option>)}
                            </select>
                        </div> : <div>
                            {item.type == ElementPropertyType.String && 
                            <input style={{flex:1}} type="text" value={item.value} onChange={(e)=> {
                                item.value = e.target.value
                                this.mainCtrl.refresh()}}/>}
                            {item.type == ElementPropertyType.Number && 
                            <input style={{flex:1}} type="number" value={item.value} onChange={(e)=>{
                                item.value = e.target.value
                                this.mainCtrl.refresh()}}/>}
                            {item.type == ElementPropertyType.Bool && 
                            <input style={{flex:1}} type="checkbox" checked={item.value} onChange={(e)=>{
                                item.value = !item.value
                                this.mainCtrl.refresh()}}/>}
                            {item.type == ElementPropertyType.Enum && 
                            <select style={{flex:1}} value={item.value} onChange={(e)=> {
                                item.value = e.target.value;
                                this.mainCtrl.refresh()}}>
                                {item.select.map((op:any)=><option value={op}>{op}</option>)}
                            </select>}
                        </div>
                    }</div>}
                </div>
            )}
        </div>
    }
}

const style: {[s:string]: CSSProperties;} = {
    layout: {
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        width:200,
        background:'#EEE',
        borderTop:'solid 1px #CCC',
        borderLeft:'solid 1px #CCC'
    }
}