import { createAction, handleActions } from 'redux-actions';
import { FileType } from '../models/file';

const CHOICE_COMPONENT = 'elements/CHOICE_COMPONENT';
const ADD_ELEMENT = 'elements/ADD_ELEMENT';

export const choiceComponent = createAction(CHOICE_COMPONENT); // ref of component
export const addElement = createAction(ADD_ELEMENT);

const initialState = {
  component: {
    elements:{
      id:-1,
      tag:'',
      lib:'',
      prop:{
        name: '',
        style: '',
        for: ''
      },
      children: []
    }
  }
}

export default handleActions({
  [CHOICE_COMPONENT]: (state, {payload}:any) => {
    if (payload.type == FileType.FILE)  {
      if (payload.elements.id === undefined) {
        payload.elements = {
          id:0,
          tag:'root',
          children: []
        }
      }
      return {component:payload}
    } else 
      return {...state}
  },
  [ADD_ELEMENT]: (state, {payload})=> {
    return {
      ...state
    }
  }
}, initialState)