import React from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { connectRouter } from './redux/connection';
import * as layoutActions from './layout/Layout.actions';
import * as componentActions from './component/Component.action';
import * as resourceActions from './resource/Resource.actions';
import * as elementActions from './element/Element.action';
import * as propertyActions from './property/Property.action';
import { HomeView } from './layout/Home.view';
import Utils from './utils/utils';

declare var acquireVsCodeApi;
export class HostConnect {
    static instance;

    static getInstance() {
        if (!HostConnect.instance) {
            HostConnect.instance = new HostConnect()
        }
        return HostConnect.instance
    }

    vscode;

    constructor() {
        this.vscode = acquireVsCodeApi()
    }

    postMessage(message) {
        this.vscode.postMessage(message);
    }
}

class App extends React.Component<any> { 

    componentWillMount() {
        const raw_data = JSON.parse(document.getElementById('raw_data').textContent);
        const { ResourceActions, ComponentActions, ElementActions, PropertyActions } = this.props;
        ResourceActions.loadResource(raw_data.resource);
        ComponentActions.loadComponent(raw_data.components);
        ElementActions.clearElement();
        PropertyActions.reset();
        window.addEventListener("message", (event:any)=>{
            const { data, ComponentActions, ElementActions, PropertyActions} = this.props;
            const message = event.data
            let target;
            switch(message.type) {
                case 'component':
                    data.component.files.forEach(comp=> Utils.loop(comp, (item, stack)=> {
                        if (item.id == message.id) {
                            target = item
                        }
                    })); 
                    if(target) {
                        ComponentActions.selectFile(target)
                        ElementActions.choiceComponent(target)
                    }
                    break
                case 'element':
                    Utils.loop(data.element.component.element, (item, stack)=> {
                        if (item.id == message.id) {
                            target = item
                        }
                    })
                    if (target) {
                        ElementActions.selectElement(target)
                        PropertyActions.choiceElement(target)
                    }
                    break                    
            }
        }, false);
    }

    componentDidMount() {
        HostConnect.getInstance().postMessage({type:'loaded'})
    }

    render() {
        return <HomeView/>
    }
}

export default connectRouter(
    (state)=>({
        data: {
            component: state.component,
            element: state.element,
            resource: state.resource,
            layout: state.layout
        }
    }),
    (dispatch)=>({
        LayoutActions: bindActionCreators(layoutActions, dispatch),
        ResourceActions: bindActionCreators(resourceActions, dispatch),
        ComponentActions: bindActionCreators(componentActions, dispatch),
        ElementActions: bindActionCreators(elementActions, dispatch),
        PropertyActions: bindActionCreators(propertyActions, dispatch)
    }),
    App
);
