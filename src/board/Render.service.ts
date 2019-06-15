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

    toHtml(elem) {
        let tag = this.type === 'react' ? 'div' : 'reactNative.View';
        if (this.type === 'react') 
        if (elem.tag === 'root' || elem.id === -1) {
            return '<'+tag+' id="'+ elem.id+ '">' + elem.children.map(item=> this.toHtml(item)).join('')+ '</'+tag+'>'
        }
        let body = ''
        
        if (elem.tag !== 'render') {
            tag = elem.tag;
            const textPropValue = this.getPropValue(elem, 'text');
            if (textPropValue !== undefined) {
                body = '{' + textPropValue + '}';
            }
        } else {
            const namePropValue = this.getPropValue(elem, 'name');
            body = '{this.renderPart('+namePropValue+')}'
        }

        return '<'+tag+' id="'+elem.id+'">' + body + elem.children.map(item=> this.toHtml(item)).join('') + '</'+tag+'>'
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