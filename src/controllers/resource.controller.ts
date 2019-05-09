import { Controller } from './controller';
import { Resource, ResourceType } from '../models/resource';
import { Action, HisotryAction } from '../utils/constant';

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

    control(action:Action, parent:Resource|undefined, before:Resource|undefined, 
            after:Resource|undefined, ctrl:ResourceController, historyAction:HisotryAction = HisotryAction.Do) {
        if (action === Action.Create && after) {
            if(this.rsc.filter((r:Resource)=> r.type === after.type && r.type === after.name).length === 0)
                this.rsc.push(after);
        } else if (action === Action.Update && before && after) {
            const filteredList = this.rsc.filter((r:Resource)=> r.type === after.type && r.name === after.name)
            if (filteredList.length !== 0) {
                filteredList[0].value = after.value;
            }
        } else if (action === Action.Delete && before) {
            let index = -1;
            this.rsc.forEach((r:Resource, i:number)=> {
                if (r.type === before.type && r.name === before.name) {
                    index = i
                }
            })
            if (index !== -1) {
                this.rsc.splice(index, 1);
            }
        }
        super.control(action, parent, before, after, ctrl, historyAction);
    }

    parse(json:any):Resource {
        return Resource.parse(json);
    }

    loads(json:Array<object>) {
        json.forEach((item:any)=> this.rsc.push(Resource.parse(item)));
    }

    toJson():Array<object> {
        return this.rsc.map((item:Resource)=>item.toJson())
    }
}