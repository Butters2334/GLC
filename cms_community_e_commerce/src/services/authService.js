//实际登录接口发起
import axios from 'axios';
import {
  ADMIN_API
} from '../constants';
import { postData } from '../utils/postData';

const url = `${ADMIN_API}/user/login`

//实际登录鉴权的位置
const post = async (username, password) => {
  console.log(url)
  return await axios.post(url, postData({
    username: username,
    password: password
  }))
}

export default {
  post
}
