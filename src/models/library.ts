import * as reactstrap from 'reactstrap';
import * as reactRouterDom from 'react-router-dom';
import * as reactNative from 'react-native-web';

export enum LibraryKeys {
    ReactStrap = 'reactstrap',
    ReactRouterDom = 'reactRouterDom',
    ReactNative = 'reactNative'
}

export const LibraryTable:any = {
    [LibraryKeys.ReactStrap]: {
        name: 'reacstrap',
        lib: reactstrap
    },
    [LibraryKeys.ReactRouterDom]: {
        name: 'react-router-dom',
        lib: reactRouterDom
    },
    [LibraryKeys.ReactNative]: {
        name: 'react-native',
        lib: reactNative
    }
} 

export class Library {

    key:string;

    constructor(key:string) {
        this.key = key;
    }

    clone():Library {
        return Library.parse(this.toJson());
    }

    toJson() {
        return {
            key: this.key 
        }
    }

    get() {
        return LibraryTable[this.key];
    }

    static parse(json:any):Library {
        return new Library(json.key);
    }
}