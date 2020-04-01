import { followingType, cookieType, Dispatch } from '../reducers/types';

export const SET_FOLLOWINGS = 'SET_FOLLOWINGS';
export const SET_COOKIES = 'SET_COOKIES';

export function setFollowings(data: Array<followingType>) {
  return {
    type: SET_FOLLOWINGS,
    data
  };
}

export function setCookies(data: Array<cookieType>) {
  return {
    type: SET_COOKIES,
    data
  };
}
