import { Controller } from './controller';
import { Resource, ResourceType } from '../models/resource';
import { Action } from '../utils/constant';

export class ResourceController extends Controller {
    
    private rsc: Array<Resource> = [];

    get(type:ResourceType, name:string|undefined):Array<Resource>|Resource|undefined {
        if (name) {
            const list = this.rsc.filter((r:Resource)=> r.type === type && r.name === name);
            if (list.length > 0) return list[0]
            return undefined
        }
        return this.rsc.filter((r:Resource)=> r.type === type);
    }

    control(action:Action, item:Resource) {
        if (action === Action.Create && this.rsc.filter((r:Resource)=> r.type === item.type && r.type === item.name).length === 0) {
            this.rsc.push(item);
        } else if (action === Action.Update) {
            const filteredList = this.rsc.filter((r:Resource)=> r.type === item.type && r.type === item.name)
            if (filteredList.length !== 0) {
                filteredList[0].value = item.value;
            }
        } else if (action === Action.Delete) {
            let index = -1;
            this.rsc.forEach((r:Resource, i:number)=> {
                if (r.type === item.type && r.name === item.name) {
                    index = i
                }
            })
            if (index !== -1) {
                this.rsc.splice(index, 1);
            }
        }
        this.main.home$.next(true);
        this.main.sidebar$.next(true);
    }
}