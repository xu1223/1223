import React, { Component } from "react";
import tipSuccess from "@/static/img/tip-success.png";
import tipDel from "@/static/img/tip-del.png";
import tipInfo from "@/static/img/tip-info.png";
import { Modal, notification, Button, message } from "antd";
/**
 * type: confirm  info error success warning
 * className 自定义样式名
 * title: 标题
 * icon: 图标
 * content: 内容 jsx
 * okText: 确认按钮
 * cancelText: 取消按钮
 * onOk: (e) 点击回调
 * onCancel: (e) 点击遮罩层或右上角叉或取消按钮的回调
 * imgType:  图片类型 tipSuccess 成功 tipDel tipInfo
 */
let defaultConfig = {};

/**
 * 图片类型 tipSuccess 成功 tipDel tipInfo
 */
const _typeImg = (typeImg = "tipInfo") => {
  if (typeImg == "tipSuccess") {
    return tipSuccess;
  } else if (typeImg === "tipDel") {
    return tipDel;
  } else if (typeImg === "tipInfo") {
    return tipInfo;
  }
};
const _getStr = (string, str) => {
  let _s = string.split(str)[0];
  let _str = string.substring(_s.length).substr(1);
  return _str.substring(0, _str.length - 1);
};
export const WinConfirms = (props = {}) => {
  const {
    title,
    content,
    imgType,
    className,
    okText,
    cancelText,
    icon,
    type = "confirm",
    imgSrc = "",
    isImg = true,
    ..._props
  } = props;
  const _imgType = imgSrc || _typeImg(imgType);
  let _icon;
  if (icon) {
    _icon = <i className={`iconfont ${icon && icon}`}></i>;
  }
  let _parms = {
    className: className || "window-container",
    icon: _icon,
    closable: true,
    title: title || "标题title",
    okText: okText || "确认",
    cancelText: cancelText || "取消",
    destroyOnClose: true,
    maskClosable:true,
    ..._props,
    content: (
      <>
        <div className="pos-img" style={{ display: isImg ? "block" : "none" }}>
          <img src={_imgType || tipSuccess} />
        </div>
        {content || ""}
      </>
    ),
  };
  Modal[type && type || 'confirm'](_parms);
};

export const WinNotification = (props = {}) => {
  const {
    type,
    title,
    content,
    btn = false,
    className,
    okText,
    cancelText,
    onOk,
    icon,
    timer = 3,
    placement = "topRight",
  } = props;
  //  placement topLeft topRight bottomLeft bottomRight
  let _btns;
  if (btn) {
    //按钮
    _btns = (
      <>
        <Button size="small" onClick={() => notification.close()}>
          {cancelText || "取消"}
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            onOk && onOk();
            notification.close();
          }}
        >
          {(okText && okText) || "确认"}
        </Button>
      </>
    );
  }
  let _icon;
  if (icon) {
    _icon = <i className={`iconfont ${icon && icon}`}></i>;
  }
  notification[(type && type) || "info"]({
    className: className || "window-notifications",
    icon: _icon,
    duration: timer,
    message: title ? title : "Notification Title",
    btn: btn ? _btns : "",
    description: content ? content : "自定义内容",
    placement: placement && placement,
  });
};
export const WinMessage = (props = {}) => {
  // message.success(content, [duration], onClose)
  // message.error(content, [duration], onClose)
  // message.info(content, [duration], onClose)
  // message.warning(content, [duration], onClose)
  // message.warn(content, [duration], onClose) // alias of warning WinMessage({type:类型, 默认 info content:'提示',timer:3,时间默认3 icon:''图标})
  // message.loading(content, [duration], onClose) type 类型 content 内容 timer 秒 icon 字体图标 iconColor: 图标颜色 需要设置 icon的时候才生效
  const {
    type = "info",
    content = "内容提示",
    timer = 3,
    icon,
    iconColor = "#4486F7",
  } = props;
  let _icon;
  if (icon) {
    _icon = (
      <i
        className={`iconfont  ${icon && icon}`}
        style={{ color: iconColor }}
      ></i>
    );
  }
  message[type]({
    content: content,
    duration: timer,
    icon: _icon,
  });
};
/**
 * 数组转对象
 * @param {*} arr
 * @param {*} _typeName
 */
export const WinArrObje = (arr = [], _typeName = {}) => {
  let parms = {};
  for (var key in arr) {
    for (var _key in _typeName) {
      if (!_typeName[_key] + key) {
        if (!parms[_typeName[_key] + key]) {
          parms[_typeName[_key] + key] = arr[key][_typeName[_key] + key];
        }
      }
    }
  }
  return parms;
};
/**
 * 原数据 [{d_id_0: "12", id_name_0: "023456", id_value_v_0: "023457"}]
 * 转换后的数据 [{id: "12", name: "023456", value_v: "023457"}]
 */
export const WinArrSlice = (
  len = 3,
  arr = [],
  _typeName = {},
  _split = "_"
) => {
  let newArr = [];
  for (var i = 0; i < len; i++) {
    (function (j) {
      let _objParms = {};
      for (var key in _typeName) {
        let _getkey = _getStr(_typeName[key], _split);
        for (var n = 0; n < arr.length; n++) {
          if (n === j) {
            // if(arr[n][_typeName[key] + n] === false){
            //   arr[n][_typeName[key] + n] = 2
            //   _objParms[_getkey] = arr[n][_typeName[key] + n]
            // } else {
            //   arr[n][_typeName[key] + n] = 1
            //   _objParms[_getkey] = arr[n][_typeName[key] + n]
            // }
            _objParms[_getkey] = arr[n][_typeName[key] + n];
          }
        }
      }
      newArr.push(_objParms);
    })(i);
  }
  return newArr;
};
/**
 *    let arr1 =   [
        {id: "12", name: "023456", value_v: "023457"},
      ]
      let arr2 =   [
          {id: "", name: "", value_v: "023457"},
      ]
 * @param {*} arr1 
 * @param {*} arr2 
 */
export const WinArrVal = (arr1, arr2, _typeName) => {
  let newArr = [];
  for (var i = 0; i < arr1.length; i++) {
    let parms = {};
    for (var key in _typeName) {
      for (var n = 0; n < arr2.length; n++) {
        if(arr1[i][_typeName[key]] ){
          arr2[n][_typeName[key]] = arr1[i][_typeName[key]];
          if (!parms[_typeName[key]]) {
            parms[_typeName[key]] = arr2[n][_typeName[key]];
          }
        }
      }
    }
    newArr.push(parms);
  }
  return newArr;
};
/*
 *@parms  len 长度
 * typeName数据 用于表格循环添加数据
 * parms 获取表格动态数据
 *
 */
export const WinObjeArr = (len = 3, typeName = {}, parms = {}) => {
  let newArr = [];
  for (let i = 0; i < len; i++) {
    (function (j) {
      let _objParms = {};
      let _str, _ids;
      for (let key in typeName) {
        _str = (typeName[key] + i).split("_");
        _ids = _str[_str.length - 1].toString();
        for (let _key in parms) {
          if (typeName[key] + i == _key) {
            if (parseInt(_ids) == parseInt(i)) {
              if (!_objParms[typeName[key] + i]) {
                // if(parms[_key] === false){
                //     parms[_key] = 2
                // } else {
                //     parms[_key] = 1
                // }
                _objParms[typeName[key] + i] = parms[_key];
              }
            }
          }
        }
      }
      newArr.push(_objParms);
    })(i);
  }
  return newArr;
};
/**
 * 根据对象里面的名字 筛选需要的对象值 返回一个新的字段
 *   筛选对象里面的数据
 */
export const WinParmsObj = (_objTypename = {}, parmsObj = {}) => {
  let parms = {};
  for (var key in _objTypename) {
    for (var _key in parmsObj) {
      if (_objTypename[key] == _key) {
        if (!parms[_objTypename[key]]) {
          parms[_objTypename[key]] = parmsObj[_key];
        }
      }
    }
  }
  return parms;
};
/**
 * 判断是否存在
 * @param {*} parms 
 * @param {*} key 
 */
export const WinTernaryOperator = (parms,key) => {
  return parms[key] ?  parms[key] : '';
}
/**
 * 判断布尔值
 * @param {*} parms 
 * @param {*} key 
 */
export const WinIsBooleanValue = (parms,key) => {
  return parms[key] == 1 ?  true : false;
}
