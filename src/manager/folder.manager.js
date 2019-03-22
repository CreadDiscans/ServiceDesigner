import { Singletone } from "../service/singletone";
import Utils from "../service/utils";
import PubsubService from './../service/pubsub.service';
import { DataManager } from './data.manager';

export class FolderManager extends Singletone {

    static TYPE_FOLDER = 'folder';
    static TYPE_JS = 'js';
    static TYPE_ROOT = 'root';
    
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
    initialize(data) {
        this.data = data;
        this.selected = 0;
    }

    create(name, type) {
        if (type === FolderManager.TYPE_JS) {
            name += '.js';
        }
        Utils.loop(this.data, (item)=> {
            if (this.selected === item.id) {
                item.children.push({
                    id: Utils.maxId(this.data) +1,
                    name: name,
                    type: type,
                    collapse: true,
                    children: []
                });
            }
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }

    delete() {
        let parent;
        let index;
        Utils.loop(this.data, (item)=> {
            item.children.forEach((child, i)=> {
                if (child.id === this.selected) {
                    parent = item;
                    index = i;
                }
            });
        });
        this.selected = 0;
        parent.children.splice(index, 1);
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
    }

    update(id, collapse) {
        Utils.loop(this.data, (item)=> {
            if (item.id === id) {
                item.collapse = collapse;
            }
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
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
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);

        loop(this.data);
    }
}