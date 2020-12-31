import { createActions } from 'redux-actions';

import { ActionTypes } from '../_constants';

export const { 
  userLogin: login, 
  userLogout,
  getMenu,
  setName,
  setBread,
  storeSearchForm,
  changeRouter,
  storeSearchData,
  clearStoreData,
  clearLoading,
  setAutoSearchData,
} = createActions({
  [ActionTypes.USER_LOGIN]: payData => payData,
  [ActionTypes.USER_LOGOUT]: payData => payData,
  [ActionTypes.GET_MENU]: payData => payData,
  [ActionTypes.SET_NAME]: payData => payData,
  [ActionTypes.SET_BREAD]: payData => payData,
  [ActionTypes.STORE_SEARCH_FORM]: payData => payData,
  [ActionTypes.CHANGE_ROUTER]: payData => payData,
  [ActionTypes.STORE_SEARCH_DATA]: payData => payData,
  [ActionTypes.CLEAR_STORE_DATA]: payData => payData,
  [ActionTypes.CLEAR_LOADING]:() => ({}),
  [ActionTypes.SET_AUTO_SEARCH_DATA]:payData => payData,
});