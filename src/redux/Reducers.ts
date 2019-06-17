import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import component from '../component/Component.action';
import element from '../element/Element.action';
import layout from '../layout/Layout.actions';
import property from '../property/Property.action';
import resource from '../resource/Resource.actions';

export const rootEpic = combineEpics();

export const rootReducer = combineReducers({
    component,
    element,
    layout,
    property,
    resource,
})