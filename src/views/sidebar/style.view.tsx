import React from 'react';
import { Input, Label, Badge, Button } from 'reactstrap'
import { Layout } from './layout.view'
import Utils from '../../utils/utils';
import AceEditor from 'react-ace';
import 'brace/theme/github';
import 'brace/mode/css';
import 'brace/ext/language_tools';
import { View } from '../view';
import { Action } from '../../utils/constant';
import { Element, ElementStyle } from '../../models/element';

export class SidebarStyle extends View {

    state:any = {
        value: '',
        selectedItem: {style:[]},
        stylePage:0
    }

    componentWillMount() {
        this.update();
    }

    componentWillReceiveProps() {
        this.update();
    }

    update() {
        const selectedItem = this.mainCtrl.getSelectedElement();
        if (this.state.selectedItem !== selectedItem) {
            this.setState({
                value: selectedItem.style[0].style,
                selectedItem: selectedItem,
                stylePage:0
            });
        }
    }
    
    render() {
        let vari = false;
        return <div>
            <Layout />
            <h5>Style 
            {
                this.state.selectedItem.style.map((item:ElementStyle, i:number)=> {
                    return <Badge color={this.state.stylePage === i ? 'info' : 'light'} key={i} pill style={{cursor:'pointer'}}
                        onClick={()=>{
                            this.setState({
                                stylePage: i,
                                value: this.state.selectedItem.style[i].style,
                                condition: this.state.selectedItem.style[i].condition
                            });
                        }}>{i}</Badge>
                })
            }    
            <Badge color="light" pill style={{cursor:'pointer'}}
                onClick={()=> {
                    this.state.selectedItem.style.push(new ElementStyle());
                    this.setState({});
                }}>+</Badge>
            </h5>
            <Input style={{display:'inline-block', width:'calc(100% - 37px)'}} placeholder={'Condition'} disabled={this.state.stylePage===0} 
                value={this.state.selectedItem.style[this.state.stylePage].condition}
                onChange={(e)=>{
                    this.state.selectedItem.style[this.state.stylePage].condition = e.target.value;
                    this.setState({});
                }}/>
            <Button color="danger" style={{float:'right'}} disabled={this.state.stylePage === 0}
                onClick={()=> {
                    this.state.selectedItem.style.splice(this.state.stylePage, 1);
                    this.setState({stylePage:this.state.stylePage-1})
                }}
            >X</Button>
            <AceEditor
                style={{width:'100%', height:200}}
                theme="github" 
                mode="css" 
                value={this.state.value}
                onChange={(value)=> {
                    this.setState({value:value})
                }}
                onValidate={(value)=> {
                    let error = false;
                    value.forEach(item=> {
                        if (item.type === 'error') error = true;
                    });
                    if (!error && this.state.selectedItem.style !== this.state.value) {
                        const file = this.mainCtrl.getSelectedFile();
                        const elem = this.mainCtrl.getSelectedElement();
                        let parent;
                        Utils.loop(file.element, (item:Element)=> {
                            item.children.forEach((child:Element)=> {
                                if (child.id === elem.id) {
                                    parent = item;
                                }
                            })
                        })
                        const after = elem.clone();
                        after.style[this.state.stylePage].style = this.state.value;
                        this.mainCtrl.elementControl(Action.Update, parent, elem.clone(), after);
                    }
                }}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                editorProps={{$blockScrolling: Infinity }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2
                }}
                />
            
            {/* <h5>Property</h5>
            {this.renderPropsItem(this.state.selectedItem.property)} */}
        </div>
    }

    updateProp = (key:string, value:any) => {
        const prop = Utils.deepcopy(this.state.selectedItem.property);
        if (typeof prop[key] === 'string') {
            prop[key] = value;
        } else {  
            prop[key].value = value;
        }
        const file = this.mainCtrl.getSelectedFile();
        const elem = this.mainCtrl.getSelectedElement();
        let parent;
        Utils.loop(file.element, (item:Element)=> {
            item.children.forEach((child:Element)=> {
                if (child === elem) {
                    parent = item;
                }
            })
        })
        const after = elem.clone();
        after.property = prop;
        this.mainCtrl.elementControl(Action.Update, parent, elem.clone(), after);
    }

    renderPropsItem(property:any) {
        if (!property) return <div></div>
        return <div>{
            Object.keys(property).map((key)=> <div key={key}>
                <Label style={styles.propLabel}>{key}</Label>
                <Input style={styles.propValue} 
                    value={typeof property[key] === 'string'  ? 
                        property[key] : property[key].value} 
                    onChange={(e)=>this.updateProp(key, e.target.value)
                }/>
            </div>)
        }
        </div>
    }
}

const styles = {
    propLabel: {
        display:'inline-block',
        width:'30%'
    },
    propValue: {
        display: 'inline-block',
        width:'70%'
    }
}