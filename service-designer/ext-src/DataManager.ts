import * as _ from 'lodash';
import { FileType, ElementType } from "./constant";
import Utils from './Utils';
import * as fs from 'fs';

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
        fs.writeFileSync(path, JSON.stringify(this.data, null, 4))
    }
}
