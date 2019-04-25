import { ElementHelper } from './helper/element.helper';

export class Element extends ElementHelper {

    id:number;
    name:string;
    imp:string;
    code:string;
    style:string;
    property:object;

    constructor(
        id:number, 
        name:string,
        imp:string,
        code:string,
        style:string,
        property:object) {
            super();
            this.id = id;
            this.name = name;
            this.imp = imp;
            this.code = code;
            this.style = style;
            this.property = property
    }
}