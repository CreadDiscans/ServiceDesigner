import { createAction, handleActions } from 'redux-actions';

const ADD_ELEMENT = 'elements/ADD_ELEMENT';

export const addElement = createAction(ADD_ELEMENT);

const initialState = {

}

export default handleActions({
  [ADD_ELEMENT]: (state, {payload})=> {
    return {
      ...state
    }
  }
}, initialState)