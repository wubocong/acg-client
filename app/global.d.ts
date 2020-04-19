declare namespace NodeJS {
  export interface Global {
    sharedObject: {
      bilibiliId?: number;
      mainId?: number;
    };
  }
}
