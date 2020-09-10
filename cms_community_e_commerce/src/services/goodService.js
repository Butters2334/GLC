import {
  ADMIN_API,
  DEFAULT_PAGE
} from '../constants';
import rest from '../utils/rest';
import { postData } from '../utils/postData';

const admin_good = `${ADMIN_API}/goods/get_list`
const DEFAULT = {
  categorySecondId: 100000,
  goodName: '',
  price: 0,
  originalPrice: 0,
  inventory: 0,
  spec: '1*1',
  origin: '',
  imageFile: ''
}

const all = async ( token, good, page = DEFAULT_PAGE, rows = 8) => {
  if (good) {
    return await rest.post( token)(admin_good, {
        page_size: page,
      page_index: rows,
      goodId: good.goodId,
      goodName: good.goodName,
      categorySecondId: good.categorySecondId,
      goodStatus: good.status
    })
  } else {
    return await rest.post( token)(admin_good, {
        page_size: page,
      page_index: rows
    })
  }
}

const create = async (
  
  token,
  good,
  imageFile
) => {
  const goodData = {
    ...DEFAULT,
    ...good,
    imageFile
  }

  return await rest.post( token)(
    admin_good,
    {
      ...goodData,
      imageFile
    }
  )
}

const update = async (
  
  token,
  good
) => {
  return await rest.patch( token)(
    `${admin_good}/${good.goodId}`,
    good
  )
}

const inventory = async (
  
  token,
  goodId,
  putInNumber
) => {
  return await rest.patch( token)(
    `${admin_good}/${goodId}/inventory`,
    {
      inventory: putInNumber
    }
  )
}

export default {
  all,
  create,
  update,
  inventory
}
