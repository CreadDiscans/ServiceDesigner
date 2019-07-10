import { createAction, handleActions } from 'redux-actions';
import { PropertyType } from '../utils/constant';
import { ElementItem } from '../element/Element.action';
import { pender } from 'redux-pender/lib/utils';

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

export type PropertyState = {
    element: ElementItem;
    select: PropertyItem;
    create: boolean;
}

export type PropertyItem = {
    name: string,
    type: PropertyType,
    value: string|number|boolean|Array<{condition:string, value:string}>;
}

const initState:PropertyState = {
    element: {
      id:-1,
      tag:'',
      lib:undefined,
      prop:[],
      children: [],
      collapse: false
    },
    select: {
        name:'',
        type:PropertyType.String,
        value:'',
    },
    create: false,
}

export const PropertyAction = {
    choiceElement: (elem:ElementItem) => Promise.resolve(elem),
    createProperty: () => Promise.resolve(),
    deleteProperty: (name: string) => Promise.resolve(name),
    selectProperty: (property: PropertyItem) => Promise.resolve(property),
    readyToCreate: () => Promise.resolve(),
    updateType: (type: PropertyType) => Promise.resolve(type),
    updateValue: (value: string|number|boolean|Array<{condition:string, value:string}>) => Promise.resolve(value),
    updateKey: (key: string) => Promise.resolve(key),
    addCondition: () => Promise.resolve(),
    deleteCondition: (index:number) => Promise.resolve(index),
    reset: () => Promise.resolve() 
}

export const propertyActions = {
    choiceElement: createAction(CHOICE_ELEMENT, PropertyAction.choiceElement),
    createProperty: createAction(CREATE_PROPERTY, PropertyAction.createProperty),
    deleteProperty: createAction(DELETE_PROPERTY, PropertyAction.deleteProperty),
    selectProperty: createAction(SELECT_PROPERTY, PropertyAction.selectProperty),
    readyToCreate: createAction(READY_TO_CREATE, PropertyAction.readyToCreate),
    updateType: createAction(UPDATE_TYPE, PropertyAction.updateType),
    updateValue: createAction(UPDATE_VALUE, PropertyAction.updateValue),
    updateKey: createAction(UPDATE_KEY, PropertyAction.updateKey),
    addCondition: createAction(ADD_CONDITION, PropertyAction.addCondition),
    deleteCondition: createAction(DELETE_CONDITION, PropertyAction.deleteCondition),
    reset: createAction(RESET, PropertyAction.reset)
}



export default handleActions({
    ...pender({
        type:CHOICE_ELEMENT,
        onSuccess:(state:PropertyState, {payload}) => {
            if (payload === undefined) return initState
            if (payload.prop.length === 0) {
                payload.prop.push({
                    name: 'name',
                    type: PropertyType.String,
                    value: ''
                })
                payload.prop.push({
                    name: 'style',
                    type: PropertyType.Object,
                    value: [{condition:'', value: '{}'}]
                })
            }
            return {...state, element:payload, select: {
                name:'',
                type:PropertyType.String,
                value:'',
            } ,create:false}
        }
    }),
    ...pender({
        type:CREATE_PROPERTY,
        onSuccess:(state:PropertyState, {payload}) => {
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
    }),
    ...pender({
        type:DELETE_PROPERTY,
        onSuccess:(state:PropertyState, {payload}) => {
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
    }),
    ...pender({
        type:SELECT_PROPERTY,
        onSuccess:(state:PropertyState, {payload}) => ({...state, select: payload, create:false}),
    }),
    ...pender({
        type:READY_TO_CREATE,
        onSuccess:(state:PropertyState, {payload}) => ({
            ...state, 
            select:{
                name:'',
                type: PropertyType.String,
                value:''
            },
            create:true
        }),
    }),
    ...pender({
        type:UPDATE_TYPE,
        onSuccess:(state:PropertyState, {payload}) => {
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
    }),
    ...pender({
        type:UPDATE_VALUE,
        onSuccess:(state:PropertyState, {payload}) => {
            state.select.value = payload
            return {
                ...state
            }
        },
    }),
    ...pender({
        type:UPDATE_KEY,
        onSuccess:(state:PropertyState, {payload}) => {
            if (state.create) return {...state, select:{...state.select, name:payload}}
            else return {...state}
        },
    }),
    ...pender({
        type:ADD_CONDITION,
        onSuccess:(state:PropertyState, {payload}) => {
            if (Array.isArray(state.select.value))
                state.select.value.push({condition:'', value:''})
            return {...state}
        },
    }),
    ...pender({
        type:DELETE_CONDITION,
        onSuccess:(state:PropertyState, {payload}) => {
            if (payload !== 0 && Array.isArray(state.select.value)) {
                state.select.value.splice(payload, 1);
            }
            return {...state}
        },
    }),
    ...pender({
        type:RESET,
        onSuccess:(state:PropertyState, {payload}) => (initState)
    }),
}, initState)