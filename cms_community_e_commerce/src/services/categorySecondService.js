import axios from 'axios';
import {
  ADMIN_API,
  USER_API
} from '../constants';
import rest from '../utils/rest';

const ADMIN_URL = `${ADMIN_API}/category/second`;
const USER_URL = `${USER_API}/category/second`;
const DEFAULT_POST = {
  categoryFirstId: 0,
  categoryName: '',
  imageFile: null
}
const DEFAULT_PATCH = {
  categorySecondId: 0,
  categoryFirstId: 0,
  categoryName: '',
  imageFile: null
}

const all = async function() {
  return await axios.get(USER_URL)
}

const create = async function( token, categorySecond) {
  const postCategory = Object.assign({}, DEFAULT_POST, categorySecond)
  return rest.post( token)(
    ADMIN_URL,
    postCategory
  )
}

const remove = async function( token, categorySecondId) {
  return rest.remove( token)(
    `${ADMIN_URL}/${categorySecondId}`
  )
}

const update = async function( token, categorySecond) {
  const patchData = Object.assign({}, DEFAULT_PATCH, categorySecond)
  return rest.post( token)(
    `${ADMIN_URL}/${patchData.categorySecondId}`,
    patchData
  )
}

export default {
  all,
  create,
  remove,
  update
}
