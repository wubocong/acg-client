import { followingType, Dispatch } from '../reducers/types';

export const SET_FOLLOWINGS = 'SET_FOLLOWINGS';

export function setFollowings(data: Array<followingType>) {
  return {
    type: SET_FOLLOWINGS,
    data
  };
}

