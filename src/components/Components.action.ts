import { createAction, handleActions } from 'redux-actions';
import { FileType } from '../models/file';

const CREATE_FILE = 'components/CREATE_FILE';
const DELETE_FILE = 'components/DELETE_FILE';
const SELECT_FILE = 'components/SELECT_FILE';
const COLLAPSE_FILE = 'components/COLLAPSE_FILE';

export const createFile = createAction(CREATE_FILE); // name, type
export const deleteFile = createAction(DELETE_FILE); // ref item in files
export const selectFile = createAction(SELECT_FILE); // ref item in files
export const collapseFile = createAction(COLLAPSE_FILE);

const initialState = {
    files:[],
    select:undefined
}

export default handleActions({
    [CREATE_FILE]: (state, {payload}:any) => {
        let maxId = 0;
        state.files.forEach(item=> loop(item, (target)=> {
            if (maxId < target.id) {
                maxId = target.id
            }
        }));
        const newFile = {
            id: maxId + 1,
            name:payload.name, 
            type:payload.type, 
            elements: {},
            collapse:false,
            parent: undefined,
            state:{},
            children:[]
        }
        if (state.select === undefined) {
            if (state.files.filter(item=> item.name == newFile.name).length == 0) {
                return {
                    ...state,
                    files: [...state.files, newFile]
                }
            }
        } else {
            if (state.select.type == FileType.FILE) {
                newFile.parent = state.select.parent;
                if (newFile.parent === undefined) {
                    return {
                        ...state,
                        files: [...state.files, newFile]
                    }
                } else if (newFile.parent.children.filter(item=> item.name == newFile.name).length == 0) {
                    newFile.parent.children.push(newFile)
                }
            } else if (state.select.type == FileType.FOLDER) {
                newFile.parent = state.select;
                if (state.select.children.filter(item=> item.name == newFile.name).length == 0) {
                    state.select.children.push(newFile)
                }
            }
        }
        return {
            ...state
        }
    },
    [SELECT_FILE]: (state, {payload}) => {
        return {
            ...state,
            select: payload
        }
    },
    [COLLAPSE_FILE]: (state, {payload}) => {
        state.files.forEach(item=> loop(item, target=> target.collapse = false))
        return {
            ...state
        }
    },
    [DELETE_FILE]: (state, {payload}:any) => {
        if (payload.parent) {
            let idx = undefined;
            payload.parent.children.forEach((item, i)=> {
                if (item.id === payload.id) idx = i;
            })
            if (idx !== undefined) 
                payload.children.splice(idx, 1);
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
}, initialState)

const loop = (item, handle) => {
    handle(item);
    item.children.forEach(child=> loop(child, handle));
}