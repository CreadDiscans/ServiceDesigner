import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Progress } from 'reactstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import { FileType, ElementType, PropertyType, CSSType } from '../utils/constant';
import * as componentActions from '../component/Component.action';
import * as elementActions from '../element/Element.action';
import * as propertyActions from '../property/Property.action';
import * as resourceActions from '../resource/Resource.actions';
import _ from 'lodash';
import { ajax } from 'rxjs/ajax';

export const ZeplinSubject = new BehaviorSubject(false);

class SupportZeplin extends React.Component<any> {

    state = {
        isOpen:false,
        title:'Import from zepline',
        componentName: '',
        zeplinUrl:'',
        waiting:false,
        progress:0
    }
    sub!:Subscription;
    urlReg = new RegExp(/https:\/\/app\.zeplin\.io\/project\/\w+\/screen\/\w+/)
    webview_init = false;

    UNSAFE_componentWillMount() {
        this.sub = ZeplinSubject.subscribe(val=>{
            if(val) {
                this.trigger()
            }
        })
    }

    componentWillUnmount() {
        this.sub.unsubscribe()
    }

    trigger() {
        this.setState({
            isOpen:true,
            zeplinUrl:'',
            componentName:''
        })
    }

    confirm() {
        const state = {isOpen:false}
        if (this.state.zeplinUrl.match(this.urlReg) === null) {
            alert('Invalid URL')
            state['zeplinUrl'] = ''
        }
        if (this.state.componentName == '') {
            alert('Component Name is Empty')
            state['zeplinUrl'] = ''
        }
        this.setState(state)
    }

    initWebView() {
        const interval = setInterval(()=> {
            const webview:any = document.getElementById('zeplin')
            if (webview) {
                clearInterval(interval)
                webview.addEventListener('did-finish-load', ()=> {
                    if (webview.getURL().match(this.urlReg) !== null) {
                        this.startCrawling()
                    }
                })
            }
        }, 500)
        return <div></div>
    }

    parseProperty(layer, option) {
        const rgbToStr = (obj) => 'rgba('+obj['r']+','+obj['g']+','+obj['b']+','+obj['a']+')'
        const props = []
        const style:any = {}
        // style.width = (layer.rect.width/option.width*100)+'%'
        // style.height = (layer.rect.height/option.height*100)+'%'
        // style.top = (layer.rect.y/option.height*100)+'%'
        // style.left = (layer.rect.x/option.width*100)+'%'
        style.minWidth = layer.rect.width.toFixed(0)
        style.minHeight = layer.rect.height.toFixed(0)
        if (layer.rect.y !== 0) style.top = layer.rect.y.toFixed(0)
        if (layer.rect.x !== 0) style.left = layer.rect.x.toFixed(0)
        if(layer.content) {
            const text = {
                name:'text',
                type:PropertyType.String,
                value:layer.content.split('\n').map(str=>str.trim()).join(' ')
            }
            props.push(text)
            layer.textStyles.forEach(item=> {
                Object.keys(item.style).forEach(s=> {
                    if (s === 'color') {
                        if (item.style[s].a !== 0) {
                            style.color = rgbToStr(item.style[s])
                        }
                    } else if(s === 'fontFace') {
                        // style.fontFamily = item.style[s]
                    } else if(s === 'lineHeight') {
                        // style.lineHeight = item.style[s]/21
                    } else {
                        style[s] = item.style[s]
                    }
                })
            })
        }
        layer.fills.forEach(item=> {
            style.backgroundColor = rgbToStr(item.color)
        })
        if(layer.borderRadius > 0) {
            style.borderRadius = layer.borderRadius
        }
        layer.borders.forEach(item=> {
            if (item.color.a !== 0) {
                style.borderColor = rgbToStr(item.color)
                if(item.thickness !== 1) style.borderWidth = item.thickness
            }
        })
        let styleObj = '{'+Object.keys(style).map(key=>key.replace(/([A-Z])/g, (g)=>`-${g[0].toLowerCase()}`)+':'+style[key]+';').join('\n  ')+'\n}'
        props.push({
            name:'style',
            type: PropertyType.Object,
            value: [{condition:'',value: styleObj}]
        })
        return props
    }

    async getImageBase64(url) {
        return new Promise(resolve=> {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            }
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }) 
    }

    async parserPayload(payload, rootElem) {
        const { ElementActions, ResourceActions } = this.props;
        let elemId = 2;
        const makeElem = async(layer, parent) => {
            // console.log(layer)
            const elem = {
                id:elemId,
                tag:'div',
                lib:ElementType.Html,
                prop:this.parseProperty(layer, {
                    width:payload.width,
                    height:payload.height
                }),
                children: [],
                collapse: false,
                parent:parent.elem
            }
            elemId += 1;
            for(const asset of payload.assets.filter(item=>item.layerId===layer.sourceId)) {
                const name = asset.displayName.replace(' ','_')
                ResourceActions.createAsset({
                    name:name,
                    value:await this.getImageBase64(asset.contents[0].url)
                })
                elem.children.push({
                    id: elemId += 1,
                    tag:'img',
                    lib:ElementType.Html,
                    prop:[{
                        name:'src',
                        type:PropertyType.String,
                        value:'Asset.'+name
                    }],
                    children: [],
                    collapse: false,
                    parent:elem
                })
            }

            parent.elem.children.push(elem)
            layer.elem = elem
            return Promise.resolve()
        }
        const loop = (items, parent, action) => {
            items.forEach((child)=> {
                action(child, parent)
                if (child.layers) {
                    loop(child.layers, child, action)
                }
            })
        }
        return new Promise(resolve=> {
            let total = 0;
            let current = 0;
            const workQueue = []
            loop(payload.layers, {elem:rootElem}, (layer, parent)=> {
                total += 1
                workQueue.push({layer:layer, parent:parent})
            })
            const work = () => setTimeout(async()=> {
                if (workQueue.length !== 0) {
                    const item = workQueue.shift()
                    await makeElem(item.layer, item.parent)
                    this.setState({progress:current/total})
                    current += 1
                    work()
                } else {
                    ElementActions.selectElement(rootElem)
                    this.setState({isOpen:false, waiting:false, zeplinUrl:'',progress:0})
                    resolve()
                }
            }, 1)
            work()
        })
    } 

    startCrawling() {
        this.setState({isOpen:true, waiting:true})
        const { ComponentActions, ElementActions, PropertyActions, ResourceActions } = this.props;
        ComponentActions.selectFile(undefined)
        ComponentActions.createFile({
            name:this.state.componentName,
            type:FileType.FILE
        })
        const {data} = this.props;
        data.component.files.filter(item=>item.name === this.state.componentName).forEach(item=> {
            ComponentActions.selectFile(item);
            ElementActions.choiceComponent(item);
            PropertyActions.reset();
        })
        ElementActions.selectElement(undefined);
        const webview:any = document.getElementById('zeplin')
        ElementActions.readyToAdd(ElementType.Html);
        ElementActions.updateName('div');
        ElementActions.completeAdd();
        const rootElem = this.props.data.element.component.element.children[0];
        ElementActions.selectElement(rootElem);
        PropertyActions.choiceElement(rootElem);
        PropertyActions.readyToCreate()
        PropertyActions.updateKey('className')
        PropertyActions.updateValue('fromZeplin')
        PropertyActions.createProperty()
        ResourceActions.createCss({
            name:'notosans',
            type:CSSType.Url,
            value:'https://fonts.googleapis.com/earlyaccess/notosanskr.css'
        })
        ResourceActions.createCss({
            name:'fromZeplin',
            type:CSSType.Style,
            value:'.fromZeplin div {\n position:absolute;\n  font-family:Noto Sans KR\n  font-weight:300\n}'
        })
        let lock = false;
        webview.addEventListener('console-message', (e)=> {
            if (e.message.indexOf('https://cdn.zeplin.io')===0 && !lock) {
                lock = true;
                ajax.get(e.message).subscribe((res)=> {
                    console.log(e.message, res.response)
                    setTimeout(async()=> {
                        await this.parserPayload(res.response, rootElem)
                        webview.executeJavaScript('location.href="about:blank"', true)
                        lock = false;
                        this.setState({isOpen:false, waiting:false, zeplinUrl:'',progress:0})
                    })
                })
            }
        })
        const script = '\
        var called = false;\
        var interval = setInterval(async()=>{\
            if (document.getElementsByClassName("zplLayer").length != 0){\
                clearInterval(interval);\
                const entries = performance.getEntries().filter(item=>item.name.indexOf("https://cdn.zeplin.io") === 0 && item.initiatorType === "fetch");\
                if(!called) {\
                    console.log(entries[0].name);\
                    called = true;\
                }\
            }\
        }, 1000);\
        '
        webview.executeJavaScript(script, true)
        
    }

    render() {
        return <div>
            <Modal isOpen={this.state.isOpen}>
                <ModalHeader>{this.state.title}</ModalHeader>
                <ModalBody>
                    {this.state.waiting ? <div style={{textAlign:'center'}}>
                        Please waiting until crawling the zeplin page...<br /><br />
                        <Progress animated value={this.state.progress*100} />
                    </div> : <div>
                        <Input placeholder="Component Name" value={this.state.componentName} onChange={(e)=> {
                            this.setState({componentName:e.target.value})
                        }}/>
                        <Input placeholder="zeplin URL" value={this.state.zeplinUrl} onChange={(e)=> {
                            this.setState({zeplinUrl:e.target.value})
                        }} />
                    </div>}
                </ModalBody>
                <ModalFooter>
                    {!this.state.waiting && <div>
                        <Button color="primary" onClick={()=>this.confirm()}>OK</Button>{' '}
                        <Button color="secondary" onClick={()=>this.setState({isOpen:false})}>Cancel</Button>
                    </div>}
                </ModalFooter>
            </Modal> 
            {(!this.state.isOpen || this.state.waiting) && this.state.zeplinUrl.indexOf('https://') === 0 && <div>
                <webview id="zeplin" src={this.state.zeplinUrl} style={{
                    position:'fixed',
                    width:'100%',
                    height:'100%',
                    zIndex:100,
                    background:'white'
                }}/>
                {this.initWebView()}
            </div>
            }
        </div>
    }
}

export default connectRouter(
    (state)=>({
        data: {
            component: state.component,
            element: state.element,
            property: state.property
        }
    }),
    (dispatch)=>({
        ComponentActions: bindActionCreators(componentActions, dispatch),
        ElementActions: bindActionCreators(elementActions, dispatch),
        PropertyActions: bindActionCreators(propertyActions, dispatch),
        ResourceActions: bindActionCreators(resourceActions, dispatch)
    }),
    SupportZeplin
)