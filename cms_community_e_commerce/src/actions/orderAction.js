import {
  LOAD_ORDERS,
  RECEIVE_ORDERS,
  STATISTICS_ORDER,
  ORDER_SERVICE_START,
  ORDER_SERVICE_END
} from './types';
import {
  authError
} from './index';
import orderService from '../services/orderService';

function loadOrders() {
  return {
    type: LOAD_ORDERS
  }
}

// function receiveOrders(data) {
//   return {
//     type: RECEIVE_ORDERS,
//     payload: data
//   }
// }

function statisticsOrder(data) {
  return {
    type: STATISTICS_ORDER,
    payload: data
  }
}

function orderServiceStart() {
  return {
    type: ORDER_SERVICE_START
  }
}

function orderServiceEnd() {
  return {
    type: ORDER_SERVICE_END
  }
}

function getAllOrders(page_index,page_size) {
    return async dispatch => {
    try {
        dispatch(loadOrders())
        const res = await orderService.all(page_index,page_size)
        //console.log("login - result "+JSON.stringify(res.data))
        if (res.status === 200 && res.data.requestStatus === 200) {
            const list = res.data.result.list
            const all_page = res.data.result.all_page
            return dispatch({
                type: RECEIVE_ORDERS,
                list: list,
                all_page:all_page
              })
        }else{
            return dispatch(authError(res.data.message,res.data.requestStatus))
        }
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = '服务器错误，请稍后再试'
        return dispatch(authError(errorMessage))
      }
      if (err.response.status === 401) {
        const errorMessage = '您的登录已过期，请重新登录'
        return dispatch(authError(errorMessage))
      }
    }
  }
}

function statistics(token) {
  return async dispatch => {
    try {
    //   const res = await orderService.statistics(token)
    //   const data = res.data.data
    //   return dispatch(statisticsOrder(data))
    } catch (err) {
    //   if (err.response === undefined) {
    //     const errorMessage = '服务器错误，请稍后再试'
    //     return dispatch(authError(errorMessage))
    //   }
    }
  }
}

function updateOrderStatus( token, orderId, status) {
  return async dispatch => {
    try {
      dispatch(orderServiceStart())
      const res = await orderService.update( token, orderId, status)
      return dispatch(orderServiceEnd())
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = '服务器错误，请稍后再试'
        return dispatch(authError(errorMessage))
      }
    }
  }
}

export {
  getAllOrders,
  statistics,
  updateOrderStatus
}
