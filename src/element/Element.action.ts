import { createAction, handleActions } from 'redux-actions';
import Utils from '../utils/utils';
import { FileType, ElementType } from '../utils/constant';
import { ComponentItem } from '../component/Component.action';
import { PropertyItem } from '../property/Property.action';
import { pender } from 'redux-pender';
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

export type ElementState = {
  component: ComponentItem;
  hover?: ElementItem;
  select?: ElementItem;
  insert: {
    ing:boolean, 
    name:string, 
    type:ElementType
  };
  history: Array<ComponentItem>;
}

export type ElementItem = {
  id:number;
  tag:string;
  lib?:ElementType;
  prop:Array<PropertyItem>;
  children:Array<ElementItem>;
  collapse:boolean;
  parent?:ElementItem;
}


const initState:ElementState = {
  component: {
    id: -1,
    element:{
      id:-1,
      tag:'',
      lib:undefined,
      prop:[],
      children: [],
      collapse: true
    },
    state: '{}',
    type: FileType.ROOT,
    collapse: false,
    children: [],
    name: ''
  },
  hover: undefined,
  select:undefined,
  insert: {
    ing: false,
    name: '',
    type: undefined
  },
  history: [] 
}

export const ElementAction = {
  choiceComponent:(comp:ComponentItem) => Promise.resolve(comp),
  readyToAdd:(type:ElementType) => Promise.resolve(type),
  updateName:(name:string) => Promise.resolve(name),
  updateState:(state:string) => Promise.resolve(state),
  completeAdd:() => Promise.resolve(),
  deleteElement:(elem:ElementItem) => Promise.resolve(elem), 
  selectElement:(elem:ElementItem) => Promise.resolve(elem),
  deleteHistory:(id:number) => Promise.resolve(id),
  hoverElement:(elem:ElementItem) => Promise.resolve(elem),
  collapseElement:(elem:ElementItem) => Promise.resolve(elem),
  dragAndDropElement:(from:ElementItem, to:ElementItem, sibling: boolean) => Promise.resolve({from, to, sibling}),
  clearElement:() => Promise.resolve()
}

export const elementActions = {
  choiceComponent: createAction(CHOICE_COMPONENT, ElementAction.choiceComponent),
  readyToAdd: createAction(READY_TO_ADD, ElementAction.readyToAdd),
  updateName: createAction(UPDATE_NAME, ElementAction.updateName),
  updateState: createAction(UPDATE_STATE, ElementAction.updateState),
  completeAdd: createAction(COMPLETE_ADD, ElementAction.completeAdd), 
  deleteElement: createAction(DELETE_ELEMENT, ElementAction.deleteElement),
  selectElement: createAction(SELECT_ELEMENT, ElementAction.selectElement),
  deleteHistory: createAction(DELETE_HISTORY, ElementAction.deleteHistory),
  hoverElement: createAction(HOVER_ELEMENT, ElementAction.hoverElement),
  collapseElement: createAction(COLLAPSE_ELEMENT, ElementAction.collapseElement),
  dragAndDropElement: createAction(DRAG_AND_DROP_ELEMENT, ElementAction.dragAndDropElement),
  clearElement: createAction(CLEAR_ELEMENT, ElementAction.clearElement)
}


export default handleActions({
  ...pender({
    type:CHOICE_COMPONENT,
    onSuccess:(state:ElementState, {payload}) => {
      if (payload.type === FileType.FILE)  {
        if (payload.element === undefined || payload.element.id === undefined) {
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
    }
  }),
  ...pender({
    type:READY_TO_ADD,
    onSuccess:(state:ElementState, {payload}) => {
      return {
        ...state,
        insert: {
          ing:true,
          type:payload,
          name:''
        }
      }
    }
  }),
  ...pender({
    type:UPDATE_NAME,
    onSuccess:(state:ElementState, {payload}) => ({...state, insert:{...state.insert, name:payload}}),
  }),
  ...pender({
    type:UPDATE_STATE,
    onSuccess:(state:ElementState, {payload}) => {
      state.component.state = payload;
      return {...state}
    }
  }),
  ...pender({
    type:COMPLETE_ADD,
    onSuccess:(state:ElementState, {payload}) => {
      if (state.insert.name !== '' ) {
        let maxId = 0;
        Utils.loop(state.component.element, (target)=> {
          if (maxId < target.id) {
            maxId = target.id
          }
        })
        const newElem:ElementItem = {
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
    }
  }),
  ...pender({
    type:DELETE_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => {
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
    }
  }),
  ...pender({
    type:SELECT_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => ({...state, select:payload}),
  }),
  ...pender({
    type:DELETE_HISTORY,
    onSuccess:(state:ElementState, {payload}) => {
      let idx = undefined;
      state.history.forEach((component, i)=> {
        if (component.id === payload) idx = i;
      })
      if (idx !== undefined) {
        state.history.splice(idx, 1)
        if (state.component.id === payload) {
          if (state.history.length === 0) {
            state.component = _.clone(initState.component)
          } else {
            state.component = state.history[state.history.length-1]
          }
        }
      }
      return {...state}
    }
  }),
  ...pender({
    type:HOVER_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => ({...state, hover: payload}),
  }),
  ...pender({
    type:COLLAPSE_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => {
      payload.collapse = !payload.collapse
      return {...state}
    }
  }),
  ...pender({
    type:DRAG_AND_DROP_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => {
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
    }
  }),
  ...pender({
    type:CLEAR_ELEMENT,
    onSuccess:(state:ElementState, {payload}) => ({
      component: {
        id: -1,
        element:{
          id:-1,
          tag:'',
          lib:undefined,
          prop:[],
          children: [],
          collapse: true
        },
        state: '{}',
        type: FileType.ROOT,
        collapse: false,
        children: [],
        name: ''
      },
      hover: undefined,
      select:undefined,
      insert: {
        ing: false,
        name: '',
        type: undefined
      },
      history: [] 
    })
  }),
}, initState)
