import * as _ from 'lodash';
import { FileType, ElementType } from "./constant";
import Utils from './Utils';
import * as fs from 'fs';
import { ReactPanel } from './ReactPanel';
import { CompoentProvider } from './ComponentProvider';
import { RenderService } from './RenderService';

export class DataManager {
    static instance:DataManager;


    static getInstance() {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager()
        }
        return DataManager.instance
    }

    data:any

    selectedComponent:any;

    init(data:any) {
        this.data = data
        this.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                item.parent = _.last(stack)
                if (item.type === FileType.FILE) {
                    Utils.loop(item.element, (elem:any, stack:any)=> {
                        if (elem.lib === 'reactnative') elem.lib = ElementType.ReactNative
                        else if (elem.lib === 'reactstrap') elem.lib = ElementType.Reactstrap
                        elem.parent = _.last(stack)
                    })
                }
            })
        })
    }

    selectComponent(id:number) {
        this.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                if (id == item.id) {
                    this.selectedComponent = item
                }
            })
        })
    }

    save(path:string) {
        this.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                delete item.parent
                if (item.type === FileType.FILE) {
                    Utils.loop(item.element, (elem:any, stack:any)=> {
                        delete elem.parent
                    })
                }
            })
        })
        this.export(path)
        // fs.writeFileSync(path, JSON.stringify(this.data, null, 4))
    }

    async export(path) {
        const json = {
            version: 2,
            components: this.data.components,
            resource: this.data.resource
        }
        const renderService:RenderService = new RenderService();
        renderService.renderAll(this.data.components, {
            color: this.data.resource.color,
            asset: this.data.resource.asset,
            css: this.data.resource.css,
            style: this.data.resource.style
        })
        fs.writeFileSync(path, JSON.stringify(json, null, 2))
        fs.writeFileSync(path.replace('save.json', 'component.tsx'), renderService.toJs())
        fs.writeFileSync(path.replace('save.json', 'style.css'), await renderService.toCss())
    }

    updateState(component_id, state) {
        this.data.components.forEach(comp=> {
            Utils.loop(comp, (item, stack)=> {
                if (item.id == component_id) {
                    item.state = state
                    this.save(ReactPanel.source)
                }
            })
        })
    }

    updateReasource(key, action, value) {
        if(action == 'create') {
            if (this.data.resource[key].filter(item=> item.name == value.name).length === 0) {
                this.data.resource[key].push(value)
            }
        } else if (action == 'update') {
            this.data.resource[key].filter(item=>item.name === value.name).forEach(item=> {
                if (value.value !== undefined) {
                    item.value = value.value
                }
                if (value.active !== undefined) {
                    item.active = value.active
                }
            })
        } else if (action == 'delete') {
            let idx = undefined;
            this.data.resource[key].forEach((item, i)=> {
                if (item.name === value.name) {
                    idx = i;
                }
            })
            if (idx != undefined) {
                this.data.resource[key].splice(idx, 1);
            }
        }
        this.save(ReactPanel.source)
    }

    updateProperty(elem_id, action, value) {
        let elem;
        this.data.components.forEach(comp=> {
            Utils.loop(comp, (item, stack)=> {
                if (item.id == CompoentProvider.id) {
                    Utils.loop(item.element, (_elem, _stack)=> {
                        if (_elem.id == elem_id) {
                            elem = _elem;
                        }
                    })
                }
            })
        })
        if (action == 'create') {
            if (elem && elem.prop.filter(prop=>prop.name === value.name).length === 0) {
                elem.prop.push(value)
            }
        } else if (action == 'update') {
            if (elem) {
                elem.prop.filter(prop=>prop.name === value.name).forEach(prop=> {
                    if (value.type !== undefined) {
                        prop.type = value.type
                    }
                    if (value.value !== undefined) {
                        prop.value = value.value
                    }
                })
            }
        } else if (action == 'delete') {
            if (elem) {
                let idx = undefined;
                elem.prop.forEach((item,i)=> {
                    if (item.name === value.name) idx = i;
                })
                if (idx !== undefined) {
                    elem.prop.splice(idx, 1);
                }
            }
        }
        this.save(ReactPanel.source)
    }
}
