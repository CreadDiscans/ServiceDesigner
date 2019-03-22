import { Singletone } from "../service/singletone";
import PubsubService from './../service/pubsub.service';

export class ElementManager extends Singletone {
    
    data = [];
    // "id": 0,
    // "name": "Alerts",
    // "import": "import { Alert } from 'reactstrap'",
    // "code": "<Alert style={{style}} color={{color}}>{text}{children}</Alert>",
    // "property": {
    //     "style": {},
    //     "color": "primary",
    //     "text": "This is a primary alert"
    // }

    initialize(data) {
        this.data = data;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }

    create(elem) {
        let maxId = 0;
        this.data.forEach(item=> {
            if (maxId < item.id) maxId = item.id;
        });
        this.data.push({
            id: maxId+1,
            name: elem.name,
            import: elem.import,
            code: elem.code,
            property: elem.property
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }

    update(elem) {
        let index;
        this.data.forEach((item, i)=> {
            if (elem.id < item.id) index = i;
        });
        this.data[index] = elem;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }

    delete(id) {
        if (id === -1) return;
        let index;
        this.data.forEach((item, i)=> {
            if (item.id === id) index = i;
        });
        this.data.splice(index, 1);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }
}