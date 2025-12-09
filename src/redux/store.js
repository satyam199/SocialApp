import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import productsReducer from './productsSlice';

const rootReducer = combineReducers({
  products: productsReducer,
});

export default createStore(rootReducer, applyMiddleware(thunk));
