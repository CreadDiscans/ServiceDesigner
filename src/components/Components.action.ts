import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';

const CREATE_FILE = 'components/CREATE_FILE';
const DELETE_FILE = 'components/DELETE_FILE';
const SELECT_FILE = 'components/SELECT_FILE';

export const createFile = createAction(CREATE_FILE);
export const deleteFile = createAction(DELETE_FILE);
export const selectFile = createAction(SELECT_FILE);


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
            collapse:false,
            children:[]
        }
        if (state.select === undefined) {
            return {
                ...state,
                files: [...state.files, newFile]
            }
        } else {
            state.select.children.push(newFile)
            return {
                ...state
            }
        }
    },
    [SELECT_FILE]: (state, {payload}) => {
        return {
            ...state,
            select: payload
        }
    }
}, initialState)

const loop = (item, handle) => {
    handle(item);
    item.children.forEach(child=> loop(child, handle));
}