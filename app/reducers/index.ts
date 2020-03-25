import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import bilibili from './bilibili';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    bilibili
  });
}
