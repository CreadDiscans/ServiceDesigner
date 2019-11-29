import { createAction, handleActions } from 'redux-actions';
import Utils from '../utils/utils';
import { FileType } from '../utils/constant';
import _ from 'lodash';

const CHOICE_COMPONENT = 'element/CHOICE_COMPONENT';
const READY_TO_ADD = 'element/READY_TO_ADD';
const UPDATE_NAME = 'element/UPDATE_NAME';
const UPDATE_STATE = 'element/UPDATE_STATE';
const COMPLETE_ADD = 'element/COMPLETE_ADD';
const DELETE_ELEMENT = 'element/DELETE_ELEMENT';
const SELECT_ELEMENT = 'element/SELECT_ELEMENT';
const DELETE_HISTORY = 'element/DELETE_HISTORY';
const HOVER_ELEMENT = 'element/HOVER_ELEMENT';
const COLLAPSE_ELEMENT = 'element/COLLAPSE_ELEMENT';
const DRAG_AND_DROP_ELEMENT = 'element/DRAG_AND_DROP_ELEMENT';
const CLEAR_ELEMENT = 'element/CLEAR_ELEMENT';
const COPY_ELEMENT = 'element/COPY_ELEMENT';
const PASTE_ELEMENT = 'element/PASTE_ELEMENT';

export const choiceComponent = createAction(CHOICE_COMPONENT); // ref of component
export const readyToAdd = createAction(READY_TO_ADD); // type
export const updateName = createAction(UPDATE_NAME); // name
export const updateState = createAction(UPDATE_STATE); // state
export const completeAdd = createAction(COMPLETE_ADD); 
export const deleteElement = createAction(DELETE_ELEMENT); // element 
export const selectElement = createAction(SELECT_ELEMENT); // element
export const deleteHistory = createAction(DELETE_HISTORY); // id of element
export const hoverElement = createAction(HOVER_ELEMENT); // element
export const collapseElement = createAction(COLLAPSE_ELEMENT) // element
export const dragAndDropElement = createAction(DRAG_AND_DROP_ELEMENT) // from, to, sibling
export const clearElement = createAction(CLEAR_ELEMENT);
export const copyElement = createAction(COPY_ELEMENT); // target elem
export const pasteElement = createAction(PASTE_ELEMENT); // parent elem

const initialState = {
  component: {
    id: -1,
    element:{
      id:-1,
      tag:'',
      lib:'',
      prop:[],
      children: [],
      collapse: true
    },
    state: '{}'
  },
  hover: undefined,
  select:undefined,
  insert: {
    ing: false,
    name: '',
    type: ''
  },
  history: [],
  copiedElement: undefined
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
  [UPDATE_STATE]: (state, {payload}:any)=> {
    state.component.state = payload;
    return {...state}
  },
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
        children: [],
        collapse: true
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
  [HOVER_ELEMENT]: (state, {payload}:any)=> ({...state, hover: payload}),
  [COLLAPSE_ELEMENT]: (state, {payload}:any)=> {
    payload.collapse = !payload.collapse
    return {...state}
  },
  [DRAG_AND_DROP_ELEMENT]: (state, {payload}:any)=> {
    if (payload.to === undefined) {
      payload.to = state.component.element
    }
    let valid = true;
    Utils.loop(payload.from, (item)=> {
      if (item.id === payload.to.id) {
        valid = false
      }
    })
    if (!valid) {
      return {...state}
    }
    payload.from.parent.children.splice(
      payload.from.parent.children
        .map((elem, i)=>({id:elem.id, idx:i}))
        .filter(obj=> obj.id === payload.from.id)
        .map(obj=> obj.idx)[0], 1
    )
    if (payload.sibling) {
      payload.to.parent.children.splice(
        payload.to.parent.children
          .map((elem, i)=>({id:elem.id, idx:i}))
          .filter(obj=> obj.id === payload.to.id)
          .map(obj=> obj.idx)[0], 0, payload.from)
      payload.from.parent = payload.to.parent;
    } else {
      payload.to.children.push(payload.from)
      payload.from.parent = payload.to;
    }
    return {...state}
  },
  [CLEAR_ELEMENT]: (state, {payload}) => ({
    component: {
      id: -1,
      element:{
        id:-1,
        tag:'',
        lib:'',
        prop:[],
        children: [],
        collapse: true
      },
      state: '{}'
    },
    hover: undefined,
    select:undefined,
    insert: {
      ing: false,
      name: '',
      type: ''
    },
    history: [],
    copiedElement: undefined }),
  [COPY_ELEMENT]: (state, {payload}:any) => ({...state, copiedElement: payload}),
  [PASTE_ELEMENT]: (state, {payload}:any) => {
    let parent;
    if(payload === undefined) {
      parent = state.component.element
    } else {
      parent = payload;
    }
    let maxId = 0;
    loop(state.component.element, (target)=> {
      if (maxId < target.id) {
        maxId = target.id
      }
    })
    
    let item = _.clone(state.copiedElement)
    loop(item, (_item)=> {
      delete _item.parent;
    })
    item = Utils.deepcopy(item);
    loop(item, (_item)=> {
      _item.id = maxId +1;
      maxId += 1;
    })
    item.parent = parent;

    Utils.loop(item, (_item, _stack)=> {
      if (_stack.length != 0) {
        _item.parent = _stack[_stack.length-1]
      }
    })
    parent.children.push(item);
    return {
      ...state
    }
  }
}, initialState)

const loop = (item, handle) => {
  handle(item);
  item.children.forEach(child=> loop(child, handle));
}