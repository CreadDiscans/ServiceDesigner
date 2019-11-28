import Utils from "./utils";
import * as _ from 'lodash';
import { FileType, ElementType } from "./constant";
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { RenderService } from "./RenderService";
import CodeSandbox from 'react-code-sandbox';
import { AppRegistry } from 'react-native-web';

export class DataManager {
    static instance:DataManager;


    static getInstance() {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager()
        }
        return DataManager.instance
    }

    data:any

    selectedComponent:any;

    init(data:any) {
        this.data = data
        this.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                item.parent = _.last(stack)
                if (item.type === FileType.FILE) {
                    Utils.loop(item.element, (elem:any, stack:any)=> {
                        if (elem.lib === 'reactnative') elem.lib = ElementType.ReactNative
                        else if (elem.lib === 'reactstrap') elem.lib = ElementType.Reactstrap
                        elem.parent = _.last(stack)
                    })
                }
            })
        })
    }

    selectComponent(id:number) {
        this.data.components.forEach((comp:any)=> {
            Utils.loop(comp, (item:any, stack:any)=> {
                if (id == item.id) {
                    this.selectedComponent = item
                }
            })
        })
    }

    getWebViewContent() {
        const renderService:RenderService = RenderService.getInstance(RenderService);
        renderService.renderOne(this.selectedComponent, {
            css: this.data.resource.css,
            color: this.data.resource.color,
            asset: this.data.resource.asset,
            style: this.data.resource.style
        })
        AppRegistry.registerComponent('App', ()=> FrameView)
        const { element, getStyleElement } = AppRegistry.getApplication('App', {});
        const html = ReactDOMServer.renderToString(element)
        const css = ReactDOMServer.renderToStaticMarkup(getStyleElement({}));
        const document = `
        <!DOCTYPE html>
        <html style="height:100%">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${renderService.head}
        ${css}
        <body style="height:100%; overflow-y:auto">
        <div id="root" style="display:flex; height: 100%">
        ${html}
        <script>
            var forms = document.getElementsByTagName("form");
            for(var i=0; i<forms.length; i++) {
                forms[i].onsubmit = function() {
                    return false;
                }
            } 
        </script>
        </div>
        `
        return document;
    }
}

class FrameView extends React.Component {

    renderService;

    componentWillMount() {
        this.renderService = RenderService.getInstance(RenderService)
    }

    render() {
        return <CodeSandbox imports={this.renderService.imp}>
            {this.renderService.getBody()}
        </CodeSandbox>
    }
}