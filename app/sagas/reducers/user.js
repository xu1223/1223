import {
  handleActions
} from 'redux-actions';
import update from 'immutability-helper';
import { setItem } from '@/util'
import {
  ActionTypes
} from '../_constants';

export const userState = {
  res: {
    loading: false,
    access_token: '',
    user_info: {},
    msg: ''
  },
  menu: {
    initLoading: true,
    curMenu: '',
    curSecMenu: '',
    curType: '',
    menuData: [],
    curMname: '',
    breadData: []
  },
  local: {
    platData: []
  },
  store: {
    search: {},
    searchForm: {}, // searchForm 请求的数据
    searchValue: {}, // dataOper 请求的数据
    activeKey: {}, // 拥有tab 的选中情况
  }
};

export default {
  user: handleActions({
    [ActionTypes.USER_LOGIN]: state => {
      state = update(state, {
        res: {
          loading: {
            $set: true
          },
        }
      })
      return state
    },
    [ActionTypes.CLEAR_LOADING]: state => {
      setItem('ACCESS_TOKEN', '')
      state = update(state, {
        res: {
          loading: {
            $set: false
          },
        }
      })
      return state
    },
    [ActionTypes.USER_LOGIN_SUCCESS]: (state, {
      payload
    }) => {
      const {
        access_token,
        ...user_info
      } = payload
      return update(state, {
        res: {
          access_token: {
            $set: access_token
          },
          user_info: {
            $merge: user_info
          },
          msg: {
            $set: '登录成功'
          },
          loading: {
            $set: false
          },
        }
      })
    },
    [ActionTypes.USER_LOGIN_FAILURE]: (state, {
      payload
    }) => {
      return update(state, {
        res: {
          msg: {
            $set: payload.resultMsg
          },
          loading: {
            $set: false
          },
        }
      })
    },
    [ActionTypes.GET_NAME]: (state, {
      payload
    }) => {
      return update(state, {
        res: {
          user_info: {
            $merge: payload.user_info.resultData
          },
        }
      })
      return state
    },
    [ActionTypes.USER_LOGOUT_SUCCESS]: state =>
      update(state, {
        res: {
          access_token: {
            $set: ''
          },
          user_info: {
            $set: {}
          },
          msg: {
            $set: '登出成功'
          },
          loading: {
            $set: false
          },
        }
      }),
    [ActionTypes.GET_MENU]: (state, { }) => {
      const data = {
        initLoading: false
      }
      return update(state, {
        menu: { $merge: data }
      })
    },
    [ActionTypes.GET_MENU_SUCCESS]: (state, { payload }) => {
      //todo 处理问题 缓存值 被初始值覆盖
      const { menu } = state
      const data = {
        menuData: payload,
        initLoading: false
      }
      if (!menu.curMenu) {
        data.curMenu = payload[0].index
        data.curSecMenu = 'userManagement' //payload[0].children[0].children[0].index
        data.breadData = []
      }
      return update(state, {
        menu: { $merge: data }
      })
    },
    [ActionTypes.CHANGE_ROUTER]: (state, { payload }) => {
      // 这个方法只提供 新增 和 切换到功能
      // 改变路由需要 替换的redux
      const {
        curMenu,
        curMname,
        curSecMenu,
      } = state.menu
      let breadData = state.menu.breadData || []
      const { type, ..._newData } = payload
      const index = breadData.findIndex(item => {
        let flag = false
        if (item.index == payload.index) {
          flag = true
          if (item.type != type) {
            flag = false
          }
        }

        return flag
      }) // 查找当前节点 是否存在
      let breadItem
      if (index != -1) {
        breadItem = {
          ...breadData[index],
          ..._newData,
          type
        }
        breadData[index] = breadItem  // 替换
      } else {
        breadItem = {
          parent: curMenu,
          index: curSecMenu,
          curMname,
          ..._newData,
          type
        }
        breadData.push(breadItem) // 新增
      }
      // 如果切换到时候  并且是刊登  要把其他的清掉

      const updateState = {

      }
      if (breadItem.curMname != curMname && breadItem.parent == 'Publish') {
        breadData = breadData.filter(item => item.curMname == breadItem.curMname || item.parent != 'Publish')
        console.log(breadData, '发生了改变')
        const { searchValue = {}, searchForm = {} } = state.store
        searchValue[breadItem.parent] = {}
        searchForm[breadItem.parent] = {}
        updateState.store = {
          searchValue: { $set: searchValue },
          searchForm: { $set: searchForm }
        }
      }

      updateState.menu = {
        curMenu: { $set: breadItem.parent },
        curSecMenu: { $set: breadItem.index },
        curType: { $set: breadItem.type },
        curMname: { $set: breadItem.curMname },
        breadData: { $set: breadData }
      }

      return update(state, updateState)
    },
    [ActionTypes.SET_AUTO_SEARCH_DATA]: (state, { payload }) => {
      const { store: { searchForm = {}, searchValue = {}, activeKey = {} } } = state;
      const { defaultValue, active, url, publish_status } = payload;
      const objForm = {}, objValue = {}, objchildForm = {}, objchildValue = {};
      if (url == 'productDev' || url == 'ProductPretrial') {
        objValue[`${url}#_#${active}`] = defaultValue;
        searchValue.ProductInfo = { ...searchValue.ProductInfo, ...objValue };
      } else {
        objchildForm['store_sku$title$unicodeSel'] = 'sku';
        objchildForm['store_sku$title$unicodeValue'] = defaultValue;
        objchildForm['uuid'] = { key: localStorage.getItem("USER_UUID"), label: localStorage.getItem("MANAGER_NAME") };
        objForm[`${url}${active}`] = objchildForm;
        searchForm.Publish = objForm;

        objchildValue['store_sku'] = defaultValue;
        objchildValue['publish_status'] = publish_status;
        objchildValue['uuid'] = localStorage.getItem("USER_UUID");
        objValue[`${url}#_#${active}`] = objchildValue;
        searchValue.Publish = objValue;
      }

      activeKey[`${url}`] = active;
      console.log('缓存值', state.store, payload)
      return update(state, {
        store: { $set: state.store }
      })
    },
    [ActionTypes.SET_BREAD]: (state, { payload }) => {
      const obj = {}
      obj.breadData = { $set: (payload.breadData || state.menu.breadData) }
      if (payload.curMenu) {
        obj.curMenu = { $set: payload.curMenu }
        obj.curSecMenu = { $set: payload.curSecMenu }
        obj.curType = { $set: payload.curType }
        obj.curMname = { $set: payload.curMname }
      }
      return update(state, {
        menu: obj
      })
    },
    [ActionTypes.USER_LOGOUT]: state =>
      update(state, {
        res: {
          loading: { $set: true },
        }
      }),
    [ActionTypes.STORE_SEARCH_FORM]: (state, {
      payload
    }) => {
      return update(state, {
        store: {
          search: { $set: payload }
        }
      })
    },
    [ActionTypes.STORE_SEARCH_DATA]: (state, {
      payload
    }) => {
      const { store: { searchForm = {}, searchValue = {}, activeKey = {} } } = state
      const { type = 'form', key, data } = payload
      const obj = {}

      // 更新searchForm 的缓存数据
      if (type == 'form') {
        if (!searchForm[state.menu.curMenu]) {
          searchForm[state.menu.curMenu] = {}
        }
        searchForm[state.menu.curMenu][key] = data
        obj.searchForm = searchForm
      } else {
        if (!searchValue[state.menu.curMenu]) {
          searchValue[state.menu.curMenu] = {}
        }
        // 更新dataOper 的缓存数据
        searchValue[state.menu.curMenu][key] = data
        obj.searchValue = searchValue
        const keyArr = key.split('#_#')
        if (keyArr.length == 2) {
          activeKey[keyArr[0]] = keyArr[1]
          obj.activeKey = activeKey
        }
      }
      return update(state, {
        store: { $set: { ...state.store, ...obj } }
      })
    },
    [ActionTypes.SET_LOCAL_DATA]: (state, {
      payload
    }) => {
      const _local = { ...state.local, ...payload }
      return update(state, {
        local: { $set: _local }
      })
    },
    [ActionTypes.CLEAR_STORE_DATA]: (state) => {
      return update(state, {
        store: {
          search: { $set: {} },
          searchForm: { $set: {} },
          searchValue: { $set: {} },
          activeKey: { $set: {} },
        }
      })
    }
  },
    userState,
  ),
};