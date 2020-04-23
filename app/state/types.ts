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

export interface Stores {
  [index: string]: {};
}
