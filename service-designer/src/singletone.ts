
export class Singletone<T> {

    static instance:any = null;

    static getInstance<T>(c:any):T {
        if (this.instance === null) {
            this.instance = new c();
        }
        return this.instance;
    }
}