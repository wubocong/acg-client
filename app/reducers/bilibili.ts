import { AnyAction } from 'redux';
import { SET_FOLLOWINGS } from '../actions/bilibili';

export default function bilibili(state = {}, action: AnyAction) {
  switch (action.type) {
    case SET_FOLLOWINGS:
      return { ...state, followings: action.data };
    default:
      return state;
  }
}
