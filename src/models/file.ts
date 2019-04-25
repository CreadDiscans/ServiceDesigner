import { FileHelper } from "./helper/file.helper";
import { Element } from "./element";

export enum FileType {
    ROOT = 'root',
    FOLDER = 'folder',
    FILE = 'file'
}

export class File extends FileHelper {
    id:number;
    name:string;
    type:FileType;
    collapse:boolean;
    children:Array<File>;
    element?:Element;
    state:object = {};

    constructor(id:number, name:string, type:FileType, collapse: boolean, children: Array<File>) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.collapse = collapse;
        this.children = children;
    }
}