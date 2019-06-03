import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import components from '../components/Components.action';
import elements from '../elements/Elements.action';

export default combineReducers({
    components,
    elements,
    pender: penderReducer
})