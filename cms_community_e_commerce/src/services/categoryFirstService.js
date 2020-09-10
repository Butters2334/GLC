import {
  ADMIN_API,
  USER_API
} from '../constants';
import axios from 'axios';
import rest from '../utils/rest';

const ADMIN_CATEGORY = `${ADMIN_API}/category/first`;
const USER_CATEGORY = `${USER_API}/category/first`;

const all = async (page, rows) => {
  if (page && rows ) {
    return await axios.get(USER_CATEGORY, {
      params: {
        page,
        rows
      }
    })
  } else {
    return await axios.get(USER_CATEGORY)
  }
}


const create = async ( token, categoryName) => {
  return await rest.post( token)(
    ADMIN_CATEGORY,
    {
      categoryName
    }
  )
}

const update = async ( token, category) => {
  return await rest.patch( token)(
    `${ADMIN_CATEGORY}/${category.categoryFirstId}`,
    {
      categoryName: category.categoryName
    }
  )
}

const remove = async ( token, categoryFirstId) => {
  return await rest.remove( token)(
    `${ADMIN_CATEGORY}/${categoryFirstId}`
  )
}

export default {
  all,
  create,
  update,
  remove
}
