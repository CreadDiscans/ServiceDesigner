import React from 'react';
import { ElementType, PropertyType, CSSType } from '../utils/constant';
import Utils from '../utils/utils';
import * as reactstrap from 'reactstrap';
import * as reactNative from 'react-native-web';

export class RenderService {
    
    state;
    func = 'renderPart=(name)=>{};onEvent=(e)=>{};';
    dom = '';
    imp = {React};
    type = 'react' // react or react-native
    options;
    head = '';

    constructor(component, options) {
        if (component.element.children.length > 0 && component.element.children[0].lib === ElementType.ReactNative) {
            this.type = 'react-native';
        } else {
            this.type = 'react';
        }
        this.options = options;
        this.state = component.state;
        this.dom = this.toHtml(component.element);
        this.head = this.toHead();
        // console.log(this.dom);
    }

    getBody() {
        return 'state='+JSON.stringify(this.state)+';'+this.func+'render('+this.dom+')';
    }

    toHtml(elem, forStack = []) {
        this.applyImport(elem);

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
            let attrs = ['id={'+this.getAttrId(elem, forStack, isFor)+'}'];
            if (isFor) {
                attrs.push('key={i'+(forStack.length-1)+'}')
            }
            attrs = attrs.concat(elem.prop.filter(prop=>prop.name !== 'for' || prop.name !== 'text').map(prop=> {
                if (prop.type === PropertyType.Function) {
                    let itemParam = '';
                    if (forStack.length !== 0) {
                        itemParam += ',' + forStack.map((item, i)=> 'item' + i + ':item' + i ).join(',')
                    }
                    return prop.name + '={(e)=>this.onEvent({event:e, name: '+this.getPropValue(elem, 'name')+ itemParam +'})}' 
                } else if (prop.type === PropertyType.Boolean || prop.type === PropertyType.Number || prop.type === PropertyType.Variable) {
                    return prop.name + '={'+prop.value+'}';
                } else if (prop.type === PropertyType.String) {
                    return prop.name + '={"'+prop.value+'"}';
                } else if (prop.type === PropertyType.Object) {
                    return prop.name + '={Object.assign({}, '+prop.value.map(item=> {
                        const value = prop.name === 'style' ? Utils.transform('style ' + item.value)['style'] : JSON.stringify(item.value);
                        if (item.condition === undefined || item.condition === '') {
                            return JSON.stringify(value);
                        } else {
                            return item.condition + ' && ' + JSON.stringify(value);
                        }
                    }).join(',')+')}';
                }
                return ''
            }));
            let output = attrs.join(' ');
            
            this.options.color.forEach(color=> {    
                const re = new RegExp("Color."+color.name, 'g');
                output = output.replace(re, color.value);
            });
            this.options.asset.forEach(asset=> {
                const re = new RegExp("Asset."+asset.name, 'g');
                output = output.replace(re, asset.value);
            })
            return output;
        }

        let tag = this.type === 'react' ? 'div' : ElementType.ReactNative + '.' + 'View';
        if (this.type === 'react') 
        if (elem.tag === 'root' || elem.id === -1) {
            return '<'+tag+' id="'+ elem.id+ '">' + children(forStack) + '</'+tag+'>'
        }

        if (elem.tag !== 'render') {
            if (elem.lib === ElementType.Html) {
                tag = elem.tag;
            } else {
                tag = elem.lib + '.' + elem.tag;
            }
        }

        const forPropValue = this.getPropValue(elem, 'for');                // for property
        if (forPropValue !== undefined) {
            forStack.push(elem);
            return '{'+forPropValue + '.map((item' + (forStack.length-1) + ', i' + (forStack.length-1) + ')=> <' + tag + ' ' + attr(true) + '>' + body() + children(forStack) + '</' + tag + '>)}';
        }

        return '<'+tag+' '+attr()+'>' + body() + children(forStack) + '</'+tag+'>'
    }

    toHead() {
        return this.options.css.filter(css=> css.active).map(css=> {
            if (css.type === CSSType.Url) {
                return '<link rel="stylesheet" href="'+css.value+'">'
            } else if (css.type === CSSType.Style) {
                return '<style>' + css.value + '</style>'
            }
            return ''
        }).join('\n')
    }

    applyImport(elem) {
        if (elem.lib === ElementType.Reactstrap && !(ElementType.Reactstrap in this.imp)) {
            this.imp[ElementType.Reactstrap] = reactstrap;
        } else if (elem.lib === ElementType.ReactNative && !(ElementType.ReactNative in this.imp)) {
            this.imp[ElementType.ReactNative] = reactNative;
        }

    }

    getAttrId(elem, forStack, isFor) {
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
        return id;
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