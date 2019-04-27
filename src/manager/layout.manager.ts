import { Singletone } from "../utils/singletone";
import { HistoryService } from '../service/history.service';
import Utils from "../utils/utils";
import PubsubService from '../service/pubsub.service';

export class LayoutManager extends Singletone<LayoutManager> {
    
    data:any;
    selected=0;
    historyService:HistoryService;
    // id :0
    // component: 'layout',
    // style: {},
    // property: {},
    // import: 'import {Container} from \'reactstrap\'',
    // code: '<Container>{children}</Container>',
    // collapse: true,
    // children: []

    constructor() {
        super();
        this.historyService = HistoryService.getInstance(HistoryService);
    }

    initialize(data:any) {
        this.data = data;
        this.selected = 0;
        Utils.loop(this.data, (item:any)=> item.collapse = true)
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, undefined);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    create(elem:any) {
        const convertImport = () => {
            const imp:any = []
            elem.import.split('\n').forEach((line:any)=> {
                if (line === '') return
                line = line.replace(/;/gi, '')
                const lib = line.split('from')[1].replace(/ /, '').replace(/'/gi, '')
                const items:any = []
                line.split('{')[1].split('}')[0].split(',').forEach((it:any)=> {
                    items.push(it.replace(/ /gi, ''))
                })
                imp.push({from:lib, items:items})
            })
            return imp
        }
        let newLayout:any;
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
        

        Utils.loop(this.data, (item:any)=> {
            if (this.selected === item.id) {
                item.children.push(newLayout);
            }
        });
        this.historyService.push({
            action:HistoryService.ACTION_LAYOUT_CREATE,
            parentId: this.selected,
            childId: newLayout.id,
            child: Utils.deepcopy(elem)
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'code');
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    update(layout:any) {
        let before;
        let after;
        Utils.loop(this.data, (item:any)=> {
            if (layout.id === item.id) {
                before = Utils.deepcopy(item);
                if ('style' in layout) item.style = layout.style;
                if ('property' in layout) item.property = layout.property;
                if ('collapse' in layout) item.collapse = layout.collapse;
                after = Utils.deepcopy(item);
            }
        })
        if (!Utils.equal(before, after)) {
            this.historyService.push({
                action:HistoryService.ACTION_LAYOUT_UPDATE,
                before: before,
                after: after
            });
        } else {
            this.historyService.reset();
        }
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'property');
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    setState(state:any) {
        this.historyService.push({
            action:HistoryService.ACTION_LAYOUT_STATE,
            before: Utils.deepcopy(this.data.state),
            after: Utils.deepcopy(state)
        });
        this.data.state = state;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, 'state');
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    delete() {
        let parent:any;
        let index;
        let target;
        Utils.loop(this.data, (item:any)=> {
            item.children.forEach((child:any, i:number)=> {
                if (child.id === this.selected) {
                    target = child;
                    parent = item;
                    index = i;
                }
            });
        });
        if (parent) {
            this.historyService.push({
                action:HistoryService.ACTION_LAYOUT_DELETE,
                parentId:parent.id,
                child: target
            });
            this.selected = 0;
            parent.children.splice(index, 1);
            PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, undefined);
            PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        } else {
            this.historyService.reset()
        }
    }

    select(id:any) {
        this.selected = id;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, undefined);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }
}