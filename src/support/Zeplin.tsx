import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Progress } from 'reactstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { connectRouter } from '../redux/connection';
import { bindActionCreators } from 'redux';
import { FileType, ElementType, PropertyType, CSSType } from '../utils/constant';
import * as componentActions from '../component/Component.action';
import * as elementActions from '../element/Element.action';
import * as propertyActions from '../property/Property.action';
import * as resourceActions from '../resource/Resource.actions';

export const ZeplinSubject = new BehaviorSubject(false);
class SupportZeplin extends React.Component<any> {

    state:any = {
        isOpen:false,
        title:'Import from zepline',
        componentName: '',
        urlInput:'',
        zeplinUrl:'',
        waiting:false,
        current:0,
        totalCnt:1
    }
    sub!:Subscription;
    urlReg = new RegExp(/https:\/\/app\.zeplin\.io\/project\/\w+\/screen\/\w+/)
    elemId = 2;

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

    componentDidMount() {
        this.initWebView()
    }

    trigger() {
        this.setState({
            isOpen:true,
            zeplinUrl:'',
            componentName:''
        })
    }

    confirm() {
        const state = {
            isOpen:false,
            zeplinUrl:this.state.urlInput,
            urlInput:''
        }
        if (this.state.urlInput.match(this.urlReg) === null) {
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
        const webview:any = document.getElementById('zeplin')
        if (webview) {
            webview.addEventListener('did-finish-load', ()=> {
                if (webview.getURL().match(this.urlReg) !== null) {
                    this.startCrawling()
                }
            })
            webview.addEventListener('console-message', (e) => {
                if(e.message.indexOf('jsonData-')===0) {
                    const data = JSON.parse(e.message.substring(9))
                    this.makeElement(data)
                    this.setState({current:data.current})
                } else if (e.message.indexOf('start-') === 0) {
                    this.setState({totalCnt:Number(e.message.substring(6))})
                } else if (e.message === 'finish') {
                    this.setState({isOpen:false, waiting:false, zeplinUrl:'',current:0, totalCnt:1})
                    const {ElementActions} = this.props;
                    const rootElem = this.props.data.element.component.element.children[0];
                    ElementActions.selectElement(rootElem)
                } else {
                    console.log(e.message)
                }
            })
        }
    }

    ignoreStyle = ['width', 'height', 'top', 'left', 'font-family']

    makeStyleFromPayload(payload) {
        const rawLines = payload.css.split('{')[1].split('}')[0].split(';')
        let lines = rawLines.filter(line=> {
            line = line.trim()
            if (line.indexOf(':') == -1) return false;
            const key = line.split(':')[0].trim()
            if (this.ignoreStyle.indexOf(key) != -1) return false;
            return true;
        }).map(line=> {
            line = line.trim()
            const key = line.split(':')[0].trim()
            let val = line.split(':')[1].trim()
            payload.color.forEach(c=> {
                val = val.replace('var(--'+c.key+')', c.value)
            })
            return '\n  '+key+':'+val+';' 
        })
        if (lines.length === 0 ) return undefined
        return '{\n\
        \n  top:'+Number(payload.top.replace('%','')).toFixed(1)+'%;\
        \n  left:'+Number(payload.left.replace('%','')).toFixed(1)+'%;\
        \n  width:'+Number(payload.width.replace('%','')).toFixed(1)+'%;\
        \n  height:'+Number(payload.height.replace('%','')).toFixed(1)+'%;\
        '+lines.join('')+'\
        \n}'
    }
    
    async makeElement(payload) {
        const style = this.makeStyleFromPayload(payload)
        if (style !== undefined) {
            const rootElem = this.props.data.element.component.element.children[0];
            const props = [{
                name:'name',
                type:PropertyType.String,
                value:payload.name
            },{
                name:'style',
                type: PropertyType.Object,
                value: [{condition:'',value: style}]
            }]
            payload.content.forEach(item=> {
                props.push({
                    name:'text',
                    type: PropertyType.String,
                    value: item.text.split('\n').map(text=>text.trim()).join(' ')
                })
            })
            const elem = {
                id:this.elemId,
                tag:'div',
                lib:ElementType.Html,
                prop:props,
                children: [],
                collapse: false,
                parent:rootElem
            }
            rootElem.children.push(elem)
            this.elemId += 1
            for(const asset of payload.asset) {
                const {ResourceActions} = this.props;
                ResourceActions.createAsset({
                    name:asset.name,
                    value:await this.getImageBase64(asset.value)
                })
                elem.children.push({
                    id:this.elemId,
                    tag:'img',
                    lib:ElementType.Html,
                    prop:[{
                        name:'src',
                        type:PropertyType.String,
                        value:'Asset.'+asset.name
                    }, {
                        name:'style',
                        type:PropertyType.Object,
                        value:[{condition:'', value:'{width:100%;}'}]
                    }],
                    children: [],
                    collapse: false,
                    parent:elem
                })
                this.elemId += 1
            }
        }
        return Promise.resolve()
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

    startCrawling() {
        this.setState({isOpen:true, waiting:true})
        this.elemId = 2;
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
        const script = '\
        var current = 0;\
        function getStandard(frame) {\
            if (frame === null) return [0,0];\
            var result = getStandard(frame.offsetParent);\
            return [frame.offsetLeft+result[0], frame.offsetTop+result[1]];\
        }\
        async function getLayerInfo(layer, clickEvent) {\
            return new Promise(resolve=> {\
                const work = () => {\
                    if (layer.className === "zplLayer selected") {\
                        const data = {\
                            current: current,\
                            name: document.getElementsByClassName("sidebarHeader")[0].querySelector("h2").textContent,\
                            top:layer.style.top,\
                            left:layer.style.left,\
                            width:layer.style.width,\
                            height:layer.style.height,\
                            css:document.getElementsByClassName("snippet")[0].textContent\
                        };\
                        data.color = Array.from(document.getElementsByClassName("colorInfo")).map(item=>({\
                            key:item.querySelector("input")===null?"empty":item.querySelector("input").value,\
                            value:item.textContent\
                        }));\
                        data.asset = Array.from(document.getElementsByClassName("assetSection")).map(item=>({\
                            name: item.querySelector("input").value,\
                            value: item.querySelector("img").src\
                        }));\
                        data.content = Array.from(document.getElementsByClassName("contentSection")).map(item=>({\
                            text:item.querySelector("p").textContent\
                        }));\
                        console.log("jsonData-"+JSON.stringify(data));\
                        resolve();\
                    } else {\
                        layer.dispatchEvent(clickEvent);\
                        setTimeout(()=>work(), 100);\
                    }\
                };\
                work();\
            });\
        }\
        var interval = setInterval(async()=>{\
            if (document.getElementsByClassName("zplLayer").length != 0){\
                clearInterval(interval);\
                var std = getStandard(document.getElementsByClassName("layers")[0]);\
                var clickEvent = document.createEvent("MouseEvents");\
                console.log("start-"+document.getElementsByClassName("zplLayer").length);\
                for (const layer of Array.from(document.getElementsByClassName("zplLayer"))) {\
                    current += 1;\
                    if (layer.offsetWidth <= 1 || layer.offsetHeight <= 1) {\
                        continue\
                    }\
                    var x = std[0] + layer.offsetLeft+1;\
                    var y = std[1] + layer.offsetTop+1;\
                    clickEvent.initMouseEvent("click",true,false,window,0,x,y,x,y,false, false, false, false, 0, null);\
                    await getLayerInfo(layer, clickEvent);\
                }\
                console.log("finish");\
            }\
        }, 100);\
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
                        <Progress animated value={(this.state.current/this.state.totalCnt)*100} />
                    </div> : <div>
                        <Input placeholder="Component Name" value={this.state.componentName} onChange={(e)=> {
                            this.setState({componentName:e.target.value})
                        }}/>
                        <Input placeholder="zeplin URL" value={this.state.urlInput} onChange={(e)=> {
                            this.setState({urlInput:e.target.value})
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
            <webview id="zeplin" src={this.state.zeplinUrl} style={{
                position:'fixed',
                display: ((!this.state.isOpen || this.state.waiting) && this.state.zeplinUrl.indexOf('https://') === 0 ) ? 'inline-flex' :'none',
                width:'100%',
                height:'100%',
                zIndex:100,
                background:'white'
            }}/>
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