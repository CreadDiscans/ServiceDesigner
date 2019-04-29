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

    clone():File {
        return File.parse(this.toJson());
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

    static parse(json:any):File {
        const newOne = new File(json.id, json.name, json.type);
        newOne.collapse = json.collapse;
        newOne.children = json.children.map((fileJson:any)=>File.parse(fileJson));
        newOne.element = json.element ? Element.parse(json.element) : undefined;
        newOne.state = json.state;
        return newOne;
    }
}