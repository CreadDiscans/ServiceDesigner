// import * as React from 'react';
import { ElementType, PropertyType, CSSType, FileType } from './constant';
import Utils from './Utils';
// import * as reactstrap from 'reactstrap';
// import * as reacticons from 'react-icons/all';
// import * as reactNative from 'react-native';
// import * as reactNativeElement from '../lib/react-native-elements/src';
import * as _ from 'lodash';
import { ajax } from 'rxjs/ajax';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from './Theme';
// import { Theme } from '../utils/Theme';
import { XMLHttpRequest } from 'xmlhttprequest'

export class RenderService {
    private static TEMPLATE_REACT_ICONS_IMPORT = "import * as ri_fa from 'react-icons/fa';\nimport * as ri_io from 'react-icons/io';\nimport * as ri_md from 'react-icons/md';\nimport * as ri_ti from 'react-icons/ti';\nimport * as ri_go from 'react-icons/go';\nimport * as ri_fi from 'react-icons/fi';\nimport * as ri_gi from 'react-icons/gi';\nimport * as ri_wi from 'react-icons/wi';\nimport * as ri_di from 'react-icons/di';";
    private static TEMPLATE_REACT_ICONS_ASSIGN = "const ri = {};\nObject.assign(ri, ri_fa);\nObject.assign(ri, ri_io);\nObject.assign(ri, ri_md);\nObject.assign(ri, ri_ti);\nObject.assign(ri, ri_go);\nObject.assign(ri, ri_fi);\nObject.assign(ri, ri_gi);\nObject.assign(ri, ri_wi);\nObject.assign(ri, ri_di);";
    private static TEMPLATE_REACT_IMPORT = "import React from 'react';\nimport * as "+ElementType.Reactstrap+" from 'reactstrap';\n"+RenderService.TEMPLATE_REACT_ICONS_IMPORT+"\nimport './design.style.css';\n"+RenderService.TEMPLATE_REACT_ICONS_ASSIGN+'\n';
    private static TEMPLATE_REACT_NATIVE_IMPORT = "import  React from 'react';\nimport * as "+ElementType.ReactNative+" from 'react-native';\nimport * as "+ElementType.ReactNativeElements+" from 'react-native-elements';\n";
    private static TEMPLATE_ABSTRACT = "class DesignedComponent<P, S> extends React.Component<P, S> {\n\tonEvent(e:any){}\n\trenderPart(name:any){}\n}\n";
    private static TEMPLATE_CLASS = "export class {classname}<P={}, S={}> extends DesignedComponent<P, S> {\n\t{state}\n\trender() {\n\t\t// @ts-ignore\n\t\treturn {code}\n\t}\n}\n";

    // common 
    type = 'react' // react or react-native
    options;

    // render One
    state;
    func = 'renderPart=(name)=>{};onEvent=(e)=>{};';
    dom = '';
    // imp = {React};
    head = '';

    // render All
    js = []

    renderOne(component, options) {
        // console.log(component);
        if (component.element.children && component.element.children.length > 0 && 
                (component.element.children[0].lib === ElementType.ReactNative || component.element.children[0].lib === ElementType.ReactNativeElements)) {
            this.type = 'react-native';
        } else {
            this.type = 'react';
        }
        this.options = options;
        this.state = component.state;
        this.dom = this.toHtml(component.element);
        this.head = this.toHead();
        // console.log(this.dom);
        return this;
    }

    renderAll(components, options) {
        this.js = [];
        this.options = options;
        components.forEach(comp=> Utils.loop(comp, (item, stack)=> {
            if (item.type === FileType.FILE) {
                const prefix = stack.map(stackItem=> _.capitalize(stackItem.name)).join('')
                const renderService = new RenderService().renderOne(item, options);
                this.js.push(RenderService.TEMPLATE_CLASS
                    .replace('{classname}', 'Designed' + prefix + _.capitalize(item.name))
                    .replace('{state}', 'state:any='+item.state)
                    .replace('{code}', renderService.dom)) 
                this.type = renderService.type;
            }
        }))

        return this;
    }

    toJs() {
        let js = '';
        if (this.type === 'react') {
            js += RenderService.TEMPLATE_REACT_IMPORT;
        } else if (this.type === 'react-native') {
            js += RenderService.TEMPLATE_REACT_NATIVE_IMPORT;
        }

        js += RenderService.TEMPLATE_ABSTRACT;
        js += this.js.join('\n');

        return js;
    }

    toCss() {
        if (this.type === 'react-native') {
            return Promise.resolve(undefined)
        }
        return new Promise(resolve=> {
            const works = [];
            this.options.css.filter(css=> css.active).forEach(css=> {
                if (css.type === CSSType.Url) {
                    works.push(ajax({
                        createXHR: ()=> new XMLHttpRequest(),
                        url: css.value,
                        method: 'GET',
                        responseType: 'text', 
                        crossDomain: true 
                    }))
                } else if (css.type === CSSType.Style) {
                    works.push(of(css.value))
                }
            });
            let css = '';
            if (works.length === 0) {
                resolve(css);
            }
            forkJoin(works).pipe(
                map((res:any)=> res.map(eachRes=> {
                        if (typeof eachRes === 'string') {
                            return eachRes
                        } else {
                            return eachRes.response
                        }
                    })
                )
            ).subscribe(data=> {
                css = data.join('\n');
                resolve(css);
            })
        })
    }

    getBody() {
        // console.log(this.dom);
        return 'state='+this.state+';'+this.func+'render('+this.dom+')';
    }

    toHtml(elem, forStack = [], key = -1) {
        // this.applyImport(elem);

        const children = (forStack, isRoot=false) => {
            return elem.children.map((item, i)=> this.toHtml(item, forStack, isRoot ? i : -1)).join(isRoot ? ',':'');
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
            } else if (key !== -1) {
                attrs.push('key={'+key+'}')
            }
            const styleNameProp = this.getPropValue(elem, 'styleName');
            attrs = attrs.concat(elem.prop.filter(prop=>['for', 'text', 'styleName'].indexOf(prop.name) === -1).map(prop=> {
                if (prop.type === PropertyType.Function) {
                    let itemParam = '';
                    if (forStack.length !== 0) {
                        itemParam += ',' + forStack.map((item, i)=> 'item' + i + ':item' + i ).join(',')
                    }
                    return prop.name + '={(e)=>this.onEvent({event:"'+prop.name+'",value:e, name: '+this.getPropValue(elem, 'name')+ itemParam +'})}' 
                } else if (prop.type === PropertyType.Boolean || prop.type === PropertyType.Number || prop.type === PropertyType.Variable) {
                    return prop.name + '={'+prop.value+'}';
                } else if (prop.type === PropertyType.String) {
                    if (prop.name === 'source') {
                        return prop.name + '={{uri:"'+prop.value+'"}}';
                    }
                    return prop.name + '={"'+prop.value+'"}';
                } else if (prop.type === PropertyType.Object) {
                    return prop.name + '={Object.assign({}, '+prop.value.map(item=> {
                        let value = prop.name === 'style' ? Utils.transform('style ' + item.value)['style'] : JSON.stringify(item.value);
                        if (styleNameProp !== undefined) {
                            this.options.style.forEach(style=> {
                                value = Object.assign({},Utils.transform(style.value)[styleNameProp.replace(/"/gi,'')], value); 
                            })
                        }
                        if (this.options.select && this.options.select.id === elem.id) {
                            value['borderStyle'] = 'solid';
                            value['borderWidth'] = 1;
                            value['borderColor'] = 'red';
                        } else if (this.options.hover && this.options.hover.id === elem.id) {
                            value['borderStyle'] = 'solid';
                            value['borderWidth'] = 1;
                            value['borderColor'] = Theme.danger
                        }
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
            
            this.options.color.sort((a,b)=> a.name > b.name ? -1 : 1).forEach(color=> {    
                const re = new RegExp("Color."+color.name, 'g');
                output = output.replace(re, color.value);
            });
            this.options.asset.sort((a,b)=> a.name > b.name ? -1 : 1).forEach(asset=> {
                const re = new RegExp("Asset."+asset.name, 'g');
                output = output.replace(re, asset.value);
            })
            return output;
        }

        let tag = this.type === 'react' ? 'div' : ElementType.ReactNative + '.View';
        if (elem.children === undefined) {
            return '<'+tag+'></'+tag+'>';
        }
        if (elem.tag === 'root' || elem.id === -1) {
            return '[' + children(forStack, true) + ']'
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
            const code = '{'+forPropValue + '.map((item' + (forStack.length-1) + ', i' + (forStack.length-1) + ')=> <' + tag + ' ' + attr(true) + '>' + body() + children(forStack) + '</' + tag + '>)}';
            forStack.pop()
            return code;
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

    // applyImport(elem) {
    //     if (elem.lib === ElementType.Reactstrap && !(ElementType.Reactstrap in this.imp)) {
    //         this.imp[ElementType.Reactstrap] = reactstrap;
    //     } else if (elem.lib === ElementType.ReactNative && !(ElementType.ReactNative in this.imp)) {
    //         this.imp[ElementType.ReactNative] = reactNative;
    //     } else if (elem.lib === ElementType.ReactIcons && !(ElementType.ReactIcons in this.imp)) {
    //         this.imp[ElementType.ReactIcons] = reacticons;
    //     } else if (elem.lib === ElementType.ReactNativeElements && !(ElementType.ReactNativeElements in this.imp)) {
    //         this.imp[ElementType.ReactNativeElements] = reactNativeElement;
    //     }

    // }

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