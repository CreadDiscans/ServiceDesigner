import { combineReducers, Dispatch, bindActionCreators } from 'redux';

import component, { ComponentState, ComponentAction, componentActions } from '../component/Component.action';
import element, { ElementState, ElementAction, elementActions } from '../element/Element.action';
import layout, { LayoutState, LayoutAction, layoutActions } from '../layout/Layout.actions';
import property, { PropertyState, PropertyAction, propertyActions } from '../property/Property.action';
import resource, { ResourceState, ResourceAction, resourceActions } from '../resource/Resource.actions';
import { Location, History } from 'history';
import { match, withRouter } from 'react-router';
import { penderReducer } from 'redux-pender';
import React from 'react';
import { connect } from 'react-redux';

export const rootReducer = combineReducers({
    component,
    element,
    layout,
    property,
    resource,
    pender: penderReducer
})

export type RootState = {
    component: ComponentState;
    element: ElementState;
    layout: LayoutState;
    property: PropertyState;
    resource: ResourceState;
    pender: {
        failure: any;
        pending: any;
        success: any;
    };
}

export type RootActions = {
    ComponentAction: typeof ComponentAction;
    ElementAction: typeof ElementAction;
    LayoutAction: typeof LayoutAction;
    PropertyAction: typeof PropertyAction;
    ResourceAction: typeof ResourceAction;
}

export type Props = {
    data: RootState;
    history: History;
    location: Location;
    match: match;
} & RootActions;

export const connection = (component: typeof React.Component) => 
    // @ts-ignore
    withRouter(connect(
        (state:RootState)=>({data:state}),
        (dispatch:Dispatch) => ({
            ComponentAction: bindActionCreators(componentActions, dispatch),
            ElementAction: bindActionCreators(elementActions, dispatch),
            LayoutAction: bindActionCreators(layoutActions, dispatch),
            PropertyAction: bindActionCreators(propertyActions, dispatch),
            ResourceAction: bindActionCreators(resourceActions, dispatch)
        }))(component))