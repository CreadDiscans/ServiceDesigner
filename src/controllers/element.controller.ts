import { Controller } from './controller';
import { Element, ElementGroup } from '../models/element';
import { Action } from '../utils/constant';
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
    
    control(action:Action, elem:Element) {
        Utils.loop(this.main.getSelectedFile().element, (item:Element)=> {
            if (item === elem) {
                item = elem;
            }
        });
        this.main.sidebar$.next(true);
        this.main.home$.next(true);
    }

    parse(json:any):Element {
        return Element.parse(json);
    }
    
}