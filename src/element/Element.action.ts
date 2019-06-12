import { createAction, handleActions } from 'redux-actions';
import { FileType } from '../models/file';

const CHOICE_COMPONENT = 'element/CHOICE_COMPONENT';
const READY_TO_ADD = 'element/READY_TO_ADD';
const UPDATE_NAME = 'element/UPDATE_NAME';
const COMPLETE_ADD = 'element/COMPLETE_ADD';
const DELETE_ELEMENT = 'element/DELETE_ELEMENT';
const SELECT_ELEMENT = 'elments/SELECT_ELEMENT';

export const choiceComponent = createAction(CHOICE_COMPONENT); // ref of component
export const readyToAdd = createAction(READY_TO_ADD); // type
export const updateName = createAction(UPDATE_NAME); // name
export const completeAdd = createAction(COMPLETE_ADD); 
export const deleteElement = createAction(DELETE_ELEMENT); // element 
export const selectElement = createAction(SELECT_ELEMENT); // element

const initialState = {
  component: {
    element:{
      id:-1,
      tag:'',
      lib:'',
      prop:[],
      children: []
    }
  },
  select:undefined,
  insert: {
    ing: false,
    name: '',
    type: ''
  }

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
  [COMPLETE_ADD]: (state, {payload}:any)=>{
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
  [SELECT_ELEMENT]: (state, {payload}:any)=>({...state, select:payload})
}, initialState)

const loop = (item, handle) => {
  handle(item);
  item.children.forEach(child=> loop(child, handle));
}