import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';
import Utils from '../utils/utils';
import { FileType, ElementType } from '../utils/constant';
import { ElementItem } from '../element/Element.action';
import { pender } from 'redux-pender';

const CREATE_FILE = 'component/CREATE_FILE';
const DELETE_FILE = 'component/DELETE_FILE';
const SELECT_FILE = 'component/SELECT_FILE';
const COLLAPSE_FILE = 'component/COLLAPSE_FILE';
const UPDATE_NAME = 'component/UPDATE_NAME';
const READY_TO_CREATE = 'component/READY_TO_CREATE';
const READY_TO_CREATE_BY_MENU = 'component/READY_TO_CREATE_BY_MENU';
const READY_TO_RENAME = 'component/READY_TO_RENAME';
const RESET = 'component/RESET';
const RESET_FOCUS = 'component/RESET_FOCUS';
const LOAD_COMPONENT = 'component/LOAD_COMPONENT';
const DRAG_AND_DROP_ELEMENT = 'component/DRAG_AND_DROP_COMPONENT';

export type ComponentState = {
    files:Array<ComponentItem>;
    select?: ComponentItem;
    name: string;
    create: boolean;
    type?: FileType;
    focus?: string;
    rename: number;
}

export type ComponentItem = {
    id: number,
    name: string, 
    type: FileType, 
    element: ElementItem,
    collapse: boolean,
    parent?: ComponentItem,
    state: string,
    children: Array<ComponentItem>,
}

const initState:ComponentState = {
    files:[],
    select:undefined,
    name:'',
    create: false, 
    type: undefined, 
    focus:undefined, 
    rename: 0
}

export const ComponentAction = {
    createFile: (name:string, type: FileType) => Promise.resolve({name, type}),
    deleteFile: (comp:ComponentItem) => Promise.resolve(comp),
    selectFile: (comp:ComponentItem) => Promise.resolve(comp),
    collapseFile: () => Promise.resolve(),
    updateName: (name:string) => Promise.resolve(name),
    readyToCreate: (create:boolean, type:FileType, focus:string) => Promise.resolve({create, type, focus}),
    readyToCreateByMenu: (create:boolean, type:FileType, focus:string, select:ComponentItem) => Promise.resolve({create, type, focus, select}),
    readyToRename: (name:string, focus:string, types:FileType, rename:number) => Promise.resolve({name, create:true, focus, types, rename}),
    reset: () => Promise.resolve(),
    resetFocus: () => Promise.resolve(),
    loadComponent: (comps: Array<ComponentItem>) => Promise.resolve(comps),
    dragAndDropComponent: (from:ComponentItem, to:ComponentItem) => Promise.resolve({from, to})
}

export const componentActions = {
    createFile: createAction(CREATE_FILE, ComponentAction.createFile),
    deleteFile: createAction(DELETE_FILE, ComponentAction.deleteFile),
    selectFile: createAction(SELECT_FILE, ComponentAction.selectFile),
    collapseFile: createAction(COLLAPSE_FILE, ComponentAction.collapseFile),
    updateName: createAction(UPDATE_NAME, ComponentAction.updateName),
    readyToCreate: createAction(READY_TO_CREATE, ComponentAction.readyToCreate),
    readyToCreateByMenu: createAction(READY_TO_CREATE_BY_MENU, ComponentAction.readyToCreateByMenu),
    readyToRename: createAction(READY_TO_RENAME, ComponentAction.readyToRename),
    reset: createAction(RESET, ComponentAction.reset),
    resetFocus: createAction(RESET_FOCUS, ComponentAction.resetFocus),
    loadComponent: createAction(LOAD_COMPONENT, ComponentAction.loadComponent),
    dragAndDropComponent: createAction(DRAG_AND_DROP_ELEMENT, ComponentAction.dragAndDropComponent),
}

export default handleActions({
    ...pender({
        type:CREATE_FILE,
        onSuccess: (state: ComponentState, {payload}) => {
            let maxId = 0;
            state.files.forEach(item=> Utils.loop(item, (target)=> {
                if (maxId < target.id) {
                    maxId = target.id
                }
            }));
            const newFile:ComponentItem = {
                id: maxId + 1,
                name:payload.name, 
                type:payload.type, 
                element: undefined,
                collapse:false,
                parent: undefined,
                state:'{}',
                children:[]
            }
            if (state.select === undefined) {
                if (state.files.filter(item=> item.name === newFile.name).length === 0) {
                    return {
                        ...state,
                        files: [...state.files, newFile]
                    }
                }
            } else {
                if (state.select.type === FileType.FILE) {
                    newFile.parent = state.select.parent;
                    if (newFile.parent === undefined) {
                        return {
                            ...state,
                            files: [...state.files, newFile]
                        }
                    } else if (newFile.parent.children.filter(item=> item.name === newFile.name).length === 0) {
                        newFile.parent.children.push(newFile)
                    }
                } else if (state.select.type === FileType.FOLDER) {
                    newFile.parent = state.select;
                    if (state.select.children.filter(item=> item.name === newFile.name).length === 0) {
                        state.select.children.push(newFile)
                    }
                }
            }
            return {
                ...state
            }
        }
    }),
    ...pender({
        type: SELECT_FILE,
        onSuccess:(state:ComponentState, {payload}) => ({
            ...state,
            select: payload
        })
    }),
    ...pender({
        type:COLLAPSE_FILE,
        onSuccess:(state:ComponentState, {payload}) => {
            state.files.forEach(item=> Utils.loop(item, target=> target.collapse = false))
            return {
                ...state
            }
        }
    }),
    ...pender({
        type: DELETE_FILE,
        onSuccess:(state:ComponentState, {payload}) => {
            if (payload.parent) {
                let idx = undefined;
                payload.parent.children.forEach((item, i)=> {
                    if (item.id === payload.id) idx = i;
                })
                if (idx !== undefined) 
                    payload.parent.children.splice(idx, 1);
            } else {
                let idx = undefined;
                state.files.forEach((item, i)=> {
                    if (item.id === payload.id) idx = i; 
                })
                if (idx !== undefined) 
                    state.files.splice(idx, 1);
            }
            return {
                ...state
            }
        }
    }),
    ...pender({
        type: UPDATE_NAME,
        onSuccess: (state:ComponentState, {payload}) => ({...state, name:payload})
    }),
    ...pender({
        type: READY_TO_CREATE,
        onSuccess: (state:ComponentState, {payload}) => ({...state, create:payload.create, type: payload.type, focus:payload.focus})
    }),
    ...pender({
        type: READY_TO_CREATE_BY_MENU,
        onSuccess: (state:ComponentState, {payload}) => ({...state, create:payload.create, type: payload.type, focus:payload.focus, select:payload.select}),
    }),
    ...pender({
        type: READY_TO_RENAME,
        onSuccess: (state:ComponentState, {payload}) => ({...state, create:payload.create, type: payload.type, focus:payload.focus, name:payload.name, rename:payload.rename}),
    }),
    ...pender({
        type: RESET,
        onSuccess: (state:ComponentState, {payload}) => ({...state, create:false, type:undefined, focus:undefined, rename:0, name:''}),
    }),
    ...pender({
        type: RESET_FOCUS,
        onSuccess: (state:ComponentState, {payload}) => ({...state,focus:undefined}),
    }),
    ...pender({
        type: LOAD_COMPONENT,
        onSuccess: (state:ComponentState, {payload}) => {
            payload.forEach(comp=> {
                Utils.loop(comp, (item, stack)=> {
                    item.parent = _.last(stack)
                    if (item.type === FileType.FILE) {
                        Utils.loop(item.element, (elem, stack)=> {
                            if (elem.lib === 'reactnative') elem.lib = ElementType.ReactNative
                            else if (elem.lib === 'reactstrap') elem.lib = ElementType.Reactstrap
                            elem.parent = _.last(stack)
                        })
                    }
                })
            })
            return {
                ...state,
                files: payload
            }
        },
    }),
    ...pender({
        type: DRAG_AND_DROP_ELEMENT,
        onSuccess: (state:ComponentState, {payload})=> {
            if (payload.to === undefined) {
              if (payload.from.parent) {
                  payload.from.parent.children = payload.from.parent.children
                      .filter(item=> item.id !== payload.from.id)
                  payload.from.parent = undefined;
                  state.files.push(payload.from);
              }
              return {...state}
            } else {
              let valid = true;
              Utils.loop(payload.from, (item)=> {
                  if (item.id === payload.to.id) {
                      valid = false
                  }
              })
              if (!valid) {
                  return {...state}
              }
              if (payload.from.parent) {
                  payload.from.parent.children = payload.from.parent.children
                      .filter(item=> item.id !== payload.from.id)
              } else {
                  state.files = state.files
                      .filter(item=> item.id !== payload.from.id)
              }
              payload.to.children.push(payload.from);
              payload.from.parent = payload.to;
            }
            return {...state}
          },
    })
}, initState)