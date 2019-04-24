import { Singletone } from "../service/singletone";
import PubsubService from '../service/pubsub.service';
import { HistoryService } from '../service/history.service';

export class ElementManager extends Singletone<ElementManager> {
    
    data:any = [];
    // "id": 0,
    // "name": "Alerts",
    // "import": "import { Alert } from 'reactstrap'",
    // "code": "<Alert style={{style}} color={{color}}>{text}{children}</Alert>",
    // "property": {
    //     "style": {},
    //     "color": "primary",
    //     "text": "This is a primary alert"
    // }
    historyService:HistoryService;
    constructor(){
        super();
        this.historyService = HistoryService.getInstance(HistoryService);
    }

    initialize(data:any) {
        this.data = data;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    create(elem:any) {
        let maxId = 0;
        this.data.forEach((item:any)=> {
            if (maxId < item.id) maxId = item.id;
        });
        let newOne:any = {
            id: maxId+1,
            name: elem.name,
            import: elem.import,
            code: elem.code,
            property: elem.property,
            group: elem.group
        }
        this.data.push(newOne);
        this.historyService.push({
            action:HistoryService.ACTION_ELEMENT_CREATE,
            elem:newOne
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    update(elem:any) {
        let index!:number;
        let before;
        this.data.forEach((item:any, i:number)=> {
            if (elem.id === item.id) {
                before = item;
                index = i;
            }
        });
        this.data[index] = elem;
        this.historyService.push({
            action:HistoryService.ACTION_ELEMENT_UPDATE,
            before: before,
            after:this.data[index]
        })
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }

    delete(id:any) {
        if (id === -1) {
            this.historyService.reset();
            return;
        }
        let index;
        let target;
        this.data.forEach((item:any, i:number)=> {
            if (item.id === id) {
                target = item;
                index = i;
            }
        });
        this.data.splice(index, 1);
        this.historyService.push({
            action:HistoryService.ACTION_ELEMENT_DELETE,
            elem: target
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
    }
}