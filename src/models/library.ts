import Utils from './../utils/utils';

export enum LibraryDependency {
    HtmlElement = 'HtmlElement',
    ReactIcon = 'react-icon',
    ReactNativeVectorIcon = 'react-native-vector-icon',
    ReactNative = 'react-native',
    Reactscrap = 'reactstrap',
    ReactRouterDom = 'react-router-dom'
}

export class Library {

    dependency:LibraryDependency;
    items: Array<string>;

    constructor(dependency:LibraryDependency, items:Array<string>) {
        this.dependency = dependency;
        this.items = items;
    }

    clone():Library {
        return new Library(this.dependency, Utils.deepcopy(this.items));
    }

    toJson() {
        return {
            dependency: this.dependency,
            items: Utils.deepcopy(this.items) 
        }
    }

    static parse(json:any):Library {
        return new Library(json.dependency, json.items);
    }
}