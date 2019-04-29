import { Controller } from './controller';
import { Element } from '../models/element';
import { Action, HisotryAction } from '../utils/constant';
import { LibraryDependency, Library } from '../models/library';

const D = LibraryDependency;
export class ElementController extends Controller {
    
    reactElements:{[s: string]: Array<Element>} = {
        [D.HtmlElement]: [
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
        [D.ReactRouterDom]: [
            new Element('Link', [new Library(D.ReactRouterDom, ['Link'])], '<Link style={{style}} to={{to}}>{{text}}{children}</Link>').addProps(['text', 'to']),
        ],
        [D.Reactscrap]: [
            new Element('Alert', [new Library(D.Reactscrap, ['Alert'])], '<Alert style={{style}} color={{color}}>{{text}}{children}</Alert>').addProps(['color', 'text']),
            new Element('Badge', [new Library(D.Reactscrap, ['Badge'])], '<Badge style={{style}} color={{color}}>{{text}}{children}</Badge>').addProps(['color', 'text']),
            new Element('Button', [new Library(D.Reactscrap, ['Button'])], '<Button style={{style}} color={{color}} name={{name}} outline={{outline}==="true"} onClick={this.handleClick}>{{text}}{children}</Button>').addProps(['color', 'outline', 'name', 'text']),
            new Element('Input', [new Library(D.Reactscrap, ['Input'])], '<Input style={{style}} name={{name}} onChange={this.handleChange} value={{value}} placeholder={{placeholder}}/>').addProps(['name', 'value', 'placeholder']),
            new Element('Container', [new Library(D.Reactscrap, ['Container'])], '<Container style={{style}} >{children}</Container>'),
            new Element('Row', [new Library(D.Reactscrap, ['Row'])], '<Row style={{style}} >{children}</Row>'),
            new Element('Col', [new Library(D.Reactscrap, ['Col'])], '<Col style={{style}} >{children}</Col>'),
        ],
        [D.ReactIcon]: [

        ]
    }

    reactNativeElments:{[s: string]: Array<Element>} = {
        [LibraryDependency.ReactNative]: [
            new Element('View', [new Library(D.ReactNative, ['View'])], '<View style={{style}}>{children}</View>'),
            new Element('ScrollView', [new Library(D.ReactNative, ['ScrollView'])], '<ScrollView style={{style}}>{children}</ScrollView>'),
            new Element('Text', [new Library(D.ReactNative, ['Text'])], '<Text style={{style}}>{{text}}</Text>').addProps(['text']),
            new Element('TextInput', [new Library(D.ReactNative, ['TextInput'])], '<TextInput style={{style}} placeholder={{placeholder}} value={{value}} onChangeText={(text)=>this.handleChange({target:{value:text, name:{name}}})}/>').addProps(['name', 'value', 'placeholder']),
            new Element('TouchableOpacity', [new Library(D.ReactNative, ['TouchableOpacity'])], '<TouchableOpacity style={{style}} onPress={()=>this.handleClick({target:{name:{name}}})}>{children}</TouchableOpacity>').addProps(['name']),
            new Element('TouchableWithoutFeedback', [new Library(D.ReactNative, ['TouchableWithoutFeedback'])], '<TouchableWithoutFeedback style={{style}} onPress={()=>this.handleClick({target:{name:{name}}})}><View>{children}</View></TouchableWithoutFeedback>').addProps(['name']),
            new Element('Image', [new Library(D.ReactNative, ['Image'])], '<Image style={{style}} source={{uri: {src}}} />').addProps(['src']),
            new Element('render', [new Library(D.ReactNative, ['View'])], '<View style={{style}}>{this.renderPart({name})}</View>').addProps(['name']),
        ],
        [LibraryDependency.ReactNativeVectorIcon]: [

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