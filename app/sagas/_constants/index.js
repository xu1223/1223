import keyMirror from 'fbjs/lib/keyMirror';

export const ActionTypes = keyMirror({
    GET_MENU: undefined,
    GET_MENU_SUCCESS:undefined,
    SET_BREAD: undefined,
    CHANGE_ROUTER: undefined,
    EXCEPTION: undefined,
    USER_LOGIN: undefined,
    USER_LOGIN_SUCCESS: undefined,
    USER_LOGIN_FAILURE: undefined,
    USER_LOGOUT: undefined,
    USER_LOGOUT_SUCCESS: undefined,
    USER_LOGOUT_FAILURE: undefined,
    STORE_SEARCH_DATA: undefined,
    CLEAR_LOADING:undefined,
    SET_NAME:undefined,
    GET_NAME:undefined,

    STORE_SEARCH_FORM: undefined,

    RESET_PWD_STEP:undefined,
    RESET_PWD_UPDATE:undefined,

    GET_EXPORT_TABLE: undefined,
    SET_EXPORT_TABLE: undefined,
    GET_EXPORT_FAILURE:undefined,
    SET_SELECT_EXPORT:undefined,

    GET_PUBLISH_INFO: undefined,
    GET_CATE_INFO: undefined,
    GET_CATE_INFO_ARR: undefined,
    GET_CLASSARR_SUCCESS: undefined,
    GET_PUBLISH_SUCCESS: undefined,
    GET_PUBLISH_FAILURE: undefined,
    CLEAR_PUBLISH_INFO:undefined,
    SET_IMG: undefined,
    SET_SUB_IMG: undefined,
    SET_DEFAULT_IMG: undefined,
    SET_SKU: undefined,
    SET_ATTR: undefined,  //设置 刊登 SKU属性
    SET_LOCAL_DATA: undefined,  // 设置本地数据
    GET_AE_SELECT_DATA: undefined, // 获取ae 下拉框的值
    SET_AE_SELECT_DATA: undefined,
    GET_AE_PRICE:undefined,
    SET_AE_NATION:undefined,
    GET_ALI_SELECT_DATA:undefined,// 获取ali 下拉框的值
    SET_ALI_SELECT_DATA:undefined,
    SET_ALI_PRICE:undefined,
    SET_ALI_PERIOD:undefined,

    SET_PUBLISH_ATTR: undefined,
    SHOW_ATTR: undefined,
    INIT_PROPERTY: undefined,
    ADD_PROPERTY: undefined,
    SET_DOM:undefined,
    CLEAR_ATTR_DATA:undefined,
    SAVE_STORE_DATA:undefined,
    INIT_PUBLISH_ARR:undefined,
    INIT_CHANGE_ARR:undefined,
    SET_TAG_ARR:undefined,
    CLEAR_STORE_DATA:undefined,
    PURCHASE_PLAN_DATA:undefined,
    PURCHASE_ORDER_DATA:undefined,
    SET_AUTOMATIC_DATA:undefined,
    SET_AUTO_SEARCH_DATA:undefined,
    SET_SPEC_COLUMNS: undefined,
});

export const STATUS = {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    SUCCESS: 'success',
    ERROR: 'error',
};