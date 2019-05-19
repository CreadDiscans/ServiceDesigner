import { Controller } from './controller';
import { Element, ElementStyle, ElementPropertyType } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import { LibraryKeys } from '../models/library';
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
                type:{type:ElementPropertyType.String},
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
            Element.parseApi({name:'li', prop:{text:{type:ElementPropertyType.String}}}),
            Element.parseApi({name:'table', prop:{}}),
            Element.parseApi({name:'tr', prop:{}}),
            Element.parseApi({name:'th', prop:{}}),
            Element.parseApi({name:'td', prop:{}}),
            new Element('render', undefined, '<div style={{style}}>{this.renderPart({name})}</div>'),
        ],
        'react-router-dom': [
            Element.parseApi({name:'Link', prop:{
                to:{type:ElementPropertyType.String}, 
                text:{type:ElementPropertyType.String}
            }}, LibraryKeys.ReactRouterDom)
        ],
        'reactstrap': reactstrapApi.map((item:any)=> Element.parseApi(item, LibraryKeys.ReactStrap)),
        'material-ui': materialUiAPi.map((item:any)=> Element.parseApi(item,LibraryKeys.MaterialUi))
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        'react-native': [
            Element.parseApi({name:'View', prop:{}}, LibraryKeys.ReactNative),
            Element.parseApi({name:'ScrollView', prop:{}}, LibraryKeys.ReactNative),
            Element.parseApi({name:'Text', prop:{
                text:{type:ElementPropertyType.String}
            }}, LibraryKeys.ReactNative),
            Element.parseApi({name:'TextInput', prop:{
                value:{type:ElementPropertyType.String},
                placeholder:{type:ElementPropertyType.String},
                onChangeText:{type:ElementPropertyType.Func}
            }}, LibraryKeys.ReactNative),
            Element.parseApi({name:'TouchableOpacity', prop:{
                onPress:{type:ElementPropertyType.Func}
            }}, LibraryKeys.ReactNative),
            Element.parseApi({name:'Image', prop:{
                source:{type:ElementPropertyType.String}
            }}, LibraryKeys.ReactNative),
            Element.parseApi({name:'Picker', prop:{
                selectedValue:{type:ElementPropertyType.String},
                onValueChange:{type:ElementPropertyType.Func}
            }}, LibraryKeys.ReactNative),
            Element.parseApi({name:'Picker.Item', prop:{
                label:{type:ElementPropertyType.String},
                value:{type:ElementPropertyType.String}
            }}, LibraryKeys.ReactNative),
            new Element('render', LibraryKeys.ReactNative, '<reactNative.View style={{style}}>{this.renderPart({name})}</reactNative.View>')
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