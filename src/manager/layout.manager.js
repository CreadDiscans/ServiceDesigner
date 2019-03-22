import { Singletone } from "../service/singletone";
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
        const prop = Utils.deepcopy(elem.property)
        let style = {}
        if (prop.style) {
            style = prop.style
            delete prop.style
        }

        Utils.loop(this.data, (item)=> {
            if (this.selected === item.id) {
                item.children.push({
                    id: Utils.maxId(this.data)+1,
                    component: elem.name,
                    style: style,
                    property: prop, 
                    import: convertImport(),
                    code: elem.code,
                    collapse: true,
                    children: []
                });
            }
        });
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }

    update(layout) {
        Utils.loop(this.data, (item)=> {
            if (layout.id === item.id) {
                if ('style' in layout) item.style = layout.style;
                if ('property' in layout) item.property = layout.property;
                if ('collapse' in layout) item.collapse = layout.collapse;
            }
        })
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
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
        if (parent) {
            this.selected = 0;
            parent.children.splice(index, 1);
            PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
            PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
        }
    }

    select(id) {
        this.selected = id;
        PubsubService.pub(PubsubService.KEY_RELOAD_SIDEBAR, true);
        PubsubService.pub(PubsubService.KEY_RELOAD_HOME, true);
    }
}