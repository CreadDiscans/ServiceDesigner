import { Singletone } from "../service/singletone";
import { HistoryService } from './../service/history.service';
import PubsubService from './../service/pubsub.service';

export class AssetManager extends Singletone {

    data = {};

    initialize(data) {
        this.data = data;
    }

    create(name, value) {
        this.data[name] = value;
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_ASSET_CREATE,
            name: name,
            value: value
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
    }

    update(name, value) {
        HistoryService.getInstance(HistoryService).push({
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

    delete(name) {
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_ASSET_DELETE,
            name: name,
            value: this.data[name]
        });
        delete this.data[name];
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'asset');
    }
}