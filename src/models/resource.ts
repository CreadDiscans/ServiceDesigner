
export enum ResourceType {
    CSS = 'css',
    COLOR = 'color',
    ASSET = 'asset'
}

export class Resource {

    name: string;
    type: ResourceType;
    value: string;

    constructor(name:string, type:ResourceType, value:string) {
        this.name = name;
        this.type = type;
        this.value = value;
    }

    toJson() {
        return {
            name:this.name,
            type:this.type,
            value:this.value
        }
    }

    static parse(json:any):Resource {
        return new Resource(json.name, json.type, json.value);
    }
}