import { ResourceHelper } from "./helper/resource.helper";

export enum ResourceType {
    CSS = 'css',
    COLOR = 'color',
    ASSET = 'asset'
}

export class Resource extends ResourceHelper {

    name: string;
    type: ResourceType;
    value: string;

    constructor(name:string, type:ResourceType, value:string) {
        super();
        this.name = name;
        this.type = type;
        this.value = value;
    }
}