import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { BehaviorSubject } from 'rxjs';
import { Store } from './Store';

declare var window:any;

export class Zeplin {

    static subject = new BehaviorSubject(false)

    static title;
    static input = '';
    static url = '';

    static init() {
        const webview:any = document.getElementById('zeplin')
        webview.addEventListener('did-finish-load', ()=> {
            console.log(webview.getURL())
            if (webview.getURL().indexOf('https://app.zeplin.io/project') === 0) {
                const script = '\
                function temp(){\
                    var interval = setInterval(function(){\
                        var layers = document.getElementsByClassName("zplLayer");\
                        if(layers.length !== 0) {\
                            clearInterval(interval);\
                            console.log(document.getElementsByClassName("zplLayer").length);\
                            document.getElementsByClassName("zplLayer")[0].click()\
                        }\
                    }, 100);\
                    return "ok";\
                };temp();'
                webview.executeJavaScript(script, true, (result)=> {
                    console.log(result)
                })
            }
        })
        webview.addEventListener('console-message', (e)=> {
            console.log('in webview', e.message)
        })
    }

    static getModelView() {
        return <div>
            <Modal isOpen={Zeplin.subject.value}>
                <ModalHeader>{Zeplin.title}</ModalHeader>
                <ModalBody>
                    <Input value={Zeplin.input} onChange={(e)=> {
                        Zeplin.input = e.target.value
                        Zeplin.subject.next(true)
                    }}></Input>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>Zeplin.after()}>OK</Button>
                    <Button color="secondary" onClick={()=>Zeplin.subject.next(false)}>Cancel</Button>
                </ModalFooter>
            </Modal> 
        </div>
    }

    static getWebView() {
        return <div>
            {Zeplin.url.indexOf('https://') === 0 && 
                <webview id="zeplin" src={Zeplin.url} style={{
                    position:'fixed',
                    width:'100%',
                    height:'100%',
                    zIndex:100,
                    background:'white'
                }}/>
            }
        </div>
    }

    private static after() {
        if (Zeplin.title === 'Set Chrome Driver Path') {
            Store.getInstance<Store>(Store).set('chrome', Zeplin.input)
        } else {
            Zeplin.url = Zeplin.input;
        }
        Zeplin.subject.next(false)
    }
    
    static setChromeDriverPath() {
        Zeplin.title = 'Set Chrome Driver Path'
        Zeplin.input = Store.getInstance<Store>(Store).get('chrome')
        Zeplin.subject.next(true);
    }

    static import() {
        Zeplin.title = 'Set Zeplin URL for importing'
        Zeplin.input = ''
        Zeplin.subject.next(true);
    }
}