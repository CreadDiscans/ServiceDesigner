import { Singletone } from "../service/singletone";
import Utils from "../service/utils";
import PubsubService from './../service/pubsub.service';
import { DataManager } from './data.manager';
import { HistoryService } from './../service/history.service';

export class FolderManager extends Singletone {

    static TYPE_FOLDER = 'folder';
    static TYPE_JS = 'js';
    static TYPE_ROOT = 'root';
    static TYPE_OBJ = 'obj';
    
    data;
    selected = 0;
    // id: 0,
    // name: '',
    // type: 'root',
    // collapse: true,
    // children: [{
    //     id:1,
    //     name:'home.js',
    //     type:'js',
    //     collapse: false,
    //     children: []
    // }]

    initLayout = {
        "id": 0,
        "component":"layout",
        "import":[],
        "code":"<div className={{class}} style={{style}}>{children}</div>",
        "style":{},
        "property":{"class":""},
        "state": {},
        "children":[]
    }

    initialize(data) {
        this.data = data;
        this.selected = 0;
    }

    create(name, type, layoutData=this.initLayout) {
        const stack = [];
        let newOne;
        let parent;
        if (type === FolderManager.TYPE_OBJ) {
            newOne = name;
        } else {
            if (type === FolderManager.TYPE_JS) {
                name += '.js';
            }
            newOne = {
                id: Utils.maxId(this.data) +1,
                name: name,
                type: type,
                collapse: true,
                children: []
            }
        }

        const findKey = (item, func) => {
            stack.push(item.name);
            if (item.id ===  newOne.id && item.type === FolderManager.TYPE_JS) {
                func(stack.join('/'));
            }
            item.children.forEach(child=> findKey(child, func))
            stack.pop();
        }
        Utils.loop(this.data, (item)=> {
            if (this.selected === item.id) {
                parent = item;
            }
        });
        if (parent) {
            parent.children.push(newOne);
            if (type === FolderManager.TYPE_JS) {
                findKey(this.data, (pageKey)=> {
                    DataManager.getInstance(DataManager).data[pageKey] = Utils.deepcopy(layoutData);
                });
            }
            HistoryService.getInstance(HistoryService).push({
                action:HistoryService.ACTION_FOLDER_CREATE,
                parentId: parent.id,
                child: newOne,
                layoutData: Utils.deepcopy(layoutData)
            });
            PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
        } else {
            HistoryService.getInstance(HistoryService).reset();
        }
    }

    delete() {
        let parent;
        let index;
        let target;
        let stack = [];
        Utils.loop(this.data, (item)=> {
            item.children.forEach((child, i)=> {
                if (child.id === this.selected) {
                    target = child;
                    parent = item;
                    index = i;
                }
            });
        });
        const findKey = (item, func) => {
            stack.push(item.name);
            if (item.id ===  this.selected && item.type === FolderManager.TYPE_JS) {
                func(stack.join('/'));
            }
            item.children.forEach(child=> findKey(child, func))
            stack.pop();
        }
        let layoutData;
        findKey(this.data, (pageKey)=> {
            layoutData = DataManager.getInstance(DataManager).data[pageKey];
            delete DataManager.getInstance(DataManager).data[pageKey];
        });
        this.selected = 0;
        parent.children.splice(index, 1);
        HistoryService.getInstance(HistoryService).push({
            action: HistoryService.ACTION_FOLDER_DELETE,
            parentId: parent.id,
            child: target,
            layoutData: layoutData
        })
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
    }

    update(id, collapse) {
        Utils.loop(this.data, (item)=> {
            if (item.id === id) {
                item.collapse = collapse;
            }
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
    }

    select(id) {
        const stack = [];
        const loop = (item) => {
            stack.push(item.name);
            if (item.id ===  id && item.type === FolderManager.TYPE_JS) {
                DataManager.getInstance(DataManager).openJs(stack.join('/'));
            }
            item.children.forEach(child=> loop(child))
            stack.pop();
        }

        this.selected = id;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');

        loop(this.data);
    }

}