import React from 'react';
import _ from 'lodash';

import { Menu } from './utils/Menu';
import { Theme } from './utils/Theme';
import { DeprecateService } from './utils/Deprecate';
import Utils from './utils/utils';
import { HomeView } from './layout/Home.view';
import { RenderService } from './board/Render.service';
import { connection, Props } from './redux/Reducers';
import { ElementItem } from './element/Element.action';
import { ComponentItem } from './component/Component.action';


class App extends React.Component<Props> { 

    componentWillMount() {
        new Menu().init(
            (json:any) => {
                const { LayoutAction, ResourceAction, ComponentAction, ElementAction, PropertyAction } = this.props;
                try {
                    const data = JSON.parse(json);
                    if (data.version === 2) {
                        ResourceAction.loadResource(data.resource.color, data.resource.asset, data.resource.css, data.resource.style);
                        ComponentAction.loadComponent(data.components);
                        ElementAction.clearElement();
                        PropertyAction.reset();
                    } else {
                        const deprecateService =  new DeprecateService().parseVersion1(data);
                        const rsc = deprecateService.toResource()
                        ResourceAction.loadResource(rsc.color, rsc.asset, rsc.css, rsc.style);
                        ComponentAction.loadComponent(deprecateService.toComponents());
                        ElementAction.clearElement();
                        PropertyAction.reset();
                    }
                    LayoutAction.message(
                        Theme.success,
                        Theme.successFont,
                        'Loaded Successfully'
                    ).then(()=> setTimeout(()=> LayoutAction.messageRelease(), 3000))
                } catch(e) {
                    console.log(e)
                    LayoutAction.message(
                        Theme.danger,
                        Theme.dangerFont,
                        'Load Failed'
                    ).then(()=> setTimeout(()=> LayoutAction.messageRelease(), 3000))
                }
            },  // load File : input data
            async () => {
                const { data, LayoutAction } = this.props;
                try {
                    const copiedComponents = _.cloneDeep(data.component.files);
                    copiedComponents.forEach(comp=> {
                        Utils.loop(comp, (item:ComponentItem)=> {
                            delete item.parent;
                            Utils.loop(item.element, (elem:ElementItem)=> {
                                delete elem.parent;
                            })
                        })
                    })
                    const json = {
                        version: 2,
                        components: copiedComponents,
                        resource: data.resource
                    }
                    const renderService:RenderService = RenderService.getInstance(RenderService);
                    renderService.renderAll(copiedComponents, {
                        color: data.resource.color,
                        asset: data.resource.asset,
                        css: data.resource.css,
                        style: data.resource.style
                    })
                    LayoutAction.message(
                        Theme.success,
                        Theme.successFont,
                        'Save Successfully'
                    ).then(()=> setTimeout(()=> LayoutAction.messageRelease(), 3000))
                    return Promise.resolve({
                        json:JSON.stringify(json),
                        js: renderService.toJs(),
                        css: await renderService.toCss()
                    })
                } catch(e) {
                    console.log(e)
                    LayoutAction.message(
                        Theme.danger,
                        Theme.dangerFont,
                        'Save Failed'
                    ).then(()=> setTimeout(()=> LayoutAction.messageRelease(), 3000))
                    return Promise.resolve(undefined)
                }
            }                        // save File : return {json, js, css}
        )
    }

    render() {
        return <HomeView/>
    }
}

export default connection(App);