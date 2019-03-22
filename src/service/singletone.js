
export class Singletone {

    static instance = null;

    static getInstance(c) {
        if (this.instance === null) {
            this.instance = new c();
        }
        return this.instance;
    }
}