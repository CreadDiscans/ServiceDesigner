import { Element } from "./element";
import Utils from './../utils/utils';

export enum FileType {
    ROOT = 'root',
    FOLDER = 'folder',
    FILE = 'file'
}

export class File {
    id:number;
    name:string;
    type:FileType;
    collapse:boolean = true;
    children:Array<File> = [];
    element?:Element;
    state:object = {};

    constructor(id:number, name:string, type:FileType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    setState(obj:any){
        this.state = Utils.merge(this.state, obj);
    }

    toJson():any {
        return {
            id:this.id,
            name:this.name,
            type: this.type,
            collapse: this.collapse,
            children: this.children.map((item:File)=>item.toJson()),
            element: this.element ? this.element.toJson() : undefined,
            state: Utils.deepcopy(this.state)
        }
    }
}