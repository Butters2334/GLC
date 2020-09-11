//主要控制位置


// export const ADMIN_API = 'https://www.xinglinlmc.cn/v1';
//export const ADMIN_API = 'http://122.51.169.187:8001/v1';
export const ADMIN_API = 'http://127.0.0.1:8000/v1';
// export const ADMIN_API = 'http://192.168.31.237:8000/v1';
export const USER_API = ADMIN_API;
export const WEBSITE_NAME = '小橙后台';
export const AUTHOR = 'mahuajian@gmail.com';
export const COMPANY = '小橙科技'
export const USERNAME = 'username';
export const PASSWORD = 'password';
export const USER_TOKEN = 'user_token';
export const USER_USERTYPE = 'user_username';
export const AUTHORIZATION = 'authorization';
export const DEFAULT_PAGE = 1;
export const DEFAULT_ROWS = 10;
/**
  * 订单待发货状态
  */
export const ORDER_WAIT = 0;
/**
  * 订单配送中状态
  */
export const ORDER_DISPATCHING = 1;
/**
  * 订单确认送达状态
  */
export const ORDER_FINISH = 2;
/**
  * 订单退款中状态
  */
export const ORDER_REFUNDING = 3;
/**
  * 订单退款完成
  */
export const ORDER_REFUND_SUCCESS = -1;
/**
  * 订单退款失败
  */
export const ORDER_REFUNDING_FAILURE = -2;
