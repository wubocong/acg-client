import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

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

export type cookieType = {
  url: string;
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  expirationDate: number;
};

export type bilibiliStateType = {
  followings?: followingType[];
  cookies?: cookieType[];
  userId?: string;
};

export type rootStateType = {
  bilibili: bilibiliStateType;
};

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<rootStateType, Action<string>>;
