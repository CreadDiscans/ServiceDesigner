import { Controller } from './controller';
import { Element, ElementStyle } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import { Library, LibraryKeys } from '../models/library';

export class ElementController extends Controller {
    
    reactElements:{[s: string]: Array<Element>} = {
        'HtmlDomElement': [
            new Element('div', [], '<div style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</div>').addProps(['text', 'name']),
            new Element('span', [], '<span style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</span>').addProps(['text', 'name']),
            new Element('img', [], '<img style={{style}} src={{src}} alt={{alt}} />').addProps(['src', 'alt']),
            new Element('input', [], '<input style={{style}} type={{type}} name={{name}} value={{value}} onChange={this.handleChange} placeholder={{placeholder}} />').addProps(['type', 'name', 'value', 'placeholder']),
            new Element('h1', [], '<h1 style={{style}}>{{text}}{children}</h1>').addProps(['text']),
            new Element('h2', [], '<h2 style={{style}}>{{text}}{children}</h2>').addProps(['text']),
            new Element('h3', [], '<h3 style={{style}}>{{text}}{children}</h3>').addProps(['text']),
            new Element('h4', [], '<h4 style={{style}}>{{text}}{children}</h4>').addProps(['text']),
            new Element('h5', [], '<h5 style={{style}}>{{text}}{children}</h5>').addProps(['text']),
            new Element('h6', [], '<h6 style={{style}}>{{text}}{children}</h6>').addProps(['text']),
            new Element('p', [], '<p style={{style}}>{{text}}{children}</p>').addProps(['text']),
            new Element('a', [], '<a style={{style}} href={{href}}>{{text}}{children}</a>').addProps(['text', 'href']),
            new Element('button', [], '<button style={{style}} name={{name}} onClick={this.handleClick}>{{text}}{children}</button>').addProps(['text', 'name']),
            new Element('select', [], '<select style={{style}} value={{value}} name={{name}} onChange={this.handleChange}>{children}</select>').addProps(['name', 'value']),
            new Element('option', [], '<option style={{style}} value={{value}}>{{text}}{children}</option>').addProps(['text', 'value']),
            new Element('ul', [], '<ul style={{style}}>{children}</ul>'),
            new Element('li', [], '<li style={{style}}>{{text}}{children}</li>').addProps(['text']),
            new Element('table', [], '<table style={{style}}>{children}</table>'),
            new Element('tr', [], '<tr style={{style}}>{children}</tr>'),
            new Element('th', [], '<th style={{style}}>{children}</th>'),
            new Element('td', [], '<td style={{style}}>{children}</td>'),
            new Element('render', [], '<div style={{style}}>{this.renderPart({name})}</div>').addProps(['name']),
        ],
        'react-router-dom': [
            new Element('Link', [new Library(LibraryKeys.ReactRouterDom)], '<Link style={{style}} to={{to}}>{{text}}{children}</Link>').addProps(['text', 'to']),
        ],
        'reactstrap': [
            new Element('Alert', [new Library(LibraryKeys.ReactStrap)], '<Alert style={{style}} color={{color}}>{{text}}{children}</Alert>').addProps(['color', 'text']),
            new Element('Badge', [new Library(LibraryKeys.ReactStrap)], '<Badge style={{style}} color={{color}}>{{text}}{children}</Badge>').addProps(['color', 'text']),
            new Element('Button', [new Library(LibraryKeys.ReactStrap)], '<Button style={{style}} color={{color}} name={{name}} outline={{outline}==="true"} onClick={this.handleClick}>{{text}}{children}</Button>').addProps(['color', 'outline', 'name', 'text']),
            new Element('Input', [new Library(LibraryKeys.ReactStrap)], '<Input style={{style}} name={{name}} onChange={this.handleChange} value={{value}} placeholder={{placeholder}}/>').addProps(['name', 'value', 'placeholder']),
            new Element('Container', [new Library(LibraryKeys.ReactStrap)], '<Container style={{style}} >{children}</Container>'),
            new Element('Row', [new Library(LibraryKeys.ReactStrap)], '<Row style={{style}} >{children}</Row>'),
            new Element('Col', [new Library(LibraryKeys.ReactStrap)], '<Col style={{style}} >{children}</Col>'),
        ],
        'material-ui': [
            new Element('Button', [new Library(LibraryKeys.MatarialUi)], '<Button style={{style}} color={{color}} name={{name}} onClick={this.handleClick}>{{text}}{children}</Button>').addProps(['color', 'text', 'name'])
        ]
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        'react-native': [
            new Element('View', [new Library(LibraryKeys.ReactNative)], '<View style={{style}}>{children}</View>'),
            new Element('ScrollView', [new Library(LibraryKeys.ReactNative)], '<ScrollView style={{style}}>{children}</ScrollView>'),
            new Element('Text', [new Library(LibraryKeys.ReactNative)], '<Text style={{style}}>{{text}}</Text>').addProps(['text']),
            new Element('TextInput', [new Library(LibraryKeys.ReactNative)], '<TextInput style={{style}} placeholder={{placeholder}} value={{value}} onChangeText={(text)=>this.handleChange({target:{value:text, name:{name}}})}/>').addProps(['name', 'value', 'placeholder']),
            new Element('TouchableOpacity', [new Library(LibraryKeys.ReactNative)], '<TouchableOpacity style={{style}} onPress={()=>this.handleClick({target:{name:{name}}})}>{children}</TouchableOpacity>').addProps(['name']),
            new Element('TouchableWithoutFeedback', [new Library(LibraryKeys.ReactNative)], '<TouchableWithoutFeedback style={{style}} onPress={()=>this.handleClick({target:{name:{name}}})}><View>{children}</View></TouchableWithoutFeedback>').addProps(['name']),
            new Element('Image', [new Library(LibraryKeys.ReactNative)], '<Image style={{style}} source={{uri: {src}}} />').addProps(['src']),
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