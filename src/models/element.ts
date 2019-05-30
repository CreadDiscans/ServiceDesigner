import { Library, LibraryKeys } from './library';
import Utils from '../utils/utils';
import { Resource } from './resource';

export class ElementStyle {
    condition:string = '';
    style:string = 'style{\n\n}';

    toJson() {
        return {
            condition: this.condition,
            style: this.style
        }
    }

    clone() {
        return ElementStyle.parse(this.toJson());
    }

    static parse(json:any):ElementStyle {
        const newOne = new ElementStyle();
        newOne.condition = json.condition;
        newOne.style = json.style;
        return newOne;
    }
}

export enum ElementPropertyType {
    String = 'string',
    Number = 'number',
    Bool = 'boolean',
    Array = 'array',
    Func = 'function'
}

export class ElementProperty {
    type: ElementPropertyType;
    name: string;
    value: any;
    default: any;
    isActive:boolean = false;
    isVariable:boolean = false;
    select = [];
    constructor(type:ElementPropertyType, name:string, value:string) {
        this.type = type;
        this.name = name;
        this.default = value;
        this.value  = value;
    }

    set active(val:boolean) {
        this.isActive = val;
        if (this.name === 'for') {
            this.isVariable = val;
        }
    }

    static parse(json:any) {
        const one = new ElementProperty(json.type, json.name, json.default);
        if (json.value) one.value = json.value;
        if (json.isActive) one.isActive = json.isActive;
        if (json.isVariable) one.isVariable = json.isVariable;
        if (json.select) one.select = json.select;
        if (one.value === undefined) one.value = ''; 
        return one;
    }

    toJson() {
        return {
            type: this.type,
            name: this.name,
            value: this.value,
            default: this.default,
            isActive: this.isActive,
            isVariable: this.isVariable,
            select: Utils.deepcopy(this.select)
        }
    }

    toVal(elem:Element|undefined=undefined, assets:any=undefined) {
        if (this.name === 'text') {
            if (this.isVariable) return '{' + this.value + '}';
            else return this.value;
        } else if (this.name === 'source') {
            let value = this.value;
            assets.forEach((item:Resource)=> {
                if ('Asset.'+item.name === this.value) {
                    value = item.value;
                }
            })
            if (value) return this.name + '={{uri:"'+value+'"}}';
            else return '';
        } else if (this.type == ElementPropertyType.Func) {
            let name = '';
            let item = '';
            if (elem) {
                const nameProp = elem.prop('name');
                if (nameProp && nameProp.isVariable) {
                    name = nameProp.value;
                } 
                else if (nameProp && !nameProp.isVariable) {
                    name = '"' + nameProp.value + '"'
                }
            }
            if (this.isVariable) {
                item = ', item:item'
            }
            return this.name + '={(e)=>this.onEvent({event:"'+this.name+'", name:'+name+', value:e'+item+'})}';
        } else if (this.isVariable) {
            return this.name + '={'+this.value+'}'
        } else if (this.type == ElementPropertyType.String) {
            return this.name + '={"'+this.value+'"}'
        } else if (this.type == ElementPropertyType.Number) {
            return this.name + '={'+this.value+'}'
        } else if (this.type == ElementPropertyType.Bool) {
            if (this.isVariable) {
                return this.name + '={'+this.value+'}'
            } else {
                return this.name
            }
        } else if (this.type == ElementPropertyType.Array) {
            return this.name + '={'+JSON.stringify(this.value)+'}'
        }

        return '';
    }
}

export class Element {

    id?:number;
    name:string;
    library:LibraryKeys|undefined;
    code:string|undefined;
    style:Array<ElementStyle> = [new ElementStyle()];
    property:Array<ElementProperty> = [
        new ElementProperty(ElementPropertyType.String, 'name', ''),
        new ElementProperty(ElementPropertyType.String, 'class', '')
    ];
    collapse:boolean = true;
    children:Array<Element> = [];
    
    constructor(
        name:string,
        library:LibraryKeys|undefined = undefined,
        code:string|undefined = undefined,
        loop:boolean = true) {
            this.name = name;
            this.library = library;
            this.code = code;
            if (loop) {
                this.property.push(new ElementProperty(ElementPropertyType.Array, 'for', ''));
            }
    }

    prop(key:string):ElementProperty|undefined {
        let property = undefined;
        this.property.filter((item:ElementProperty)=>item.name === key).forEach((item:ElementProperty)=> {
            property = item;
        });
        return property;
    }

    getCode(assets:any):string {
        if (this.code) return this.code;
        let tag = this.library ? this.library + '.' + this.name : this.name;
        let body = '';
        let attr:Array<string> = [];
        this.property.forEach((item:ElementProperty)=> {
            if(!item.isActive) return;
            if (item.name === 'text') {
                body += item.toVal();
            } else if (item.name === 'class' || item.name === 'for') {
                // skip
            } else {
                attr.push(item.toVal(this, assets));
            }
        });
        let propFor = this.prop('for');
        let code = '<'+tag+' style={{style}} '+attr.join(' ')+' >'+body+'{children}</'+tag+'>';
        if (propFor && propFor.isActive && propFor.isVariable) {
            code = code.replace(' >', ' key={i} >');
            code = '{'+propFor.value+'.map((item, i)=>'+code+')}';
        }
        return code;
    }

    getLib() {
        return this.library ? Library[this.library] : undefined
    }

    clone():Element {
        return Element.parse(this.toJson());
    }

    toJson():any {
        return {
            id:this.id,
            name:this.name,
            library: this.library,
            code: this.code,
            style: this.style.map((item:ElementStyle)=>item.toJson()),
            property: this.property.map((item:ElementProperty)=>item.toJson()),
            collapse: this.collapse,
            children: this.children.map((item:Element)=> item.toJson())
        }
    }

    static parse(json:any):Element {
        const newOne = new Element(json.name, 
            json.library,
            json.code)
        newOne.id = json.id;
        newOne.style = json.style.map((item:any)=>ElementStyle.parse(item));
        newOne.property = json.property.map((item:any)=>ElementProperty.parse(item));
        newOne.collapse = json.collapse;
        newOne.children = json.children.map((elemJson:any)=>Element.parse(elemJson)); 
        return newOne
    }

    static getReactRootElement():Element {
        const item = new Element('layout', undefined, '<div style={{style}}>{children}</div>', false);
        item.id = 0;
        return item;
    }

    static getReactNativeRootElement():Element {
        const item = new Element('View', LibraryKeys.ReactNative, '<reactNative.View style={{style}}>{children}</reactNative.View>', false);
        item.id = 0;
        return item;
    }

    // static define(tag:string, lib:Library|undefined, attr:Array<string>, option:any={}):Element {
    //     const libs = [];
    //     if (lib) libs.push(lib);
    //     attr.push('name');
    //     let attribute = ' ';
    //     let bodyText = '';
    //     let tagName = lib ? lib.key + '.' + tag : tag;
    //     attr.forEach((item:string)=> {
    //         attribute += item + '={{'+ item + '}} ';
    //     })
    //     if (option.onChange) attribute +=  'onChange={this.handleChange} ';
    //     if (option.onChangeText) attribute += 'onChangeText={(text)=>this.handleChange({target:{value:text, name:{name}}})} ';
    //     if (option.onValueChange) attribute += 'onValueChange={(val,idx)=>this.handleChange({target:{value:val, index:idx, name:{name}}})} ';
    //     if (option.onClick) attribute += 'onClick={this.handleClick} ';
    //     if (option.onPress) attribute += 'onPress={()=>this.handleClick({target:{name:{name}}})} ';
    //     if (option.source) {
    //         attribute += 'source={{uri: {src}}}'
    //         attr.push('src');
    //     }
    //     if (option.text) {
    //         bodyText += '{{text}}';
    //         attr.push('text');
    //     }
    //     if (option.nest) {
    //         const nestTag = lib ? lib.key + '.' + option.nest : option.nest;
    //         bodyText += '<'+ nestTag + '>{children}</'+nestTag+'>'; 
    //     } else {
    //         bodyText += '{children}'
    //     }

    //     let code = '<'+tagName+ ' style={{style}} ' + attribute + '>' + bodyText + '</'+tagName+'>'

    //     return new Element(tag, libs, code).addProps(attr);
    // }

    static parseApi(json:any, lib:LibraryKeys|undefined=undefined) {
        const elem = new Element(json.name, lib);
        Object.keys(json.prop).forEach((item:any)=> {   
            if (elem.prop(item) === undefined) {
                if (Object.keys(ElementPropertyType).filter((type:any)=> ElementPropertyType[type] === json.prop[item].type).length > 0) {
                    let default_value = json.prop[item].default;
                    if (default_value === undefined) {
                        if (json.prop[item].type == ElementPropertyType.String) default_value = '';
                        else if (json.prop[item].type == ElementPropertyType.Bool) default_value = false;
                        else if (json.prop[item].type == ElementPropertyType.Number) default_value = 0;
                        else if (json.prop[item].type == ElementPropertyType.Array) default_value = [];
                    }
                    const newOne = new ElementProperty(json.prop[item].type, item, default_value);
                    if (json.prop[item].select) newOne.select = json.prop[item].select;
                    elem.property.push(newOne);
                } else {
                    console.log(item, json.prop[item], 'is not valid property type');
                }
            }
        });
        return elem;
    }
} 