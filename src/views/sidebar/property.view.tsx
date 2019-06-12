import { View } from '../view';
import React, {CSSProperties} from 'react';
import { ElementProperty, ElementPropertyType, Element } from '../../models/element';
import Utils from './../../utils/utils';

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

    wrapState(root:Element|undefined, target:Element, state:any) {
        if (root === undefined) 
            return [[],[]];
        const stack:any = [];
        let appendItems:any = [];
        const wrapItem = () => {
            stack.forEach((item:Element)=> {
                const forProp = item.prop('for');
                if (forProp !== undefined && forProp.isActive) {
                    if (forProp.value.indexOf('item') === 0) {
                        const re = new RegExp(forProp.value+'\\[\\d+\\]')
                        const tmp:any = [];
                        appendItems.filter((ai:any)=> ai.key.indexOf(forProp.value) === 0)
                            .map((ai:any)=> ({
                                key:ai.key.replace(re, 'item'),
                                type:ai.key.replace(re, 'item') === 'item' ? '??' : ai.type
                            })).forEach((ai:any)=> {
                                if (tmp.filter((tmpItem:any)=> tmpItem.key === ai.key).length === 0) {
                                    tmp.push(ai);
                                }
                            })
                        appendItems = tmp;
                    } else {
                        state.forEach((stateItem:any)=> {
                            if (stateItem.key.indexOf(forProp.value) === 0) {
                                let newKey = stateItem.key.replace(forProp.value, 'item');
                                newKey = newKey.replace(/item\[\d+\]/, 'item')
                                if (appendItems.filter((ai:any)=>ai.key === newKey).length === 0) {
                                    appendItems.push({
                                        key:newKey,
                                        type:newKey === 'item' ? '??' : stateItem.type
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }

        const dfs = (item:Element) => {
            if (item === target) {
                wrapItem();
                return false;
            }
            stack.push(item);
            item.children.forEach((child:Element)=> {
                if (!dfs(child)) {
                    return false;
                }
            });
            stack.pop();
            return true;
        }
        dfs(root);
        const forProp = target.prop('for');
        const stateFor = state.concat(appendItems);
        let stateEtc = Utils.deepcopy(stateFor);
        if (forProp !== undefined && forProp.isActive) {
            const re = new RegExp(forProp.value+'(\\[\\d+\\]){0,1}')
            if (forProp.value.indexOf('item') === 0) {
                stateEtc = stateEtc.map((ai:any)=> ({
                    key:ai.key.replace(re, 'item'),
                    type: ai.key.replace(re, 'item') === 'item' ? '???' : ai.type
                }))
            } else {
                const tmp:any = [];
                stateEtc.filter((ai:any)=> ai.key.indexOf(forProp.value) === 0)
                    .map((ai:any)=> ({
                        key: ai.key.replace(re, 'item'),
                        type:ai.key.replace(re, 'item') === 'item' ? '????': ai.type
                    }))
                    .forEach((ai:any)=> {
                        if (tmp.filter((tmpItem:any)=> tmpItem.key === ai.key).length === 0) {
                            tmp.push(ai);
                        }
                    })
                stateEtc = stateEtc.filter((item:any)=>item.key.indexOf('item')=== -1).concat(tmp);
            }
        }
        return [stateFor, stateEtc];
    }

    render() {
        const elem = this.mainCtrl.getSelectedElement();
        const root = this.mainCtrl.getSelectedFile().element;
        const state = this.getState();
        const result = this.wrapState(root, elem, state);
        const stateFor = result[0];
        const stateEtc = result[1];
        return <div style={style.layout}>
            <h5>Property</h5>
            {elem.property.map((item:ElementProperty, i:number)=> 
                <div key={i}>
                    <div>
                        <input type="checkbox" checked={item.isActive} onChange={(e)=>{
                            item.active=!item.isActive;
                            if (item.name === 'for') {
                                const arrState = state.filter((st:any)=>st.type===item.type)
                                if (arrState.length > 0) item.value = arrState[0].key;
                                else item.active = false;
                            }
                            this.mainCtrl.refresh()}}/>
                        {item.name !== 'for' && item.isActive &&
                        <input type="checkbox" checked={item.isVariable} onChange={(e)=>{
                            item.isVariable=!item.isVariable;
                            const arrState = state.filter((st:any)=>st.type===item.type)
                            if (arrState.length > 0) item.value = arrState[0].key;
                            else if (item.type === ElementPropertyType.Func) {}
                            else item.isVariable = false;
                            this.mainCtrl.refresh()}}/>}
                        {item.name}
                    </div>
                    {item.isActive && item.type !== ElementPropertyType.Func && <div>{
                        item.isVariable ? <div>
                            <select style={{flex:1}} value={item.value} onChange={(e)=> {
                                item.value = e.target.value;
                                this.mainCtrl.refresh()}}>
                                { item.name === 'for' ? 
                                [stateFor.filter((st:any)=>st.type === item.type)
                                    .map((op:any, i:number)=><option value={op.key} key={i}>{op.key}</option>)] : 
                                [stateEtc.filter((st:any)=>st.type === item.type)
                                    .map((op:any, i:number)=><option value={op.key} key={i}>{op.key}</option>)]}
                            </select>
                        </div> : <div>
                            {
                                item.select.length !== 0 ? <select style={{flex:1}} value={item.value} onChange={(e)=> {
                                    item.value = e.target.value;
                                    this.mainCtrl.refresh();
                                    }}>
                                    {item.select.map((item:any)=> <option key={item} value={item}>{item}</option>)}
                                </select> : 
                                [item.type === ElementPropertyType.String && 
                                    <input style={{flex:1}} type="text" value={item.value} onChange={(e)=> {
                                        item.value = e.target.value
                                        this.mainCtrl.refresh()}}/>, 
                                item.type === ElementPropertyType.Number && 
                                <input style={{flex:1}} type="number" value={item.value} onChange={(e)=>{
                                    item.value = e.target.value
                                    this.mainCtrl.refresh()}}/>,
                                item.name !== 'for' && item.type === ElementPropertyType.Array && 
                                <input style={{flex:1}} type="text" checked={item.value} onChange={(e)=>{
                                    try{
                                        const arr = JSON.parse(e.target.value)
                                        if (Array.isArray(arr)) {
                                            item.value = arr;
                                            this.mainCtrl.refresh();
                                        }
                                    } catch(e) {}
                                }}/>]
                            }
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
        bottom:283,
        right:0,
        width:200,
        background:'#EEE',
        borderTop:'solid 1px #CCC',
        borderLeft:'solid 1px #CCC'
    }
}