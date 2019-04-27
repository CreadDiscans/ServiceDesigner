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
}