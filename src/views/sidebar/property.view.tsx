import { View } from '../view';
import React, {CSSProperties} from 'react';
import { ElementProperty, ElementPropertyType } from '../../models/element';

export class PropertyView extends View {

    getState() {
        const state = this.mainCtrl.getSelectedFile().state;
        const stack:Array<string|number> = ['this.state'];
        const stateSeializer:any = [];
        const getKey = () => {
            let key = '';
            stack.forEach((value:any, i:number)=>{
                if (typeof value === 'string') {
                    if (i===0) key = value;
                    else key += '.'+value;
                } else if (typeof value === 'number') {
                    key += '['+value+']'
                }
            });
            return key;
        }

        const loop = (item:any) => {
            if (Array.isArray(item)) {
                stateSeializer.push({key:getKey(), type:'array'})
                item.forEach((child:any, i:number)=> {
                    stack.push(i);
                    loop(child)
                    stack.pop();
                });
            } else if(typeof item === 'object') {
                stateSeializer.push({key:getKey(), type:'object'})
                Object.keys(item).forEach((child:string)=> {
                    stack.push(child);
                    loop(item[child])
                    stack.pop();
                });
            } else {
                stateSeializer.push({key:getKey(), type:typeof item});
            }
        }
        loop(state);
        return stateSeializer
    }

    render() {
        const elem = this.mainCtrl.getSelectedElement();
        const state = this.getState();
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
                            item.isVariable=!item.isVariable;
                            const arrState = state.filter((st:any)=>st.type===item.type)
                            if (arrState.length > 0) item.value = arrState[0].key;
                            else item.isVariable = false;
                            this.mainCtrl.refresh()}}/>}
                        {item.name}
                    </div>
                    {item.isActive && <div>{
                        item.isVariable ? <div>
                            <select style={{flex:1}} value={item.value} onChange={(e)=> {
                                item.value = e.target.value;
                                this.mainCtrl.refresh()}}>
                                {state.filter((st:any)=>st.type === item.type)
                                    .map((op:any, i:number)=><option value={op.key} key={i}>{op.key}</option>)}
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
                            {item.type == ElementPropertyType.Array && 
                            <input style={{flex:1}} type="checkbox" checked={item.value} onChange={(e)=>{
                                try{
                                    const arr = JSON.parse(e.target.value)
                                    if (Array.isArray(arr)) {
                                        item.value = arr;
                                        this.mainCtrl.refresh();
                                    }
                                } catch(e) {}
                                }}/>}
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