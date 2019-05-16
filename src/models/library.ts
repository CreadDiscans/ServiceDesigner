import * as reactstrap from 'reactstrap';
import * as reactRouterDom from 'react-router-dom';
import * as reactNative from 'react-native-web';
import * as materialUi from '@material-ui/core';

export enum LibraryKeys {
    ReactStrap = 'reactstrap',
    ReactRouterDom = 'reactRouterDom',
    ReactNative = 'reactNative',
    MatarialUi = 'materialUi'
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
    },
    [LibraryKeys.MatarialUi]: {
        name: '@material-ui/core',
        lib: materialUi
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