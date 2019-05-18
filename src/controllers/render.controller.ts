
import { Controller } from './controller';
import { File } from '../models/file';
import React from 'react';
import { Element, ElementStyle } from './../models/element';
import Utils from './../utils/utils';
import { ResourceType, Resource } from '../models/resource';
import { Platform } from '../utils/constant';
import { Library } from '../models/library';

export class RenderController extends Controller {

    private cssCache = {};

    render(file:File, selection=true) {
        if (!file || !file.element) throw 'no element';
        const imp:any = {React};
        const code = this.parse(file.element, imp, file.state, selection);
        console.log(code);
        return {
            state: file.state,
            imp: imp,
            code: code
        }
    }

    private parse(elem:Element, imp:any, state:any, selection=true) {
        let code = this.parseLibrary(elem, imp)

        let children = '';
        elem.children.forEach((child:Element)=> {
            children += this.parse(child, imp, state, selection);
        });
        let styles = {};
        Object.keys(elem.property).forEach(prop=> {
            if (prop === 'class') {
                elem.property[prop].split(' ').forEach((cls:string)=> {
                    const rsc = this.main.getResource(ResourceType.CSS, cls);
                    if (rsc && !Array.isArray(rsc)) {
                        styles = Utils.merge(styles, this.convertCssToStyle(rsc.value, cls.replace('-', '_')));
                    }
                })
            } else  {
                code = code.split('{'+prop+'}').join(this.parseProperty(prop, elem.property[prop]));
            }
        });
        code = code.replace('{style}', this.parseStyle(elem, styles, selection));
        code = code.replace('{children}', children);
        code = this.parseForLoop(elem, code, state);
        return code;
    }

    private convertCssToStyle(css:string, key:string) {
        if (css === undefined) {
            return {}
        } 
        try {
            this.cssCache = Utils.transform(css)[key];
        } catch(e) {
            console.log(e, css);
        }
        return this.cssCache;
    }

    // private isValidIcon(elem:Element):boolean {
    //     if (!elem.library || elem.library.length == 0) {
    //         return true;
    //     }
    //     if(elem.library[0].dependency === LibraryDependency.ReactIcon) {
            
    //     } else if (elem.library[0].dependency === LibraryDependency.ReactNativeVectorIcon) {

    //     }
    // }

    private parseLibrary(elem:Element, imp:any) {
        let code = elem.code;
        if (elem.library) {
            elem.library.forEach((item:Library)=> {
                imp[item.key] = item.get().lib;
                // code = code.replace('<', '<'+item.key+'.');
                // code = code.replace('</', '</'+item.key+'.')
            });
        }
        return code;
    }

    private parseProperty(key:string, value:any):string {
        if (typeof value === 'string') {
            if (value === '{item}' || 
                (value.indexOf('{item.')===0 && value[value.length-1] === '}' && value !== '{item.}') ||
                (value.indexOf('{this.state.') === 0 && value[value.length-1] === '}' && value !== '{this.state.}')) {
                value = value.slice(1, value.length-1)
            } else if (value.indexOf('Asset.') === 0) {
                const temp = value;
                value = '""';
                const assets = this.main.getResource(ResourceType.ASSET);
                if (Array.isArray(assets)) {
                    assets.forEach((asset:Resource)=> {
                        if (temp === 'Asset.'+asset.name) {
                            value = '"'+asset.value + '"';
                        }
                    })
                }
            } else if (value) {
                value = '"' + String(value) + '"'
            } 
        } else if (!value.type) {
            value = JSON.stringify(value);
        } else if (value.type === 'enum') {
            value = '"' + value.value + '"';
        } else {
            value = value.value;
        }
        return value;
    }

    private parseStyle(elem:Element, origin={}, selection=true):string {
        const stringItem:Array<string> = [];
        elem.style.forEach((item:ElementStyle, i:number)=> {
            let style:any = this.convertCssToStyle(item.style, 'style');
            if (i === 0) {
                if (elem === this.main.getSelectedElement() && selection) {
                    if (this.main.getPlatform() === Platform.React) {
                        style.border = 'solid 1px red';
                    } else if (this.main.getPlatform() === Platform.ReactNative) {
                        style.borderColor = 'red';
                        style.borderWidth = '1px';
                    }
                }
                style = Utils.merge(origin, style);
            }
            Object.keys(style).forEach(key=> {
                const colors = this.main.getResource(ResourceType.COLOR);
                if (Array.isArray(colors)) {
                    colors.forEach((color:Resource)=> {
                        if (style[key] === '"Color.'+color.name+'"') {
                            style[key] = color.value;
                        }
                    });
                }
                const assets = this.main.getResource(ResourceType.ASSET);
                if (Array.isArray(assets)) {
                    assets.forEach((asset:Resource)=> {
                        if (style[key] === '"Asset.'+asset.name+'"') {
                            style[key] = 'url(' + asset.value + ')';
                        }
                    })
                }
            })
            let condition = '';
            if (item.condition !== '') {
                condition = item.condition + ' && '
            }
            stringItem.push(condition + JSON.stringify(style));
        });
        let stringStyle = '';
        if (this.main.getPlatform() === Platform.React) {
            stringStyle = 'Object.assign({},';
            stringItem.forEach((item:string, i:number)=> {
                stringStyle += item;
                if (i !== stringItem.length-1)
                    stringStyle += ', '
            });
            stringStyle += ')';
        } else  if (this.main.getPlatform() === Platform.ReactNative) {
            stringStyle = '[';
            stringItem.forEach((item:string, i:number)=> {
                stringStyle += item;
                if (i !== stringItem.length-1)
                    stringStyle += ', '
            });
            stringStyle += ']';
        }
        return stringStyle;
    }

    private parseForLoop(elem:Element, code:string, state:any):string {
        if (elem.property['for'] && elem.property['for'] !== '' && Array.isArray(state[elem.property['for']])) {
            code = code.replace('>', 'key={i} >');
            code = '{this.state.' + elem.property['for'] + '.map((item, i)=> '+code+')}';
        }
        return code;
    }
}