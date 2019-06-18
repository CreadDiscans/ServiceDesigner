import { createAction, handleActions } from 'redux-actions';
import { FileType } from '../models/file';
import Utils from '../utils/utils';

const CHOICE_COMPONENT = 'element/CHOICE_COMPONENT';
const READY_TO_ADD = 'element/READY_TO_ADD';
const UPDATE_NAME = 'element/UPDATE_NAME';
const UPDATE_STATE = 'element/UPDATE_STATE';
const COMPLETE_ADD = 'element/COMPLETE_ADD';
const DELETE_ELEMENT = 'element/DELETE_ELEMENT';
const SELECT_ELEMENT = 'element/SELECT_ELEMENT';
const DELETE_HISTORY = 'element/DELETE_HISTORY';
const HOVER_ELEMENT = 'element/HOVER_ELEMENT';

export const choiceComponent = createAction(CHOICE_COMPONENT); // ref of component
export const readyToAdd = createAction(READY_TO_ADD); // type
export const updateName = createAction(UPDATE_NAME); // name
export const updateState = createAction(UPDATE_STATE); // state
export const completeAdd = createAction(COMPLETE_ADD); 
export const deleteElement = createAction(DELETE_ELEMENT); // element 
export const selectElement = createAction(SELECT_ELEMENT); // element
export const deleteHistory = createAction(DELETE_HISTORY); // id of element
export const hoverElement = createAction(HOVER_ELEMENT); // element

const initialState = {
  component: {
    id: -1,
    element:{
      id:-1,
      tag:'',
      lib:'',
      prop:[],
      children: []
    },
    state: ''
  },
  hover: undefined,
  select:undefined,
  insert: {
    ing: false,
    name: '',
    type: ''
  },
  history: [] 
}

export default handleActions({
  [CHOICE_COMPONENT]: (state, {payload}:any) => {
    if (payload.type === FileType.FILE)  {
      if (payload.element.id === undefined) {
        payload.element = {
          id:0,
          tag:'root',
          children: []
        }
      }
      if (state.history.filter(component=> component.id === payload.id).length === 0) {
        state.history.push(payload)
      }
      return {...state, component:payload}
    } else 
      return {...state}
  },
  [READY_TO_ADD]: (state, {payload}:any)=> {
    return {
      ...state,
      insert: {
        ing:true,
        type:payload,
        name:''
      }
    }
  },
  [UPDATE_NAME]: (state,{payload}:any)=>({...state, insert:{...state.insert, name:payload}}),
  [UPDATE_STATE]: (state, {payload}:any)=> ({...state, component:{...state.component, state: payload}}),
  [COMPLETE_ADD]: (state, {payload}:any)=>{
    if (state.insert.name !== '' ) {
      let maxId = 0;
      loop(state.component.element, (target)=> {
        if (maxId < target.id) {
          maxId = target.id
        }
      })
      const newElem = {
        id: maxId + 1,
        tag: state.insert.name,
        lib: state.insert.type,
        prop: [],
        children: []
      }
      if (state.select) {
        newElem['parent'] = state.select;
        state.select.children.push(newElem);
      } else {
        newElem['parent'] = state.component.element;
        state.component.element.children.push(newElem);
      }
    }
    return {
      ...state,
      insert:{
        ing:false,
        type:undefined,
        name:''
      }
    }
  },
  [DELETE_ELEMENT]: (state, {payload}:any)=> {
    let idx;
    payload.parent.children.forEach((item,i)=> {
      if (item.id === payload.id) {
        idx = i;
      }
    });
    payload.parent.children.splice(idx, 1);
    return {
      ...state
    }
  },
  [SELECT_ELEMENT]: (state, {payload}:any)=>({...state, select:payload}),
  [DELETE_HISTORY]: (state, {payload}:any)=> {
    let idx = undefined;
    state.history.forEach((component, i)=> {
      if (component.id === payload) idx = i;
    })
    if (idx !== undefined) {
      state.history.splice(idx, 1)
      if (state.component.id === payload) {
        if (state.history.length === 0) {
          state.component = Utils.deepcopy(initialState.component)
        } else {
          state.component = state.history[state.history.length-1]
        }
      }
    }
    return {...state}
  },
  [HOVER_ELEMENT]: (state, {payload}:any)=> ({...state, hover: payload})
}, initialState)

const loop = (item, handle) => {
  handle(item);
  item.children.forEach(child=> loop(child, handle));
}