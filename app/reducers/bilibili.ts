import { AnyAction } from 'redux';
import { SET_FOLLOWINGS } from '../actions/bilibili';

export default function bilibili(state = {}, action: AnyAction) {
  switch (action.type) {
    case SET_FOLLOWINGS: {
      state.followings = action.data;
      return state;
    }
    default:
      return state;
  }
}
