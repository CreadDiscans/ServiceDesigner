import { Library } from './library';

export class Element {

    name:string;
    library?:Array<Library>;
    code:string;
    style:string = 'style{\n\n}';
    property:object = {class:''};
    children:Array<Element> = [];

    constructor(
        name:string,
        library:Array<Library>,
        code:string) {
            this.name = name;
            this.library = library;
            this.code = code;
    }
}