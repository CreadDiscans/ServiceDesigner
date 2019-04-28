import { Library, LibraryDependency } from './library';

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

    static getReactRootElement():Element {
        return new Element('layout', [], '<div className={{class}} style={{style}}>{children}</div>', false);
    }

    static getReactNativeRootElement():Element {
        return new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>', false);
    }
} 