/**
 * 封装axios 新增头部添加authorization的方法
 */
import axios from 'axios';
// import { authorization } from './authorization';
import {
  postData,
  patchData
} from '@/utils';
// import qs from 'qs';

const post = ( token) => {
  return (url, data) => {
    return axios.create({
      headers: {
        // 'authorization': authorization( token)
        'token':token
      }
    }).post(url, postData(data))
  }
}

const patch = (token) => {
  return (url, data) => {
    return axios.create({
      headers: {
        // 'authorization': authorization( token),
        'token':token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).patch(url, patchData(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

const get = (token) => {
  return (url, params) => {
    return axios.create({
      headers: {
        // 'authorization': authorization( token)
        'token':token
      }
    }).get(url, {
      params
    })
  }
}

const remove = (token) => {
  return (url, params) => {
    return axios.create({
      headers: {
        // 'authorization': authorization( token)
        'token':token
      }
    }).delete(url)
  }
}

export default {
  post,
  patch,
  get,
  remove
}
