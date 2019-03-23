import { Singletone } from "../service/singletone";
import PubsubService from './../service/pubsub.service';
import { HistoryService } from './../service/history.service';

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
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    create(elem) {
        let maxId = 0;
        this.data.forEach(item=> {
            if (maxId < item.id) maxId = item.id;
        });
        let newOne = {
            id: maxId+1,
            name: elem.name,
            import: elem.import,
            code: elem.code,
            property: elem.property
        }
        this.data.push(newOne);
        HistoryService.getInstance(HistoryService).push({
            action:HistoryService.ACTION_ELEMENT_CREATE,
            elem:newOne
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    update(elem) {
        let index;
        let before;
        this.data.forEach((item, i)=> {
            if (elem.id === item.id) {
                before = item;
                index = i;
            }
        });
        this.data[index] = elem;
        HistoryService.getInstance(HistoryService).push({
            action:HistoryService.ACTION_ELEMENT_UPDATE,
            before: before,
            after:this.data[index]
        })
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    delete(id) {
        if (id === -1) {
            HistoryService.getInstance(HistoryService).reset();
            return;
        }
        let index;
        let target;
        this.data.forEach((item, i)=> {
            if (item.id === id) {
                target = item;
                index = i;
            }
        });
        this.data.splice(index, 1);
        HistoryService.getInstance(HistoryService).push({
            action:HistoryService.ACTION_ELEMENT_DELETE,
            elem: target
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }
}