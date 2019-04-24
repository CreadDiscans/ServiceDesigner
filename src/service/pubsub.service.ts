import { BehaviorSubject } from "rxjs";

export default class PubsubService {

    static KEY_RELOAD_SIDEBAR = 'reload_sidebar';
    static KEY_RELOAD_HOME = 'reload_home';

    static streams:any = {};

    static sub(key:any) {
        if (!(key in this.streams)) {
            this.streams[key] = new BehaviorSubject(undefined);
        }
        return this.streams[key];
    }

    static unsub(key:any) {
        if (key in this.streams) {
            delete this.streams[key];
        }
    }

    static pub(key:any, value:any) {
        if (key in this.streams) {
            this.streams[key].next(value);
        }
    }


}