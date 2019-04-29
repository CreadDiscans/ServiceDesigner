import { Library, LibraryDependency } from './library';
import Utils from '../utils/utils';

export enum ElementGroup {
    HtmlElement = 'HtmlElement',
    Reactstrap = 'reactstrap',
    ReactNative = 'react-native',
    ReactIcons = 'react-icons',
    ReactNativeVectorIcons = 'react-native-vector-icons'
}

export class Element {

    name:string;
    library?:Array<Library>;
    code:string;
    style:string = 'style{\n\n}';
    property:any = {class:''};
    collapse:boolean = true;
    children:Array<Element> = [];

    constructor(
        name:string,
        library:Array<Library>,
        code:string,
        logic:boolean = true) {
            this.name = name;
            this.library = library;
            this.code = code;
            if (logic) {
                this.property['if'] = '';
                this.property['for'] = '';
            }
    }

    addProps(keys:Array<string>) {
        keys.forEach(key=> {
            this.property[key] = '';
        });
        return this;
    }

    clone():Element {
        const lib:Array<Library> = [];
        if (this.library)
            this.library.forEach((item:Library)=> lib.push(item.clone()));
        const newOne = new Element(this.name, lib,this.code);
        newOne.property = Utils.deepcopy(this.property);
        newOne.style = this.style;
        newOne.collapse = this.collapse;
        return newOne;
    }

    toJson():any {
        return {
            name:this.name,
            library: this.library ? this.library.map((item:Library)=> item.toJson()) : [],
            code: this.code,
            style: this.style,
            property: Utils.deepcopy(this.property),
            collapse: this.collapse,
            children: this.children.map((item:Element)=> item.toJson())
        }
    }

    static parse(json:any):Element {
        const newOne = new Element(json.name, 
            json.library.map((libjson:any)=>Library.parse(libjson)),
            json.code)
        newOne.style = json.style;
        newOne.property = json.property;
        newOne.collapse = json.collapse;
        newOne.children = json.children.map((elemJson:any)=>Element.parse(elemJson)); 
        return newOne
    }

    static getReactRootElement():Element {
        return new Element('layout', [], '<div style={{style}}>{children}</div>', false);
    }

    static getReactNativeRootElement():Element {
        return new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>', false);
    }
} 