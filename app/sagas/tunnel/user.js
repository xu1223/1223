/**
 * @module Sagas/User
 * @desc User
 */

import {
  all,
  delay,
  put,
  takeLatest,
  call,
  select
} from 'redux-saga/effects';
import {
  hashHistory
} from 'react-router'
import {
  message
} from 'antd'
import {
  ActionTypes
} from '../_constants';
import moment from 'moment'
import {
  get,
  post
} from '@/fetch/request'
import api from '@/fetch/api'
import {
  getResultData,
  getItem,
  getJson
} from '@/util/index'
import MD5 from "md5";


/**
 * Logout
 */
export function* logout({
  payload = {}
}) {
  try {
    localStorage.setItem("USER_TOKEN", '');
    // location.href = process.env.APP_HOST_LOGIN_URL
    // const response = yield call(loginOut)
    // if (response.resultId == 1) {
    //   yield put({
    //     type: ActionTypes.USER_LOGOUT_SUCCESS,
    //   });
    //   if (!payload.isout) {
    //     message.success('登出成功')
    //   }
    //   localStorage.setItem("USER_TOKEN", '');
    //   hashHistory.push('/Login');
    // } else {
    //   yield put({
    //     type: ActionTypes.USER_LOGOUT_FAILURE,
    //     payload: response,
    //   });
    //   message.error(response.resultMsg)
    // }
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err,
    });
  }
}

//获取menu
const fetchmenu = (obj = {}) => {
  // return get(api.get_user_menus, {
  //   pagesize: 100000,
  //   ...obj,
  //   product_line_id: 3
  // })
};

function getPowerData(data) {
  const powerData = {}
  data.forEach((item) => {
    if (item.children) {
      item.children.forEach(_item => {
        const parentIndex = _item.index
        _item.children && _item.children.forEach(___item => {
          const {
            children,
            index,
            name
          } = ___item
          // 销售管理 和 订单模块 需要复用
          const _keyIndex = ['sale', 'order'].includes(item.index) ? parentIndex + '_' + index : index
          if (_keyIndex) {
            powerData[_keyIndex] = {
              list: name
            }
          }
          if (children) {
            children.forEach(__item => {
              powerData[_keyIndex][__item.index] = __item.active == 1
            })
          }
        })
      })
    }
  })
  return powerData
}


export function* getmenu({
  payload
}) {
  try {
    
    const uuid = payload.uuid || getItem("USER_UUID")
    const {
      isRefresh = 0
    } = payload
    if (isRefresh == 1) {
      const user_info = getJson('USE_INFO')//获取用户嘻嘻
      yield put({
        type: ActionTypes.GET_NAME,
        payload: {
          user_info: {
            resultData: user_info
          }
        }
      })
    }
    const menuData = yield select(state => state.user.menu.menuData)
    let response
    if (!menuData || isRefresh == 1) {
      response = yield call(fetchmenu)
    }
    console.log(response)
    if (response && (response.resultId == 1 || response.resultId == 200)) {
      const data = getResultData(response).list
      global.powerData = getPowerData(data)
      console.log(global.powerData, '获取权限树')
      yield put({
        type: ActionTypes.GET_MENU_SUCCESS,
        payload: data
      });
    } else if (menuData && menuData.length > 0) {
      global.powerData = getPowerData(menuData)
      yield put({
        type: ActionTypes.GET_MENU_SUCCESS,
        payload: menuData
      });
    } else {
      // yield put({
      //   type: ActionTypes.USER_LOGOUT_FAILURE,
      //   payload: response,
      // });
      // message.error(response.resultMsg)
    }

  } catch (err) {
    console.log(err)
  }
}

//获取name
const getname = (uuid) => {
  return get(api.get_user_manager, {
    uuid
  })
};

// 废弃
export function* setname() {
  try {
    const id = yield select(state => !!getItem("USER_UUID") ? getItem("USER_UUID") : state.user.res.user_info.uuid)
    const response = yield call(getname, id)
    yield put({
      type: ActionTypes.GET_NAME,
      payload: {
        platData: response
      }
    })
  } catch (err) {
    throw new Error(err)
  }
}


/**
 * User Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.USER_LOGOUT, logout),
    takeLatest(ActionTypes.GET_MENU, getmenu),
    takeLatest(ActionTypes.SET_NAME, setname),
  ]);
}