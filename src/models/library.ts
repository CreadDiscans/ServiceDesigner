
export enum LibraryDependency {
    ReactIcon = 'react-icon',
    ReactNativeVectorIcon = 'react-native-vector-icon',
    ReactNative = 'react-native',
    Reactscrap = 'reactstrap'
}

export class Library {

    dependency:LibraryDependency;
    items: Array<string>;

    constructor(dependency:LibraryDependency, items:Array<string>) {
        this.dependency = dependency;
        this.items = items;
    } 
}