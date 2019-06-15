import React from 'react';
import { ElementType, PropertyType } from '../utils/constant';

export class RenderService {
    
    state;
    func = 'renderPart=(name)=>{};onEvent=(e)=>{};';
    dom = '';
    imp = {React};
    type = 'react' // react or react-native

    constructor(component) {
        console.log(component);
        if (component.element.children.length > 0 && component.element.children[0].lib === ElementType.ReactNative) {
            this.type = 'react-native';
        } else {
            this.type = 'react';
        }
        this.state = component.state;
        this.dom = this.toHtml(component.element);
        console.log(this.dom);
    } 

    getBody() {
        return 'state='+JSON.stringify(this.state)+';'+this.func+'render('+this.dom+')';
    }

    toHtml(elem, forStack = []) {
        const children = (forStack) => {
            return elem.children.map(item=> this.toHtml(item, forStack)).join('');
        }

        const body = () => {
            let val = '';
            if (elem.tag === 'render') {
                const namePropValue = this.getPropValue(elem, 'name');          // render element
                val = '{this.renderPart('+namePropValue+')}';
            } else {
                const textPropValue = this.getPropValue(elem, 'text');          // text property
                if (textPropValue !== undefined) {
                    val = '{' + textPropValue + '}';
                }
            }
            return val;
        }

        const attr = (isFor=false) => {
            let prefix = forStack.filter((item, i)=> forStack.length -1 !== i).map((item, i)=> {
                if (this.getPropValue(item, 'for') !== undefined) {
                    return '"' + item.id+'_"+i'+i;
                }
                return item.id
            }).join('+"-"+')
            if (prefix !== '') {
                prefix += '+"-"+'
            }
            let id = prefix + '"' + elem.id + '"';
            if(isFor) {
                id += '+"_"+i'+(forStack.length-1);
            }
            return 'id={'+id+'}';
        }

        let tag = this.type === 'react' ? 'div' : 'reactNative.View';
        if (this.type === 'react') 
        if (elem.tag === 'root' || elem.id === -1) {
            return '<'+tag+' id="'+ elem.id+ '">' + children(forStack) + '</'+tag+'>'
        }

        if (elem.tag !== 'render') {
            tag = elem.tag;
        }

        const forPropValue = this.getPropValue(elem, 'for');                // for property
        if (forPropValue !== undefined) {
            forStack.push(elem);
            return '{'+forPropValue + '.map((item' + (forStack.length-1) + ', i' + (forStack.length-1) + ')=> <' + tag + ' key={i'+(forStack.length-1)+'} ' + attr(true) + '>' + body() + children(forStack) + '</' + tag + '>)}';
        }

        return '<'+tag+' '+attr()+'>' + body() + children(forStack) + '</'+tag+'>'
    }

    getPropValue(elem, name) {
        let property = undefined;
        elem.prop.filter(prop=>prop.name === name).forEach(prop=> property=prop);
        if (property === undefined) {
            return undefined;
        }
        if (property.type === PropertyType.Function) {

        } else if (property.type === PropertyType.Boolean) {
            return property.value;
        } else if (property.type === PropertyType.Number) {
            return property.value;
        } else if (property.type === PropertyType.Object) {

        } else if (property.type === PropertyType.String) {
            return '"' + property.value + '"';
        } else if (property.type === PropertyType.Variable) {
            return property.value;
        } 
        return undefined;
    }

}