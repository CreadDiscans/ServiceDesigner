import { Controller } from './controller';
import { Element, ElementGroup } from '../models/element';

export class ElementController extends Controller {
    
    reactElements = {
        [ElementGroup.HtmlElement]: [
            new Element('div', [], '<div style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</div>').addProps(['text', 'name']),
            new Element('span', [], '<span style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</span>').addProps(['text', 'name']),
        ],
        [ElementGroup.Reactstrap]: [

        ],
        [ElementGroup.ReactIcons]: [

        ]
    }

    reactNativeElments = {
        [ElementGroup.ReactNative]: [

        ],
        [ElementGroup.ReactNativeVectorIcons]: [

        ]
    }
    
    
}