import { Library, LibraryDependency } from './library';
import Utils from '../utils/utils';

export class Element {

    id?:number;
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
        return Element.parse(this.toJson());
    }

    toJson():any {
        return {
            id:this.id,
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
        newOne.id = json.id;
        newOne.style = json.style;
        newOne.property = json.property;
        newOne.collapse = json.collapse;
        newOne.children = json.children.map((elemJson:any)=>Element.parse(elemJson)); 
        return newOne
    }

    static getReactRootElement():Element {
        const item = new Element('layout', [], '<div style={{style}}>{children}</div>', false);
        item.id = 0;
        return item;
    }

    static getReactNativeRootElement():Element {
        const item = new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>', false);
        item.id = 0;
        return item;
    }
} 