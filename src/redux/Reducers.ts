import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import component from '../component/Component.action';
import element from '../element/Element.action';
import layout from '../layout/Layout.actions';
import property from '../property/Property.action';
import resource from '../resource/Resource.actions';

export default combineReducers({
    component,
    element,
    layout,
    property,
    resource,
    pender: penderReducer
})