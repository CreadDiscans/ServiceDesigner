import { Singletone } from "./singletone";

declare var window:any;

export class Store extends Singletone<Store> {

    path;
    data = {};

    constructor() {
        super();
        try {
            const electron = window.require('electron');
            const path = window.require('path');
            const userDataPath = (electron.app || electron.remote.app).getPath('userData');
            this.path = path.join(userDataPath, 'preference.json')
            this.data = this.parseDataFile(this.path)
        } catch(e) {
        }
    }

    private parseDataFile(filePath) {
        try {
            const fs = window.require('fs');
            return JSON.parse(fs.readFileSync(filePath))
        } catch(e) {
            return {}
        }
    }

    get(key) {
        return this.data[key]
    }

    set(key, val) {
        this.data[key] = val
        try {
            const fs = window.require('fs');
            fs.writeFileSync(this.path, JSON.stringify(this.data))
        } catch(e) {}
    }
}