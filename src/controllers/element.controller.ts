import { Controller } from './controller';
import { Element, ElementGroup } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import Utils from './../utils/utils';

export class ElementController extends Controller {
    
    reactElements:{[s: string]: Array<Element>} = {
        [ElementGroup.HtmlElement]: [
            new Element('div', [], '<div style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</div>').addProps(['text', 'name']),
            new Element('span', [], '<span style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</span>').addProps(['text', 'name']),
            new Element('img', [], '<img style={{style}} src={{src}} alt={{alt}} />').addProps(['src', 'alt'])
        ],
        [ElementGroup.Reactstrap]: [

        ],
        [ElementGroup.ReactIcons]: [

        ]
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        [ElementGroup.ReactNative]: [

        ],
        [ElementGroup.ReactNativeVectorIcons]: [

        ]
    }
    
    control(action:Action, parent:Element|undefined, before:Element|undefined,
            after:Element|undefined, ctrl:ElementController, historyAction:HisotryAction = HisotryAction.Do) {
        if (action === Action.Create && parent && after) {
            parent.children.push(after)
        } else if (action === Action.Delete && parent && before) {
            let idx = -1;
            parent.children.forEach((item:Element, i:number)=> {
                if (item.id === before.id) {
                    idx = i;
                }
            });
            if (idx !== -1) parent.children.splice(idx, 1);
        } else if (action === Action.Update && before && after) {
            if (parent) {
                parent.children.forEach((item:Element)=> {
                    if (item.id === before.id) {
                        item.property = after.property;
                        item.style = after.style;
                    }
                })
            } else {
                const file = this.main.getSelectedFile();
                if (file.element) {
                    file.element.style = after.style;
                    file.element.property = after.property;
                }
            }
        }
        super.control(action, parent, before, after, ctrl, historyAction);
    }

    parse(json:any):Element {
        return Element.parse(json);
    }
    
}