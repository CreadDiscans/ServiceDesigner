
import { Controller } from './controller';
import { File } from '../models/file';
import React from 'react';
import { Element } from './../models/element';
import { LibraryTable } from './library/librarytable';
import Utils from './../utils/utils';
import { Platform } from '../utils/constant';
import { ResourceType, Resource } from '../models/resource';

export class RenderController extends Controller {

    private cssCache = {};

    render(file:File) {
        if (!file || !file.element) throw 'no element';
        const imp:any = {React};
        const code = this.parse(file.element, imp, file.state);
        console.log(imp, code, file.state);
        return {
            state: file.state,
            imp: imp,
            code: code
        }
    }

    private parse(elem:Element, imp:any, state:any) {
        this.parseLibrary(elem, imp)

        let code = elem.code;
        let children = '';
        elem.children.forEach((child:Element)=> {
            children += this.parse(child, imp, state);
        });
        let styles = {};
        Object.keys(elem.property).forEach(prop=> {
            if (prop === 'class') {
                elem.property[prop].split(' ').forEach((cls:string)=> {
                    const rsc = this.main.getResource(ResourceType.CSS, cls);
                    if (rsc && !Array.isArray(rsc)) {
                        styles = Utils.merge(styles, this.convertCssToStyle(rsc.value, cls));
                    }
                })
            } else  {
                code = code.replace('{'+prop+'}', this.parseProperty(prop, elem.property[prop]));
            }
        });
        code = code.replace('{style}', this.parseStyle(elem, styles));
        code = code.replace('{children}', children);
        code = this.parseIfAndForLoop(elem, code, state);
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
        if (elem.library) {
            elem.library.forEach(item=> {
                const service = LibraryTable[item.dependency];
                item.items.forEach(key=> {
                    imp[key] = service.get(key);
                });
            });
        }
    }

    private parseProperty(key:string, value:string):string {
        if (typeof(value) === 'object') {
            value = JSON.stringify(value);
        } else if (typeof(value) === 'string') {
            if (value === '{item}' || 
                (value.indexOf('{item.')===0 && value[value.length-1] === '}' && value !== '{item.}') ||
                (value.indexOf('{this.state.') === 0 && value[value.length-1] === '}' && value !== '{this.state.}')) {
                value = value.slice(1, value.length-1)
            } else if (value.indexOf('Asset.') === 0) {
                value = '';
                // asset
                // Object.keys(assetManager.data).forEach(asset=> {
                //     if (value === 'Asset.'+asset) {
                //         if (exporting) {
                //             value = 'DesignedAssets.'+ asset;
                //         } else {
                //             value = '"' + assetManager.data[asset] + '"';
                //         }
                //     }
                // });
            } else if (key === 'icon') {
            } else {
                value = '"' + String(value) + '"'
            }   
        }
        return value;
    }

    private parseStyle(elem:Element, origin={}):string {
        let style:any = this.convertCssToStyle(Utils.deepcopy(elem.style), 'style');
        if (elem === this.main.getSelectedElement()) {
            style.border = 'solid 1px red';
        }
        style = Utils.merge(origin, style);
        Object.keys(style).forEach(key=> {
            const colors = this.main.getResource(ResourceType.COLOR);
            if (Array.isArray(colors)) {
                colors.forEach((color:Resource)=> {
                    if (style[key] === '"Color.'+color.name+'"') {
                        style[key] = color.value;
                    }
                });
            }
        })
        let stringStyle = JSON.stringify(style);
        // if (Array.isArray(colors)) {
        //     colors.forEach((color:Resource)=> {
        //         const re = new RegExp('"Color.'+color.name+'"', 'g');
        //         stringStyle = stringStyle.replace(re, color.value);
        //         console.log(stringStyle, re, color.value);
        //     });
        // }
        // asset
        return stringStyle;
    }

    private parseIfAndForLoop(elem:Element, code:string, state:any):string {
        let brace = false;
        if (elem.property['for'] && elem.property['for'] !== '' && Array.isArray(state[elem.property['for']])) {
            code = code.replace('>', 'key={i} >');
            code = 'this.state.' + elem.property['for'] + '.map((item, i)=> '+code+')';
            brace = true;
        }
        if (elem.property['if'] && elem.property['if'] !== '') {
            code = 'this.state.'+elem.property['if'] + ' && '+code;
            brace = true;
        }
        if (brace) {
            code = '{ ' + code + ' }';
        }
        return code;
    }
}