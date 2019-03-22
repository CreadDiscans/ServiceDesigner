import PubsubService from './pubsub.service';
import DataService from './data.service';
import Utils from './utils';

export class ActionService {

    static ACTION_CHANGE_STYLE = 'change style';
    static ACTION_CHANGE_PROPERTY = 'change property';
    static ACTION_DELETE_LAYOUT = 'delete layout';
    static ACTION_INSERT_LAYOUT = 'insert layout';
    static ACTION_CREATE_ELEMENT = 'create element';
    static ACTION_UPDATE_ELEMENT = 'update element';
    static ACTION_DELETE_ELEMENT = 'delete element';
    static ACTION_CREATE_FILE = 'create file';
    static ACTION_DELETE_FILE = 'delete file';

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
        else if (action.type === ActionService.ACTION_DELETE_LAYOUT) ActionService.deleteLayout(action);
        else if (action.type === ActionService.ACTION_INSERT_LAYOUT) ActionService.insertLayout(action);
        else if (action.type === ActionService.ACTION_CREATE_ELEMENT) ActionService.createElement(action);
        else if (action.type === ActionService.ACTION_UPDATE_ELEMENT) ActionService.updateElement(action);
        else if (action.type === ActionService.ACTION_DELETE_ELEMENT) ActionService.deleteElement(action);
        else if (action.type === ActionService.ACTION_CREATE_FILE) ActionService.createFile(action);
        else if (action.type === ActionService.ACTION_DELETE_FILE) ActionService.deleteFile(action);
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

    static insertLayout(action) {
        const data = DataService.data[action.page];
        let parent;
        Utils.loop(data, (item)=> {
            if (item.id === action.parent.id) {
                parent = item;
            }
        });
        parent.children.push(Utils.deepcopy(action.item))
    }

    static createElement(action) {
        DataService.components.push(Utils.deepcopy(action.item));
    }

    static updateElement(action) {
        let index;
        DataService.components.forEach((item,i)=> {
            if (item.id === action.before.id) {
                index = i;
            }
        });
        DataService.components[index] = Utils.deepcopy(action.after);
    }

    static deleteElement(action) {
        let index;
        DataService.components.forEach((item,i)=> {
            if (item.id === action.item.id) {
                index = i;
            }
        });
        DataService.components.splice(index, 1);
    }

    static createFile(action) {
        Utils.loop(DataService.folder, (item)=> {
            if (action.parent === item.id) {
                item.children.push(Utils.deepcopy(action.item));
            }
        });
        if (action.item.type === 'js') {
            // DataService.data[]

            //         data: {
            //             id: 0,
            //             component:"layout",
            //             import:[],
            //             code:"<div style={{style}}>{children}</div>",
            //             style:{},
            //             property:{},
            //             children:[]
            //         }
        }
    }

    static deleteFile(action) {

    }
}