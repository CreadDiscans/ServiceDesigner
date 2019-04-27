import { Element } from "./element";

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
}