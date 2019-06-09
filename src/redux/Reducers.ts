import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import components from '../components/Components.action';
import elements from '../elements/Elements.action';
import layout from '../layout/Layout.actions';
import property from '../properties/Property.actions';

export default combineReducers({
    components,
    elements,
    layout,
    property,
    pender: penderReducer
})