import { createAction, handleActions } from 'redux-actions';
import { FrameType, ContextMenuType } from '../utils/constant';
import { ElementItem } from '../element/Element.action';
import { ComponentItem } from '../component/Component.action';
import { pender } from 'redux-pender/lib/utils';
import { PropertyItem } from '../property/Property.action';

const SHOW_CONTEXT_MENU = 'layout/SHOW_CONTEXT_MENU';
const HIDE_CONTEXT_MENU = 'layout/HIDE_CONTEXT_MENU';
const SET_FRAME_TYPE = 'layout/SET_FRAME_TYPE';
const MESSAGE = 'layout/MESSAGE';
const MESSAGE_RELEASE = 'layout/MESSAGE_RELEASE';
const RENDERING = 'layout/RENDERING';

export type LayoutState = {
    frameType: FrameType;
    contextMenu: {
        x:number;
        y:number;
        type:ContextMenuType;
        target:ElementItem|ComponentItem|PropertyItem;
        display:string;
    },
    message: {
        background: string;
        color: string;
        text:string;
    },
    rendering: boolean;
}

const initState:LayoutState = {
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
    },
    rendering: false
}

export const LayoutAction = {
    showContextMenu: (x:number, y:number, type: ContextMenuType, target:ElementItem|ComponentItem)=> Promise.resolve({x, y, type, target}),
    hideContextMenu: () => Promise.resolve(),
    setFrameType: (frameType: FrameType) => Promise.resolve({frameType}),
    message: (background:string, color:string, text: string) => Promise.resolve({background, color, text}),
    messageRelease: ()=> Promise.resolve(),
    rendering: (val:boolean) => Promise.resolve(val)
}

export const layoutActions = {
    showContextMenu: createAction(SHOW_CONTEXT_MENU, LayoutAction.showContextMenu),
    hideContextMenu: createAction(HIDE_CONTEXT_MENU, LayoutAction.hideContextMenu),
    setFrameType: createAction(SET_FRAME_TYPE, LayoutAction.setFrameType),
    message: createAction(MESSAGE, LayoutAction.message),
    messageRelease: createAction(MESSAGE_RELEASE, LayoutAction.messageRelease),
    rendering: createAction(RENDERING, LayoutAction.rendering),
}

export default handleActions({
    ...pender({
        type: SHOW_CONTEXT_MENU,
        onSuccess: (state:LayoutState, {payload}) =>{
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
        }
    }),
    ...pender({
        type: HIDE_CONTEXT_MENU,
        onSuccess: (state:LayoutState, {payload}) => ({...state, contextMenu:{...state.contextMenu, display:'none'}}),
    }),
    ...pender({
        type: SET_FRAME_TYPE,
        onSuccess: (state:LayoutState, {payload}) => ({...state, frameType: payload}),
    }),
    ...pender({
        type: MESSAGE,
        onSuccess: (state:LayoutState, {payload}) => ({...state, message:{
            background:payload.background,
            color:payload.color,
            text: payload.text
        }}),
    }),
    ...pender({
        type: MESSAGE_RELEASE,
        onSuccess: (state:LayoutState, {payload}) => ({...state, message: {
            background: undefined,
            color: undefined,
            text: ''
        }}),
    }),
    ...pender({
        type: RENDERING,
        onSuccess: (state:LayoutState, {payload}) => ({...state, rendering: payload})
    })
}, initState)