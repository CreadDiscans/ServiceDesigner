import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import component from '../component/Component.action';
import element from '../element/Element.action';
import layout, { layoutEpic } from '../layout/Layout.actions';
import property from '../property/Property.action';
import resource from '../resource/Resource.actions';
import support from '../support/Support.actions';

export const rootEpic = combineEpics(layoutEpic);

export const rootReducer = combineReducers({
    component,
    element,
    layout,
    property,
    resource,
    support
})