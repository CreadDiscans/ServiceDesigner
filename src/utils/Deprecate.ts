import Utils from "./utils";
import { FileType } from "../models/file";
import _ from 'lodash';
import { PropertyType, CSSType, ElementType } from "./constant";

export class DeprecateService {

    resource;
    components;

    parseVersion1(json) {
        this.components = [];
        this.resource = {
            color: [],
            asset: [],
            css: []
        }
        let id = 1;
        json.root.children.forEach(comp=> {
            Utils.loop(comp, (item, stack)=> {
                let elemId = 0;
                let root;
                Utils.loop(item.element, (item, stack)=> {
                    const forDepth = stack.filter((elem, i)=> stack.length -1 !== i).filter(elem=> 
                        elem.property.filter(prop=> prop.name === 'for' && prop.isActive)).length
                    const element = {
                        id: elemId,
                        tag: item.name,
                        lib: item.library === undefined ? ElementType.Html : item.library === 'reactNative' ? ElementType.ReactNative : item.library,
                        prop: [
                            {
                                name: 'style', 
                                type: 'object',
                                value:item.style.map(style=> ({
                                    condition: style.condition.replace('item', 'item'+forDepth), 
                                    value:style.style.replace('style{', '{')
                                })
                            )}
                        ].concat(item.property.filter(prop=> prop.isActive).map(prop=> ({
                            name: prop.name,
                            type: prop.isVariable ? PropertyType.Variable : prop.type,
                            value: prop.isVariable && prop.value.indexOf('item') === 0 ? 
                                prop.value.replace('item', 'item' + forDepth) : prop.value
                        }))),
                        children: []
                    }
                    elemId += 1;
                    item.convert = element;
                    const last = _.last(stack)
                    if (last) {
                        last.convert.children.push(element)
                    } else {
                        element.tag = 'root';
                        root = element;
                    }
                })
                const component = {
                    id: id,
                    name:item.name, 
                    type:item.type, 
                    element: item.type === FileType.FILE ? root : {},
                    collapse:false,
                    state:JSON.stringify(item.state),
                    children:[]
                }
                id += 1
                item.convert = component
                const last = _.last(stack)
                if (last) {
                    last.convert.children.push(item.convert);
                } else {
                    this.components.push(component);
                }
            })
        })
        JSON.parse(json.resource).forEach(rsc=> {
            if (rsc.type === 'color') {
                this.resource.color.push({name: rsc.name, value: rsc.value})
            } else if (rsc.type === 'asset') {
                this.resource.asset.push({name: rsc.name, value: rsc.value})
            } else if (rsc.type === 'css') {
                this.resource.css.push({
                    name: rsc.name,
                    value: rsc.value,
                    type: CSSType.Style
                })
            }
        })
        return this;
    }

    toResource() {
        return this.resource;
    }

    toComponents() {
        return this.components;
    }
}