import { Singletone } from "../utils/singletone";
import { HistoryService } from '../service/history.service';
import PubsubService from '../service/pubsub.service';

export class AssetManager extends Singletone<AssetManager> {

    data:any = {};
    historyService:HistoryService;
    constructor() {
        super();
        this.historyService = HistoryService.getInstance(HistoryService);
    }

    initialize(data:any) {
        this.data = data;
    }

    create(name:any, value:any) {
        this.data[name] = value;
        this.historyService.push({
            action: HistoryService.ACTION_ASSET_CREATE,
            name: name,
            value: value
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
    }

    update(name:any, value:any) {
        this.historyService.push({
            action: HistoryService.ACTION_ASSET_UPDATE,
            before:{
                name: name,
                value: this.data[name]
            }, 
            after: {
                name: name,
                value: value
            }
        });
        this.data[name] = value;
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
        
    }

    delete(name:any) {
        this.historyService.push({
            action: HistoryService.ACTION_ASSET_DELETE,
            name: name,
            value: this.data[name]
        });
        delete this.data[name];
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
    }
}