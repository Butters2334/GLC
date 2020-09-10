import {
  ADMIN_API
} from '../constants';
import {
  rest
} from '../utils';

const URL = `${ADMIN_API}/admins`;

const DEFAULT_POST = {
  userName: '',
  passWord: 0,
  nickName: null,
  phone: 0,
  superLevel: false
}

const DEFAULT_PATCH = {
  userName: '',
  passWord: 0,
  nickName: null,
  phone: 0,
  superLevel: false
}

const all = async ( token) => {
  return await rest.get( token)(`${URL}`)
}

const create = async function( token, admin) {
  const postAdmin = Object.assign({}, DEFAULT_POST, admin)
  return rest.post( token)(
    URL,
    postAdmin
  )
}

const remove = async function( token, removeAdminId) {
  return rest.remove( token)(
    `${URL}/${removeAdminId}`
  )
}

const update = async function( token, admin) {
  console.log(admin)
  const patchData = Object.assign({}, DEFAULT_PATCH, admin)
  console.log(patchData)
  return rest.post( token)(
    `${URL}/${patchData.administratorId}`,
    patchData
  )
}

export default {
  all,
  create,
  remove,
  update
}
