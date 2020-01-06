import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Progress } from 'reactstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import { FileType, ElementType } from '../utils/constant';
import * as componentActions from '../component/Component.action';
import * as elementActions from '../element/Element.action';
import * as propertyActions from '../property/Property.action';
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

    // ignoreStyle = ['position', 'width', 'height']

    // makeStyleFromPayload(payload) {
    //     const rawLines = payload.css.split('{')[1].split('}')[0].split(';')
    //     let lines = rawLines.filter(line=> {
    //         line = line.trim()
    //         if (line.indexOf(':') == -1) return false;
    //         const key = line.split(':')[0].trim()
    //         if (this.ignoreStyle.indexOf(key) != -1) return false;
    //         return true;
    //     }).map(line=> {
    //         line = line.trim()
    //         const key = line.split(':')[0].trim()
    //         let val = line.split(':')[1].trim()
    //         payload.color.forEach(c=> {
    //             val = val.replace('var(--'+c.key+')', c.value)
    //         })
    //         return '\n  '+key+':'+val+';' 
    //     })
    //     if (lines.length === 0 ) return undefined
    //     lines = lines.concat(rawLines.filter(line=> {
    //         line = line.trim()
    //         if (line.indexOf(':') == -1) return false;
    //         const key = line.split(':')[0].trim()
    //         if(key == 'width' || key == 'height') {
    //             return true
    //         } else {
    //             return false
    //         }
    //     }).map(line=> {
    //         line = line.trim()
    //         const key = line.split(':')[0].trim()
    //         let val = line.split(':')[1].trim()
    //         payload.color.forEach(c=> {
    //             val = val.replace('var(--'+c.key+')', c.value)
    //         })
    //         return '\n  min-'+key+':'+val+';' 
    //     }))
    //     console.log(payload)
    //     return '{\n\
    //     \n  position:absolute;\
    //     \n  top:'+payload.top+';\
    //     \n  left:'+payload.left+';\
    //     \n  width:'+payload.width+';\
    //     \n  height:'+payload.height+';\
    //     '+lines.join('')+'\
    //     \n}'
    // }

    // makeAssetFromPayload(payload) {

    // }

    async parserPayload(payload, rootElem) {
        const { ElementActions } = this.props;
        const loop = (items, parent, action) => {
            items.forEach((child)=> {
                action(child, parent)
                if (child.layers) {
                    loop(child.layers, child, action)
                }
            })
        }
        let total = 0;
        let current = 0;
        const workQueue = []
        loop(payload.layers, {elem:rootElem}, (layer, parent)=> {
            total += 1
            workQueue.push({layer:layer, parent:parent})
        })
        const makeElem = (layer, parent) => {
            ElementActions.selectElement(parent.elem)
            ElementActions.readyToAdd(ElementType.Html)
            ElementActions.updateName('div')
            ElementActions.completeAdd()
            layer.elem = _.last(parent.elem.children)
        }
        const work = () => setTimeout(()=> {
            if (workQueue.length !== 0) {
                const item = workQueue.shift()
                makeElem(item.layer, item.parent)
                this.setState({progress:current/total})
                current += 1
                work()
            } else {
                this.setState({isOpen:false, waiting:false, zeplinUrl:'',progress:0})
            }
        }, 1)
        work()

    } 

    startCrawling() {
        this.setState({isOpen:true, waiting:true})
        const webview:any = document.getElementById('zeplin')
        const { ComponentActions, ElementActions, PropertyActions } = this.props;
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
        ElementActions.readyToAdd(ElementType.Html);
        ElementActions.updateName('div');
        ElementActions.completeAdd();
        const rootElem = this.props.data.element.component.element.children[0];

        webview.addEventListener('console-message', (e)=> {
            ajax.get(e.message).subscribe(res=> {
                this.parserPayload(res.response, rootElem)
            })
            // if (e.message === 'finish') {
            //     this.setState({isOpen:false, waiting:false, zeplinUrl:''})
            // } else if (e.message.indexOf('progress-') === 0) {
            //     const block = e.message.split('progress-')[1].split('/')
            //     this.setState({progress:Number(block[0])/Number(block[1])})
            // } else {
            //     try {
            //         const payload = JSON.parse(e.message)
            //         const style = this.makeStyleFromPayload(payload)
            //         if (style !== undefined) {
            //             ElementActions.selectElement(rootElem)
            //             ElementActions.readyToAdd(ElementType.Html)
            //             ElementActions.updateName('div')
            //             ElementActions.completeAdd()
            //             const elem = _.last(this.props.data.element.component.element.children[0].children);
            //             ElementActions.selectElement(elem);
            //             PropertyActions.choiceElement(elem);
            //             this.props.data.property.element.prop.filter(item=>item.name === 'style').map(item=> {
            //                 PropertyActions.selectProperty(item);
            //                 item.value[0].value = style
            //                 PropertyActions.updateValue(item.value)
            //             })
            //             payload.content.forEach(item=> {
            //                 PropertyActions.readyToCreate()
            //                 PropertyActions.updateKey('text')
            //                 PropertyActions.updateValue(item.text)
            //                 PropertyActions.createProperty()
            //             })
            //             payload.asset.forEach(item=> {
            //                 ElementActions.readyToAdd(ElementType.Html)
            //                 ElementActions.updateName('img')
            //                 ElementActions.completeAdd()
            //                 const elem = _.last(this.props.data.element.component.element.children[0].children);
            //                 const img = _.last(elem.children)
            //                 ElementActions.selectElement(img)
            //                 PropertyActions.choiceElement(img)
            //                 PropertyActions.readyToCreate()
            //                 PropertyActions.updateKey('src')
            //                 PropertyActions.updateValue(item.value)
            //                 PropertyActions.createProperty()
            //             })
            //         }
            //     }catch(e) {
            //         console.log(e.message)
            //     }
            // }
        })
        // const script = '\
        // var headers = [];\
        // function getStandard(frame) {\
        //     if (frame === null) return [0,0];\
        //     var result = getStandard(frame.offsetParent);\
        //     return [frame.offsetLeft+result[0], frame.offsetTop+result[1]];\
        // }\
        // async function findSnippet(){\
        //     return new Promise(resolve=>{\
        //         const startTime = new Date().getTime();\
        //         const it = setInterval(()=> {\
        //             if(document.getElementsByClassName("sidebarHeader").length > 0){\
        //                 let _header = document.getElementsByClassName("sidebarHeader")[0].querySelector("h2").textContent;\
        //                 if(headers.indexOf(_header) === -1) {\
        //                     clearInterval(it);\
        //                     headers.push(_header);\
        //                     resolve();\
        //                 }\
        //             }\
        //             if (new Date().getTime() - startTime > 5000) {\
        //                 resolve();\
        //             }\
        //         }, 100);\
        //     });\
        // }\
        // var interval = setInterval(async()=>{\
        //     if (document.getElementsByClassName("zplLayer").length != 0){\
        //         clearInterval(interval);\
        //         var std = getStandard(document.getElementsByClassName("layers")[0]);\
        //         var layers = Array.from(document.getElementsByClassName("zplLayer"));\
        //         var clickEvent = document.createEvent("MouseEvents");\
        //         for(var i=0;i<layers.length;i++) {\
        //             var layer = layers[i];\
        //             var x = std[0]+layer.offsetLeft;\
        //             var y = std[1]+layer.offsetTop;\
        //             clickEvent.initMouseEvent("click",true,false,window,0,x,y,x,y,false, false, false, false, 0, null);\
        //             layer.dispatchEvent(clickEvent);\
        //             await findSnippet();\
        //             const data = {\
        //                 top:layer.style.top,\
        //                 left:layer.style.left,\
        //                 width:layer.style.width,\
        //                 height:layer.style.height,\
        //                 css:document.getElementsByClassName("snippet")[0].textContent\
        //             };\
        //             data.color = Array.from(document.getElementsByClassName("colorInfo")).map(item=>({\
        //                 key:item.querySelector("input")===null?"empty":item.querySelector("input").value,\
        //                 value:item.textContent\
        //             }));\
        //             data.asset = Array.from(document.getElementsByClassName("assetSection")).map(item=>({\
        //                 name: item.querySelector("input").value,\
        //                 value: item.querySelector("img").src\
        //             }));\
        //             data.content = Array.from(document.getElementsByClassName("contentSection")).map(item=>({\
        //                 text:item.querySelector("p").textContent\
        //             }));\
        //             console.log(JSON.stringify(data));\
        //             document.getElementsByClassName("layers")[0].click();\
        //             console.log("progress-"+i+"/"+layers.length);\
        //         }\
        //         console.log("finish");\
        //     }\
        // });'
        const script2 = '\
        var interval = setInterval(async()=>{\
            if (document.getElementsByClassName("zplLayer").length != 0){\
                clearInterval(interval);\
                console.log(performance.getEntries().filter(item=>item.name.indexOf("https://cdn.zeplin.io") === 0 && item.initiatorType === "fetch")[0].name);\
                \
            }\
        });\
        '
        webview.executeJavaScript(script2, true)
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
        PropertyActions: bindActionCreators(propertyActions, dispatch)
    }),
    SupportZeplin
)