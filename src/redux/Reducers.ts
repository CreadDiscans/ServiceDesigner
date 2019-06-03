import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import components from '../components/Components.action';
import elements from '../elements/Elements.action';
import layout from '../layout/Layout.actions';

export default combineReducers({
    components,
    elements,
    layout,
    pender: penderReducer
})