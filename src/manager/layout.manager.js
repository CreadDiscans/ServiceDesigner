import { Singletone } from "../service/singletone";
import { HistoryService } from './../service/history.service';
import Utils from "../service/utils";
import PubsubService from './../service/pubsub.service';

export class LayoutManager extends Singletone {
    
    data;
    selected=0;
    // id :0
    // component: 'layout',
    // style: {},
    // property: {},
    // import: 'import {Container} from \'reactstrap\'',
    // code: '<Container>{children}</Container>',
    // collapse: true,
    // children: []

    initialize(data) {
        this.data = data;
        this.selected = 0;
        Utils.loop(this.data, (item)=> item.collapse = true)
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    create(elem) {
        const convertImport = () => {
            const imp = []
            elem.import.split('\n').forEach(line=> {
                line = line.replace(/;/gi, '')
                const lib = line.split('from')[1].replace(/ /, '').replace(/'/gi, '')
                const items = []
                line.split('{')[1].split('}')[0].split(',').forEach(it=> {
                    items.push(it.replace(/ /gi, ''))
                })
                imp.push({from:lib, items:items})
            })
            return imp
        }
        let newLayout;
        if (Array.isArray(elem.import)) {
            newLayout =  elem;
        } else {
            const prop = Utils.deepcopy(elem.property)
            let style = {}
            if (prop.style) {
                style = prop.style
                delete prop.style
            }
    
            newLayout = {
                id: Utils.maxId(this.data)+1,
                component: elem.name,
                style: style,
                property: prop, 
                import: convertImport(),
                code: elem.code,
                collapse: true,
                children: []
            }
        }
        

        Utils.loop(this.data, (item)=> {
            if (this.selected === item.id) {
                item.children.push(newLayout);
            }
        });
        HistoryService.getInstance(HistoryService).push({
            action:HistoryService.ACTION_LAYOUT_CREATE,
            parentId: this.selected,
            childId: newLayout.id,
            child: Utils.deepcopy(elem)
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    update(layout) {
        let before;
        let after;
        Utils.loop(this.data, (item)=> {
            if (layout.id === item.id) {
                before = Utils.deepcopy(item);
                if ('style' in layout) item.style = layout.style;
                if ('property' in layout) item.property = layout.property;
                if ('collapse' in layout) item.collapse = layout.collapse;
                after = Utils.deepcopy(item);
            }
        })
        if (!Utils.equal(before, after)) {
            HistoryService.getInstance(HistoryService).push({
                action:HistoryService.ACTION_LAYOUT_UPDATE,
                before: before,
                after: after
            });
        } else {
            HistoryService.getInstance(HistoryService).reset();
        }
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    delete() {
        let parent;
        let index;
        let target;
        Utils.loop(this.data, (item)=> {
            item.children.forEach((child, i)=> {
                if (child.id === this.selected) {
                    target = child;
                    parent = item;
                    index = i;
                }
            });
        });
        if (parent) {
            HistoryService.getInstance(HistoryService).push({
                action:HistoryService.ACTION_LAYOUT_DELETE,
                parentId:parent.id,
                child: target
            });
            this.selected = 0;
            parent.children.splice(index, 1);
            PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
            PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        } else {
            HistoryService.getInstance(HistoryService).reset()
        }
    }

    select(id) {
        this.selected = id;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }
}