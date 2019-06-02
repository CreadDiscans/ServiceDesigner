import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import components from '../components/Components.action';

export default combineReducers({
    components,
    pender: penderReducer
})