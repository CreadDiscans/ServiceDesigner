import { Controller } from './controller';
import { Element, ElementStyle, ElementPropertyType } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import { Library, LibraryKeys } from '../models/library';
import materialUiAPi from './api/materialUi.json';
import reactstrapApi from './api/reactstrap.json';

export class ElementController extends Controller {
    
    reactElements:{[s: string]: Array<Element>} = {
        'HtmlDomElement': [
            Element.parseApi({name:'div', prop:{
                onClick:{type:ElementPropertyType.Func},
                text:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'span', prop:{
                onClick:{type:ElementPropertyType.Func},
                text:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'img', prop:{
                src:{type:ElementPropertyType.String},
                alt:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'input', prop:{
                type:{type:ElementPropertyType.Enum},

                value:{type:ElementPropertyType.String},
                placeholder:{type:ElementPropertyType.String},
                onChange:{type:ElementPropertyType.Func}
            }}),
            Element.parseApi({name:'h1', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'h2', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'h3', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'h4', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'h5', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'h6', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'p', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'a', prop:{
                text:{type:ElementPropertyType.String},
                href:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'button', prop:{
                text:{type:ElementPropertyType.String},
                onClick:{type:ElementPropertyType.Func}
            }}),
            Element.parseApi({name:'select', prop:{
                onChange:{type:ElementPropertyType.Func},
                value:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'option', prop:{
                text:{type:ElementPropertyType.String},
                value:{type:ElementPropertyType.String}
            }}),
            Element.parseApi({name:'ul', prop:{}}),
            Element.parseApi({name:'li', prop:{text:ElementPropertyType.String}}),
            Element.parseApi({name:'table', prop:{}}),
            Element.parseApi({name:'tr', prop:{}}),
            Element.parseApi({name:'th', prop:{}}),
            Element.parseApi({name:'td', prop:{}}),
            new Element('render', [], '<div style={{style}}>{this.renderPart({name})}</div>'),
        ],
        'react-router-dom': [
            Element.parseApi({name:'Link', prop:{
                to:ElementPropertyType.String, 
                text:ElementPropertyType.String
            }}, new Library(LibraryKeys.ReactRouterDom))
        ],
        'reactstrap': reactstrapApi.map((item:any)=> Element.parseApi(item, new Library(LibraryKeys.ReactStrap))),
        'material-ui': materialUiAPi.map((item:any)=> Element.parseApi(item, new Library(LibraryKeys.MaterialUi)))
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        'react-native': [
            // Element.define('View', new Library(LibraryKeys.ReactNative), []),
            // Element.define('ScrollView', new Library(LibraryKeys.ReactNative), []),
            // Element.define('Text', new Library(LibraryKeys.ReactNative), [], {text:true}),
            // Element.define('TextInput', new Library(LibraryKeys.ReactNative), ['value', 'placeholder'], {onChangeText:true}),
            // Element.define('TouchableOpacity', new Library(LibraryKeys.ReactNative), [], {onPress:true}),
            // Element.define('Image', new Library(LibraryKeys.ReactNative), [], {source:true}),
            // Element.define('Picker', new Library(LibraryKeys.ReactNative), ['selectedValue'], {onValueChange:true}),
            // Element.define('Picker.Item', new Library(LibraryKeys.ReactNative), ['label', 'value']),
            // new Element('render', [new Library(LibraryKeys.ReactNative)], '<reactNative.View style={{style}}>{this.renderPart({name})}</reactNative.View>').addProps(['name']),
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
                        item.style = after.style.map((item:ElementStyle)=> item.clone());
                    }
                })
            } else {
                const file = this.main.getSelectedFile();
                if (file.element) {
                    file.element.style = after.style.map((item:ElementStyle)=> item.clone());
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