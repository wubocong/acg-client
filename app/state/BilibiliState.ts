import { observable, action, computed } from 'mobx';
import { cookieType, followingType } from './types';

export default class BilibiliState {
  @observable followings: followingType[] = [];

  @observable cookies: cookieType[] = [];

  @observable userId = '';
  // @computed get userId() {
  //   return this.cookies.find(
  //     (cookie: cookieType) => cookie.name === 'DedeUserID'
  //   )?.value;
  // }

  @action
  setFollowings = (userId: string) => {
    fetch(`https://api.bilibili.com/x/relation/followings?vmid=${userId}`)
      .then(res => res.json())
      .then(json => {
        this.followings = json?.data?.list;
        return true;
      })
      .catch(err => {
        console.error(err);
      });
  };

  @action
  setCookies = (data: cookieType[]) => {
    this.cookies = data;
    this.userId =
      data.find((cookie: cookieType) => cookie.name === 'DedeUserID')?.value ||
      '';
  };
}
