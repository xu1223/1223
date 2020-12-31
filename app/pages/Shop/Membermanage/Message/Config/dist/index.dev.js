"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabStateConfig = exports.tabConfig = exports.detaOperConfig = exports.addProductApi = exports["default"] = void 0;
var _default = {
  toolConfig: {
    "list": {
      action: "get_orders_pager",
      params: {}
    }
  }
};
exports["default"] = _default;
var addProductApi = {
  toolConfig: {
    "list": {
      action: "shop_searchList" //commodity/searchList

    }
  }
};
exports.addProductApi = addProductApi;
var detaOperConfig = [{
  id: 5,
  name: '在途',
  value: 5
}, {
  id: 6,
  name: '待收货',
  value: 9
}, {
  id: 7,
  name: '已收货',
  value: 6
}];
exports.detaOperConfig = detaOperConfig;
var tabConfig = "''|全部订单|shop_ziyuan21,unpaid|未付款|shop_ziyuan17,paid|已付款|shop_ziyuan22,shipped|已发货|shop_ziyuan22,canceled|已取消|shop_ziyuan17,completed|已完成|shop_ziyuan22";
exports.tabConfig = tabConfig;
var tabStateConfig = tabConfig.concat(',15|审核不通过,25|敏感货审核不通过,50|待调拨,60|完成,70|结案');
exports.tabStateConfig = tabStateConfig;