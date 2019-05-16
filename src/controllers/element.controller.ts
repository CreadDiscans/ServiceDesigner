import { Controller } from './controller';
import { Element, ElementStyle } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import { Library, LibraryKeys } from '../models/library';

export class ElementController extends Controller {
    
    reactElements:{[s: string]: Array<Element>} = {
        'HtmlDomElement': [
            Element.define('div', undefined, [], {onClick:true, text:true}),
            Element.define('span', undefined, [], {onClick:true, text:true}),
            Element.define('img', undefined, ['src', 'alt']),
            Element.define('input', undefined, ['type', 'value', 'placeholder'], {onChange:true}),
            Element.define('h1', undefined, [], {text:true}),
            Element.define('h2', undefined, [], {text:true}),
            Element.define('h3', undefined, [], {text:true}),
            Element.define('h4', undefined, [], {text:true}),
            Element.define('h5', undefined, [], {text:true}),
            Element.define('h6', undefined, [], {text:true}),
            Element.define('p', undefined, [], {text:true}),
            Element.define('a', undefined, ['href'], {text:true}),
            Element.define('button', undefined, [], {onClick:true, text:true}),
            Element.define('select', undefined, ['value'], {onChange:true}),
            Element.define('option', undefined, ['value'], {text:true}),
            Element.define('ul', undefined, []),
            Element.define('li', undefined, [], {text:true}),
            Element.define('table', undefined, []),
            Element.define('tr', undefined, []),
            Element.define('th', undefined, []),
            Element.define('td', undefined, []),
            new Element('render', [], '<div style={{style}}>{this.renderPart({name})}</div>').addProps(['name']),
        ],
        'react-router-dom': [
            Element.define('Link', new Library(LibraryKeys.ReactRouterDom), ['to'], {text:true}),
        ],
        'reactstrap': [
            Element.define('Alert', new Library(LibraryKeys.ReactStrap), ['color'], {text:true}),
            Element.define('Badge', new Library(LibraryKeys.ReactStrap), ['color'], {text:true}),
            Element.define('Button', new Library(LibraryKeys.ReactStrap), ['color', 'outline'], {text:true}),
            Element.define('Input', new Library(LibraryKeys.ReactStrap), ['value', 'placeholder'], {onChange:true}),
            Element.define('Container', new Library(LibraryKeys.ReactStrap), []),
            Element.define('Row', new Library(LibraryKeys.ReactStrap), []),
            Element.define('Col', new Library(LibraryKeys.ReactStrap), []),
        ],
        'material-ui': [
            Element.define('AppBar', new Library(LibraryKeys.MatarialUi), ['color', 'position']),
            Element.define('Avatar', new Library(LibraryKeys.MatarialUi), ['alt', 'src', 'sizes', 'srcSet']),
            Element.define('Backdrop', new Library(LibraryKeys.MatarialUi), []),
            Element.define('Badge', new Library(LibraryKeys.MatarialUi), ['max', 'showZero', 'invisible', 'color', 'variant']),
            Element.define('BottomNavigation', new Library(LibraryKeys.MatarialUi), ['showLabels', 'value'], {onChange:true}),
            Element.define('Button', new Library(LibraryKeys.MatarialUi), ['color', 'disabled', 'disableFocusRipple', 'disableRipple', 'fullWidth', 'href', 'mini', 'size', 'variant'], {text:true, onClick:true}),
            Element.define('Card', new Library(LibraryKeys.MatarialUi), ['raised']),
            Element.define('CardActions', new Library(LibraryKeys.MatarialUi), ['disableActionSpacing']),
            Element.define('CardContent', new Library(LibraryKeys.MatarialUi), []),
            Element.define('CardHeader', new Library(LibraryKeys.MatarialUi), ['disableTypography']),
            Element.define('CardMedia', new Library(LibraryKeys.MatarialUi), ['image', 'src']),
            Element.define('Checkbox', new Library(LibraryKeys.MatarialUi), ['checked', 'color', 'disabled', 'disableRipple', 'type', 'value'], {onChange:true}),
            Element.define('Chip', new Library(LibraryKeys.MatarialUi), ['clickable', 'color', 'variant']),
            Element.define('CircularProgress', new Library(LibraryKeys.MatarialUi), ['disableShrink', 'color', 'size', 'thickness', 'value', 'variant']),
            Element.define('Collapse', new Library(LibraryKeys.MatarialUi), ['collapsedHeight', 'in', 'timeout']),
            Element.define('Dialog', new Library(LibraryKeys.MatarialUi), ['disableBackdropClick', 'disableEscapeKeyDown', 'fullScreen', 'maxWidth']),
            Element.define('DialogContent', new Library(LibraryKeys.MatarialUi), []),
            Element.define('DialogContentText', new Library(LibraryKeys.MatarialUi), [], {text:true}),
            Element.define('DialogTitle', new Library(LibraryKeys.MatarialUi), ['disableTypography']),
            Element.define('Divider', new Library(LibraryKeys.MatarialUi), ['absolute','inset', 'light', 'variant']),
            Element.define('Typography', new Library(LibraryKeys.MatarialUi), ['color','gutterButtom', 'inine', 'variant'], {text:true}),
        ]
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        'react-native': [
            Element.define('View', new Library(LibraryKeys.ReactNative), []),
            Element.define('ScrollView', new Library(LibraryKeys.ReactNative), []),
            Element.define('Text', new Library(LibraryKeys.ReactNative), [], {text:true}),
            Element.define('TextInput', new Library(LibraryKeys.ReactNative), ['value', 'placeholder'], {onChangeText:true}),
            Element.define('TouchableOpacity', new Library(LibraryKeys.ReactNative), [], {onPress:true}),
            Element.define('Image', new Library(LibraryKeys.ReactNative), [], {source:true}),
            new Element('render', [new Library(LibraryKeys.ReactNative)], '<View style={{style}}>{this.renderPart({name})}</View>').addProps(['name']),
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