import { createStore, applyMiddleware, compose } from 'redux';

import {  rootReducer }  from './Reducers';
import penderMiddleware from 'redux-pender/lib/middleware';

declare var window:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

const configureStore = (initialState:any) => {
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(penderMiddleware())
  ));
  
  return store;
}

export default configureStore