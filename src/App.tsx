import React from 'react';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { Menu } from './utils/Menu';
import { Theme } from './utils/Theme';
import { DeprecateService } from './utils/Deprecate';
import Utils from './utils/utils';
import { connectRouter } from './redux/connection';
import { HomeView } from './layout/Home.view';
import { RenderService } from './board/Render.service';
import * as layoutActions from './layout/Layout.actions';
import * as componentActions from './component/Component.action';
import * as resourceActions from './resource/Resource.actions';
import * as elementActions from './element/Element.action';
import * as propertyActions from './property/Property.action';
import { Zeplin } from './utils/Zeplin';
import { Subscription } from 'rxjs';

import * as supportActions from './support/Support.actions';
import SupportAws, {isAwsVaild} from './support/Aws';

class App extends React.Component<any> { 

    sub:Subscription;

    componentWillMount() {
        this.sub = Zeplin.subject.subscribe(val=> this.setState({}))
        new Menu().init(
            (json) => {
                const { LayoutActions, ResourceActions, ComponentActions, ElementActions, PropertyActions, SupportActions } = this.props;
                try {
                    const data = JSON.parse(json);
                    if (data.version === 2) {
                        ResourceActions.loadResource(data.resource);
                        ComponentActions.loadComponent(data.components);
                        ElementActions.clearElement();
                        PropertyActions.reset();
                        if (data.support) {
                            isAwsVaild(data.support.aws).then(()=> {
                                SupportActions.setAwsConfig({
                                    ...data.support.aws,
                                    isConnected:true
                                });
                            })
                        }
                    } else {
                        const deprecateService =  new DeprecateService().parseVersion1(data);
                        ResourceActions.loadResource(deprecateService.toResource());
                        ComponentActions.loadComponent(deprecateService.toComponents());
                        ElementActions.clearElement();
                        PropertyActions.reset();
                    }
                    LayoutActions.message({
                        background: Theme.success,
                        color: Theme.successFont,
                        text: 'Loaded Successfully'
                    })
                } catch(e) {
                    console.log(e)
                    LayoutActions.message({
                        background: Theme.danger,
                        color: Theme.dangerFont,
                        text: 'Load Failed'
                    })
                }
            },  // load File : input data
            async () => {
                const { data, LayoutActions } = this.props;
                try {
                    const copiedComponents = _.cloneDeep(data.component.files);
                    copiedComponents.forEach(comp=> {
                        Utils.loop(comp, (item)=> {
                            delete item.parent;
                            Utils.loop(item.element, (elem)=> {
                                delete elem.parent;
                            })
                        })
                    })
                    const json = {
                        version: 2,
                        components: copiedComponents,
                        resource: data.resource,
                        support: {
                            aws: {
                                accessKeyId: data.support.aws.accessKeyId,
                                secretAccessKey: data.support.aws.secretAccessKey,
                                region: data.support.aws.region,
                                bucket: data.support.aws.bucket
                            }
                        }
                    }
                    const renderService:RenderService = RenderService.getInstance(RenderService);
                    renderService.renderAll(copiedComponents, {
                        color: data.resource.color,
                        asset: data.resource.asset,
                        css: data.resource.css,
                        style: data.resource.style
                    })
                    LayoutActions.message({
                        background: Theme.success,
                        color: Theme.successFont,
                        text: 'Save Successfully'
                    })
                    return Promise.resolve({
                        json:JSON.stringify(json, null, 2),
                        js: renderService.toJs(),
                        css: await renderService.toCss(),
                        rsc:JSON.stringify(renderService.toResouce(), null, 2)
                    })
                } catch(e) {
                    console.log(e)
                    LayoutActions.message({
                        background: Theme.danger,
                        color: Theme.dangerFont,
                        text: 'Save Failed'
                    })
                    return Promise.resolve(undefined)
                }
            }                        // save File : return {json, js, css}
        )
    }

    zep_init = false

    componentDidUpdate() {
        if (!this.zep_init && Zeplin.url.indexOf('https://') === 0) {
            Zeplin.init()
            this.zep_init = true
        }
    }

    componentWillUnmount() {
        this.sub.unsubscribe()
    }

    render() {
        return <div>
            <HomeView/>
            {Zeplin.getModelView()}
            {Zeplin.getWebView()}
            <SupportAws/>
        </div>
    }
}

export default connectRouter(
    (state)=>({
        data: {
            component: state.component,
            resource: state.resource,
            layout: state.layout,
            support: state.support
        }
    }),
    (dispatch)=>({
        LayoutActions: bindActionCreators(layoutActions, dispatch),
        ResourceActions: bindActionCreators(resourceActions, dispatch),
        ComponentActions: bindActionCreators(componentActions, dispatch),
        ElementActions: bindActionCreators(elementActions, dispatch),
        PropertyActions: bindActionCreators(propertyActions, dispatch),
        SupportActions: bindActionCreators(supportActions, dispatch)
    }),
    App
);
