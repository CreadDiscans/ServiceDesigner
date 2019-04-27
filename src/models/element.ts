import { Library, LibraryDependency } from './library';

export class Element {

    name:string;
    library?:Array<Library>;
    code:string;
    style:string = 'style{\n\n}';
    property:any = {class:''};
    children:Array<Element> = [];

    constructor(
        name:string,
        library:Array<Library>,
        code:string) {
            this.name = name;
            this.library = library;
            this.code = code;
    }

    static getReactRootElement():Element {
        return new Element('layout', [], '<div className={{class}} style={{style}}>{children}</div>');
    }

    static getReactNativeRootElement():Element {
        return new Element('View', [new Library(LibraryDependency.ReactNative, ['View'])], '<View style={{style}}>{children}</View>');
    }
} 