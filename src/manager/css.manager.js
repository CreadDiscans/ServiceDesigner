import { Singletone } from './../service/singletone';
import { HistoryService } from './../service/history.service';
import PubsubService from './../service/pubsub.service';

export class CssManager extends Singletone {

    data = {};

    initialize(data) {
        this.data = data;
    }

    getCssFile() {
        let output = '';
        Object.keys(this.data).forEach(key=> {
            output += this.data[key] + '\n';
        });
        return output;
    }

    create(name, value) {
        this.data[name] = value;
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_CSS_CREATE,
            name: name,
            value: value
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'css');
    }

    update(name, value) {
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_CSS_UPDATE,
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
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'css');
    }

    delete(name) {
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_CSS_DELETE,
            name: name,
            value: this.data[name]
        });
        delete this.data[name];
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'css');
    }
}