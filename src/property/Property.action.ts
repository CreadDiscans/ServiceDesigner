import { createAction, handleActions } from 'redux-actions';
import { PropertyType } from '../utils/constant';

const CHOICE_ELEMENT = 'property/CHOICE_ELEMENT';
const CREATE_PROPERTY = 'property/CREATE_PROPERTY';
const DELETE_PROPERTY = 'property/DELETE_PROPERTY';
const SELECT_PROPERTY = 'property/SELECT_PROPERTY';
const READY_TO_CREATE = 'property/READY_TO_CREATE';
const UPDATE_TYPE = 'property/UPDATE_TYPE';
const UPDATE_VALUE = 'property/UPDATE_VALUE';
const UPDATE_KEY = 'property/UPDATE_KEY';
const ADD_CONDITION = 'property/ADD_CONDITION';
const DELETE_CONDITION = 'property/DELETE_CONDITION';
const RESET = 'property/RESET';

export const choiceElement = createAction(CHOICE_ELEMENT);      // element
export const createProperty = createAction(CREATE_PROPERTY);    
export const deleteProperty = createAction(DELETE_PROPERTY);    // name
export const selectProperty = createAction(SELECT_PROPERTY);    // ref of property
export const readyToCreate = createAction(READY_TO_CREATE);
export const updateType = createAction(UPDATE_TYPE);            // type
export const updateValue = createAction(UPDATE_VALUE);          // value
export const updateKey = createAction(UPDATE_KEY);              // key
export const addCondition = createAction(ADD_CONDITION);
export const deleteCondition = createAction(DELETE_CONDITION);  // index
export const reset = createAction(RESET);

const initialState:any = {
    element: {
      id:-1,
      tag:'',
      lib:'',
      prop:[],
      children: []
    },
    select: {
        name:'',
        type:PropertyType.String,
        value:'',
    },
    create: false,
}

export default handleActions({
    [CHOICE_ELEMENT]: (state, {payload}:any) => {
        if (payload === undefined) return initialState
        if (payload.prop.length === 0) {
            payload.prop.push({
                name: 'name',
                type: PropertyType.String,
                value: ''
            })
        }
        return {...state, element:payload, select: {
            name:'',
            type:PropertyType.String,
            value:'',
        } ,create:false}
    },
    [CREATE_PROPERTY]: (state, {payload}:any) => {
        if (state.element.id === -1 || !state.create) return {...state}
        if (state.element.prop.filter(prop=> prop.name === state.select.name).length === 0) {
            state.element.prop.push({
                name: state.select.name,
                value: state.select.value,
                type: state.select.type
            });  
        }
        return {
            ...state,
            select: {
                name:'',
                type: PropertyType.String,
                value:''
            },
            create: false,
        }
    },
    [DELETE_PROPERTY]: (state, {payload}:any) => {
        let idx = undefined;
        state.element.prop.forEach((item, i)=> {
            if (item.name === payload) idx = i
        });
        if (idx !== undefined) state.element.prop.splice(idx, 1);
        return {
            ...state,
            select:{
                name:'',
                type: PropertyType.String,
                value:''
            },
            create:false
        }
    },
    [SELECT_PROPERTY]: (state, {payload}:any) => ({...state, select: payload, create:false}),
    [READY_TO_CREATE]: (state, {payload}:any) => ({
        ...state, 
        select:{
            name:'',
            type: PropertyType.String,
            value:''
        },
        create:true
    }),
    [UPDATE_TYPE]: (state, {payload}:any) => {
        state.select.type = payload
        if (payload === PropertyType.String) {
            state.select.value = '';
        } else if (payload === PropertyType.Number) {
            state.select.value = 0;
        } else if (payload === PropertyType.Boolean) {
            state.select.value = false;
        } else if (payload === PropertyType.Function) {
            state.select.value = undefined;
        } else if (payload === PropertyType.Object) {
            state.select.value = [{condition: '', value: ''}]
        } else if (payload === PropertyType.Variable) {
            state.select.value = '';
        }
        return {
            ...state
        }
    },
    [UPDATE_VALUE]: (state, {payload}:any) => {
        state.select.value = payload
        return {
            ...state
        }
    },
    [UPDATE_KEY]: (state, {payload}:any) => {
        if (state.create) return {...state, select:{...state.select, name:payload}}
        else return {...state}
    },
    [ADD_CONDITION]: (state, {payload}:any) => {
        state.select.value.push({condition:'', value:''})
        return {...state}
    },
    [DELETE_CONDITION]: (state, {payload}:any) => {
        if (payload !== 0) {
            state.select.value.splice(payload, 1);
        }
        return {...state}
    },
    [RESET]: (state, {payload}:any) => (initialState),
}, initialState)