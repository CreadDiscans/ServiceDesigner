import { LibraryHelper } from "./helper/library.helper";

export enum LibraryDependency {
    ReactIcon = 'react-icon',
    ReactNativeVectorIcon = 'react-native-vector-icon',
    ReactNative = 'react-native',
    Reactscrap = 'reactstrap'
}

export class Library extends LibraryHelper {

    dependency:LibraryDependency;
    items: Array<string>;

    constructor(dependency:LibraryDependency, items:Array<string>) {
        super();
        this.dependency = dependency;
        this.items = items;
    } 
}