import { BehaviorSubject } from "rxjs";

export default class PubsubService {

    static KEY_LOAD_JSON = 'load_json'
    static KEY_OPEN_PAGE = 'open_page'
    static KEY_LAYOUT_UPDATED = 'layout_updated'

    static streams = {};

    static sub(key) {
        if (!(key in this.streams)) {
            this.streams[key] = new BehaviorSubject(undefined);
        }
        return this.streams[key];
    }

    static unsub(key) {
        if (key in this.streams) {
            delete this.streams[key];
        }
    }

    static pub(key, value) {
        if (key in this.streams) {
            this.streams[key].next(value);
        }
    }


}