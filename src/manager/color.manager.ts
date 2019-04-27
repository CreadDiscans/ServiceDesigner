import { Singletone } from "../utils/singletone";
import { HistoryService } from '../service/history.service';
import PubsubService from '../service/pubsub.service';

export class ColorManager extends Singletone<ColorManager> {

    data:any = {};
    historyService:HistoryService;

    // red: '#ff0000',
    // blue: '#0000ff'

    constructor() {
        super();
        this.historyService = HistoryService.getInstance(HistoryService);
    }

    initialize(data:any) {
        this.data = data;
    }

    create(name:any, color:any) {
        this.data[name] = color;
        this.historyService.push({
            action: HistoryService.ACTION_COLOR_CREATE,
            name: name,
            color: color
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
    }

    update(name:any, color:any) {
        this.historyService.push({
            action: HistoryService.ACTION_COLOR_UPDATE,
            before:{
                name: name,
                color: this.data[name]
            }, 
            after: {
                name: name,
                color: color
            }
        });
        this.data[name] = color;
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
    }

    delete(name:any) {
        this.historyService.push({
            action: HistoryService.ACTION_COLOR_DELETE,
            name: name,
            color: this.data[name]
        });
        delete this.data[name];
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
    }
}