import { createAction, handleActions } from 'redux-actions';

const SHOW_CONTEXT_MENU = 'layout/SHOW_CONTEXT_MENU';
const HIDE_CONTEXT_MENU = 'layout/HIDE_CONTEXT_MENU';

export const showContextMenu = createAction(SHOW_CONTEXT_MENU); // x, y, type, target
export const hideContextMenu = createAction(HIDE_CONTEXT_MENU);

const initialState = {
    contextMenu: {
        x:0,
        y:0,
        type:undefined,
        target:undefined,
        display:'none'
    }
}

export default handleActions({
  [SHOW_CONTEXT_MENU]: (state, {payload}:any) => {
      return {
          ...state,
          contextMenu: {
              x: payload.x,
              y: payload.y,
              type: payload.type,
              target: payload.target,
              display:'block'
          }
      }
  },
  [HIDE_CONTEXT_MENU]: (state, {payload}) => ({...state, contextMenu:{...state.contextMenu, display:'none'}})
}, initialState)