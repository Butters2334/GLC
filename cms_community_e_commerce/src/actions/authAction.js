import {
    FETCH_TOKEN,
  SET_CURRENT_USER,
  AUTH_ERROR
} from './types';
import {
  USER_USERTYPE,
  USER_TOKEN
} from '../constants';
import * as utils from '../utils';
import authService from '../services/authService';
import {
    message
  } from 'antd';
  
function fetchToken() {
  return {
    type: FETCH_TOKEN
  }
}

function setCurrentUser(admin) {
  return {
    type: SET_CURRENT_USER,
    admin
  }
}

function authError(errorMessage,errorCode) {
    message.destroy()
    message.warning(errorMessage)
    console.log(`authError ${errorMessage} ${errorCode}`)
    if(errorCode === 507 || errorCode===undefined)
    {
        utils.removeStorage(USER_USERTYPE)
        utils.removeStorage(USER_TOKEN)
        return {
            type: AUTH_ERROR,
            payload: errorMessage
        }
    }else{
        return {
            type: "NO EVENT",
            payload: errorMessage
        }
    }
}

function signin(username, password) {
  return async (dispatch) => {
    try {
        dispatch(fetchToken())
        const res = await authService.post(username, password)
        //console.log('res - '+JSON.stringify(res))
        console.log("login - result "+JSON.stringify(res.data))
        if (res.status === 200 && res.data.requestStatus === 200) {
            const token = res.data.result.user_token
            const user_type = res.data.result.user_type

            utils.setStorage(USER_TOKEN, token)
            utils.setStorage(USER_USERTYPE, user_type)
            // utils.setStorage(USER_USERTYPE, user_type)
            return dispatch(setCurrentUser({
                user_type,
                token
            }))
        }else{
            return dispatch(authError(res.data.message))
        }
    } catch (err) {
        console.log(err)
        var errorMessage = err.message
        if (errorMessage === undefined) {
            errorMessage = '服务器错误，请稍后再试'
        }
        console.log('errorMessage - '+errorMessage)
        return dispatch(authError(errorMessage))
    }
  }
}


function signout() {
  return dispatch => {
    utils.removeStorage(USER_USERTYPE)
    utils.removeStorage(USER_TOKEN)
    dispatch(setCurrentUser({}))
  }
}

export {
  setCurrentUser,
  authError,
  signin,
  signout
}
