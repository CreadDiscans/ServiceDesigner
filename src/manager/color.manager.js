import { Singletone } from "../service/singletone";
import { HistoryService } from './../service/history.service';
import PubsubService from './../service/pubsub.service';

export class ColorManager extends Singletone {

    data = {};
    
    // red: '#ff0000',
    // blue: '#0000ff'

    initialize(data) {
        this.data = data;
    }

    create(name, color) {
        this.data[name] = color;
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_COLOR_CREATE,
            name: name,
            color: color
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
    }

    update(name, color) {
        HistoryService.getInstance(HistoryService).push({
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

    delete(name) {
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_COLOR_DELETE,
            name: name,
            color: this.data[name]
        });
        delete this.data[name];
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'color');
    }
}