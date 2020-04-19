import fetch from 'node-fetch';
import { followingType, cookieType, Dispatch } from '../reducers/types';

export const SET_FOLLOWINGS = 'SET_FOLLOWINGS';
export const SET_COOKIES = 'SET_COOKIES';

export function setFollowings(data: Array<followingType>) {
  return {
    type: SET_FOLLOWINGS,
    data
  };
}

export function setFollowingsAsync(userId: string) {
  return (dispatch: Dispatch) =>
    fetch(`https://api.bilibili.com/x/relation/followings?vmid=${userId}`)
      .then(res => res.json())
      .then(json => {
        const followings = json?.data?.list;
        return dispatch(setFollowings(followings));
      });
}

export function setCookies(data: Array<cookieType>) {
  return {
    type: SET_COOKIES,
    data
  };
}
