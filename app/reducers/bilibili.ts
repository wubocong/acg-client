import { AnyAction } from 'redux';
import { SET_FOLLOWINGS, SET_COOKIES } from '../actions/bilibili';
import { cookieType } from './types';

export default function bilibili(state = {}, action: AnyAction) {
  switch (action.type) {
    case SET_FOLLOWINGS:
      return { ...state, followings: action.data };
    case SET_COOKIES:
      return {
        ...state,
        cookies: action.data,
        userId: action.data.find(
          (cookie: cookieType) => cookie.name === 'DedeUserID'
        ).value
      };
    default:
      return state;
  }
}
