import {
  ADMIN_API, ORDER_DISPATCHING, ORDER_FINISH, ORDER_REFUND_SUCCESS, ORDER_REFUNDING_FAILURE
} from '../constants';
import rest from '../utils/rest';
import axios from 'axios';
import * as utils from '../utils';
import {
    USER_USERTYPE,
    USER_TOKEN
  } from '../constants';
  

const DEFAULT_PARAMS = {
  status: null,
  start: null,
  end: null,
  page: 1,
  rows: 10
}

const admin_url =  `${ADMIN_API}/order`

// const userType = parseInt(utils.getStorage(USER_USERTYPE), 10)
// const token = utils.getStorage(USER_TOKEN)

const get_token = function(){
    return utils.getStorage(USER_TOKEN)
}

const all = async function (page_index,page_size) {
    var url = `${admin_url}/get_list`
    console.log(url+"\n"+get_token())
    return await axios.post(url, {"page_index":page_index,"page_size":page_size,"token":get_token()})
}

const statistics = async function ( token) {
  return await rest.post( token)(
    `${ADMIN_API}/order/find`
  )
}

const update = async function ( token, orderId, status) {
  if (status === ORDER_DISPATCHING) {
    return await deliver( token, orderId)
  } else if (status === ORDER_FINISH) {
    return await confirm( token, orderId)
  } else if (status === ORDER_REFUND_SUCCESS) {
    return await acceptRefund( token, orderId)
  } else if (status === ORDER_REFUNDING_FAILURE) {
    return await refuseRefund( token, orderId)
  } else {
    return null;
  }
}

/**
 * 发货
 * @param {*} adminId
 * @param {*} token
 * @param {*} orderId
 */
const deliver = async function ( token, orderId) {
  return await rest.patch( token)(
    `${admin_url}/${orderId}/deliver`
  )
}

const confirm = async function ( token, orderId) {
  return await rest.patch( token)(
    `${admin_url}/${orderId}/confirm`
  )
}

const acceptRefund = async function ( token, orderId) {
  return await rest.remove( token)(
    `${admin_url}/${orderId}/refund`
  )
}

const refuseRefund = async function ( token, orderId) {
  return await rest.patch( token)(
    `${admin_url}/${orderId}/refuse`
  )
}

export default {
  all,
  statistics,
  update
}
