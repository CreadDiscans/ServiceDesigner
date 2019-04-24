import { Singletone } from "../service/singletone";
import Utils from "../service/utils";
import PubsubService from '../service/pubsub.service';
import { DataManager } from './data.manager';
import { HistoryService } from '../service/history.service';

export class FolderManager extends Singletone<FolderManager> {

    static TYPE_FOLDER = 'folder';
    static TYPE_JS = 'js';
    static TYPE_ROOT = 'root';
    static TYPE_OBJ = 'obj';
    
    data:any;
    selected = 0;
    dataManager:DataManager;
    historyService:HistoryService;
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

    initLayout:any = {
        'react': {
            "id": 0,
            "component":"layout",
            "import":[],
            "code":"<div className={{class}} style={{style}}>{children}</div>",
            "style":"style{\n\n}",
            "property":{"class":""},
            "state": {},
            "children":[]
        },
        'react-native': {
            "id":0,
            "component":"View",
            "import":[{from:'react-native', items:['View']}],
            "code":"<View style={{style}}>{children}</View>",
            "style":{},
            "property":{"class":""},
            "state": {},
            "children":[]
        }
    }

    constructor() {
        super();
        this.dataManager = DataManager.getInstance(DataManager);
        this.historyService = HistoryService.getInstance(HistoryService);
    }

    initialize(data:any) {
        this.data = data;
        this.selected = 0;
    }

    create(name:any, type:any, layoutData=undefined) {
        if (layoutData === undefined) {
            layoutData = this.initLayout[this.dataManager.projectType]
        }
        const stack:any = [];
        let newOne:any;
        let parent:any;
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

        const findKey = (item:any, func:any) => {
            stack.push(item.name);
            if (item.id ===  newOne.id && item.type === FolderManager.TYPE_JS) {
                func(stack.join('/'));
            }
            item.children.forEach((child:any)=> findKey(child, func))
            stack.pop();
        }
        Utils.loop(this.data, (item:any)=> {
            if (this.selected === item.id) {
                parent = item;
            }
        });
        if (parent) {
            parent.children.push(newOne);
            if (type === FolderManager.TYPE_JS) {
                findKey(this.data, (pageKey:any)=> {
                    this.dataManager.data[pageKey] = Utils.deepcopy(layoutData);
                });
            }
            this.historyService.push({
                action:HistoryService.ACTION_FOLDER_CREATE,
                parentId: parent.id,
                child: newOne,
                layoutData: Utils.deepcopy(layoutData)
            });
            PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
        } else {
            this.historyService.reset();
        }
    }

    delete() {
        let parent:any;
        let index;
        let target;
        let stack:any = [];
        Utils.loop(this.data, (item:any)=> {
            item.children.forEach((child:any, i:number)=> {
                if (child.id === this.selected) {
                    target = child;
                    parent = item;
                    index = i;
                }
            });
        });
        const findKey = (item:any, func:any) => {
            stack.push(item.name);
            if (item.id ===  this.selected && item.type === FolderManager.TYPE_JS) {
                func(stack.join('/'));
            }
            item.children.forEach((child:any)=> findKey(child, func))
            stack.pop();
        }
        let layoutData;
        findKey(this.data, (pageKey:any)=> {
            layoutData = this.dataManager.data[pageKey];
            delete this.dataManager.data[pageKey];
        });
        this.selected = 0;
        parent.children.splice(index, 1);
        this.historyService.push({
            action: HistoryService.ACTION_FOLDER_DELETE,
            parentId: parent.id,
            child: target,
            layoutData: layoutData
        })
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
    }

    update(id:any, collapse:any) {
        Utils.loop(this.data, (item:any)=> {
            if (item.id === id) {
                item.collapse = collapse;
            }
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');
    }

    select(id:any) {
        const stack:any = [];
        const loop = (item:any) => {
            stack.push(item.name);
            if (item.id ===  id && item.type === FolderManager.TYPE_JS) {
                this.dataManager.openJs(stack.join('/'));
            }
            item.children.forEach((child:any)=> loop(child))
            stack.pop();
        }

        this.selected = id;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'folder');

        loop(this.data);
    }

}