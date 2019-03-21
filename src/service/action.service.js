import PubsubService from './pubsub.service';
import DataService from './data.service';
import Utils from './utils';

export class ActionService {

    static ACTION_CHANGE_STYLE = 'change style';
    static ACTION_CHANGE_PROPERTY = 'change property';
    static ACTION_DELETE_LATOUT = 'delete layout';

    static history = [];

    static historyReset() {
        ActionService.history = [];
    };

    static redo() {

    }

    static undo() {

    }

    static do(action) {
        if (action.type === ActionService.ACTION_CHANGE_STYLE) ActionService.changeField(action, 'style');
        else if (action.type === ActionService.ACTION_CHANGE_PROPERTY) ActionService.changeField(action, 'property');
        else if (action.type === ActionService.ACTION_DELETE_LATOUT) ActionService.deleteLayout(action);
        ActionService.history.push(action);
        PubsubService.pub(PubsubService.KEY_LAYOUT_UPDATED, true);
    }

    static changeField(action, key) {
        const data = DataService.data[action.page];
        Utils.loop(data, (item)=> {
            if(item.id === action.target.id) {
                item[key] = Utils.deepcopy(action.after)
            }
        })
    }

    static deleteLayout(action) {
        const data = DataService.data[action.page];
        let index;
        let parent;
        Utils.loop(data, (item)=> {
            if (item.id === action.parent.id) {
                parent = item;
            }
        })
        parent.children.forEach((child, i)=> {
            if (child.id === action.target.id) {
                index = i;
            }
        })
        parent.children.splice(index, 1);
    }
}