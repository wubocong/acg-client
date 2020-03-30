import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type bilibiliStateType = {
  followings: followingType[];
};

export type rootStateType = {
  bilibili: bilibiliStateType;
};

export type followingType = {
  mid: number;
  attribute: number;
  mtime: number;
  tag: string | null;
  special: number;
  uname: string;
  face: string;
  sign: string;
  official_verify: { type: number; desc: string };
  vip: object;
};

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<rootStateType, Action<string>>;
