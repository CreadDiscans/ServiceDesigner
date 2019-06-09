import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import component from '../component/Component.action';
import elements from '../elements/Elements.action';
import layout from '../layout/Layout.actions';
import property from '../properties/Property.actions';

export default combineReducers({
    component,
    elements,
    layout,
    property,
    pender: penderReducer
})