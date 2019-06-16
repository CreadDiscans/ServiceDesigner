import { createAction, handleActions } from 'redux-actions';
import { FrameType } from '../utils/constant';

const SHOW_CONTEXT_MENU = 'layout/SHOW_CONTEXT_MENU';
const HIDE_CONTEXT_MENU = 'layout/HIDE_CONTEXT_MENU';
const SET_FRAME_TYPE = 'layout/SET_FRAME_TYPE';
const MESSAGE = 'layout/MESSAGE';

export const showContextMenu = createAction(SHOW_CONTEXT_MENU); // x, y, type, target
export const hideContextMenu = createAction(HIDE_CONTEXT_MENU);
export const setFrameType = createAction(SET_FRAME_TYPE); // frame type
export const message = createAction(MESSAGE);   // background, color, text

const initialState = {
    frameType: FrameType.Browser,
    contextMenu: {
        x:0,
        y:0,
        type:undefined,
        target:undefined,
        display:'none'
    },
    message: {
        background: undefined,
        color: undefined,
        text: ''
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
  [HIDE_CONTEXT_MENU]: (state, {payload}) => ({...state, contextMenu:{...state.contextMenu, display:'none'}}),
  [SET_FRAME_TYPE]: (state, {payload}:any) => ({...state, frameType: payload}),
  [MESSAGE]: (state, {payload}:any) => ({...state, message:{
      background:payload.background,
      color:payload.color,
      text: payload.text
    }})
}, initialState)