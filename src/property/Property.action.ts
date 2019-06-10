import { createAction, handleActions } from 'redux-actions';
import { PropertyType } from '../utils/constant';

const CHOICE_ELEMENT = 'property/CHOICE_ELEMENT';
const CREATE_PROPERTY = 'property/CREATE_PROPERTY';
const DELETE_PROPERTY = 'property/DELETE_PROPERTY';
const SELECT_PROPERTY = 'property/SELECT_PROPERTY';
const UPDATE_PROPERTY = 'property/UPDATE_PROPERTY';
const RESET = 'property/RESET';

export const choiceElement = createAction(CHOICE_ELEMENT);      // element
export const createProperty = createAction(CREATE_PROPERTY);    // name, value, type, variable, 
export const deleteProperty = createAction(DELETE_PROPERTY);    // name
export const selectProperty = createAction(SELECT_PROPERTY);    // ref of property
export const upadteProperty = createAction(UPDATE_PROPERTY);    // value, type, variable
export const reset = createAction(RESET);

const initialState = {
    element: {
      id:-1,
      tag:'',
      lib:'',
      prop:{},
      children: []
    },
    select: undefined
}

export default handleActions({
    [CHOICE_ELEMENT]: (state, {payload}:any) => {
        if (payload === undefined) return initialState
        if (payload.prop.name === undefined) {
            payload.prop.name = {
                type: PropertyType.String,
                variable: false,
                value: ''
            }
        }
        return {...state, element:payload}
    },
    [CREATE_PROPERTY]: (state, {payload}:any) => {
        if (state.element.id === -1) return {...state}
        state.element.prop[payload.name] = {
            value: payload.value,
            type: payload.type,
            variable: payload.variable
        }
        return {
            ...state
        }
    },
    [DELETE_PROPERTY]: (state, {payload}:any) => {
        delete state.element.prop[payload];
        return {
            ...state,
            select:undefined
        }
    },
    [SELECT_PROPERTY]: (state, {payload}:any) => ({...state, select: payload}),
    [UPDATE_PROPERTY]: (state, {payload}:any) => {
        if (state.select) {
            state.select.value = payload.value;
            state.select.type = payload.type;
            state.select.variable = payload.variable;
        }
        return {
            ...state
        }
    },
    [RESET]: (state, {payload}:any) => (initialState)
}, initialState)