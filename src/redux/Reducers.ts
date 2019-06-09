import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import component from '../component/Component.action';
import element from '../element/Element.action';
import layout from '../layout/Layout.actions';
import property from '../properties/Property.actions';

export default combineReducers({
    component,
    element,
    layout,
    property,
    pender: penderReducer
})