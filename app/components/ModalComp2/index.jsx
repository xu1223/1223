// 弹窗的二度封装
import React, { Component } from "react";

import { request } from "fetch/request";
import "./index.less";

import { getUrlType } from "@/util/index";

import { Modal, Alert, Icon, message, Drawer, Button } from "antd";

const defaultConfig = {
  width: 416,
  title: "系统提示",
  content: "确定后不可撤销",
  cancelButtonProps: {},

};

export class ModalComp extends Component {
  static defaultProps = {
    visible: false,
    tiptext: "", // 友好提示 文案
    tiptextType: "info",
  };

  state = {};

  getFetchParams(values = {}) {
    const { beforeCallback } = this.props;
    if (beforeCallback) {
      beforeCallback(values, (afterValues) => {
        this.fetchData(afterValues);
      });
    } else {
      this.fetchData(values);
    }
  }

  fetchData(values) {
    const {
      afterCallback,
      method,
      changeSearch,
      params = {},
      onCancel,
      selectedRows,
      unicode = "ids|id",
    } = this.props;
    this.setState({
      confirmLoading: true,
    });
    const [submitId, recordId] = unicode.split("|");
    if (selectedRows && selectedRows.length > 0) {
      params[submitId] = selectedRows.map((item) => item[recordId]).join(",");
    }
    if (method) {
      const isFunc = typeof method == 'function'
      const obj = { ...params, ...values }
      let req
      if (isFunc) {
        req = method(obj)
      } else {
        const [type, url] = getUrlType(method);
        req = request(type, url, obj)
      }

      req.then((res) => {
        if (res.resultId == 200) {
          message.success("操作成功");
          if (afterCallback) {
            afterCallback(res);
          } else {
            changeSearch && changeSearch();
            onCancel();
          }
        }else{
          message.error(res.resultMsg);
        }
        this.setState({
          confirmLoading: false,
        });
      });
    }
  }

  componentWillUnmount() {
    const { visible } = this.props;
    if (visible) {
      this.hideOverflow();
    }
  }

  hideOverflow() {
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 300);
  }

  onOk = (e) => {
    e.preventDefault();
    const { form } = this.props;
    if (form) {
      // 如果存在form
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.getFetchParams(values);
      });
    } else {
      this.getFetchParams();
    }
  };

  getWidth = (winType = 2) => {
    let winWidth;
    switch (winType) {
      case "xs":
        winWidth = 360;
        break;
      case 1:
      case "sm":
        winWidth = 560;
        break;
      case 2:
      case "md":
        winWidth = 860;
        break;
      case 3:
      case "lg":
        winWidth = 1060;
        break;
    }
    return winWidth;
  };

  getWinConifg() {
    const {
      onCancel = () => { },
      tiptext,
      winType,
      wintype,
      ..._props
    } = this.props;
    const width = this.props.width || this.getWidth(winType || wintype);
    const _style = {
      position: "fixed",
      left: "50%",
      marginLeft: -width / 2
    };
    const _params = {
      className: "window-modal",
      closable: false,
      maskClosable: true,
      visible: this.props.visible,
      onOk: this.onOk,
      onCancel,
      confirmLoading: this.state.confirmLoading,
      bodyStyle: {
        maxHeight: window.innerHeight - 300,
        overflowY: "auto",
        position: "relative",
        minHeight: '0',
      },
      cancelButtonProps: {},
      ..._props,
      width,
      style: {
        _style
      },
      title:
        this.props.title != false
          ? [
            this.props.title || "title",
            <span className="myclose-btn" onClick={onCancel}>
              <Icon type="close" />
            </span>,
          ]
          : false,
    };

    return _params;
  }

  render() {
    const { visible, tiptext, tiptextType } = this.props;
    return visible ? (
      <Modal {...this.getWinConifg()}>
        {tiptext ? <div className="topAlert">{tiptext}</div> : null}
        {this.props.children}
      </Modal>
    ) : null;
  }
}
// export class ConfirmComp extends Component{

// }
export const Confirm = ({ ...props }) =>
  Modal.confirm({
    ...defaultConfig,
    ...props,
  });

export const Warning = ({ ...props }) =>
  Modal.warning({
    ...defaultConfig,
    ...props,
  });

export const Error = ({ ...props }) =>
  Modal.error({
    ...defaultConfig,
    ...props,
  });

export const Success = ({ ...props }) =>
  Modal.success({
    ...defaultConfig,
    ...props,

  });

export const Info = ({ ...props }) =>
  Modal.info({
    ...defaultConfig,
    ...props,

  });

export class DrawerComp extends Component {
  static defaultProps = {
    visible: false,
    tiptext: "", // 友好提示 文案
  };

  state = {};

  componentWillUnmount() {
    const { visible } = this.props;
    if (visible) {
      this.hideOverflow();
    }
  }

  hideOverflow() {
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 300);
  }

  getFetchParams(values = {}) {
    const { beforeCallback } = this.props;
    if (beforeCallback) {
      beforeCallback(values, (afterValues) => {
        this.fetchData(afterValues);
      });
    } else {
      this.fetchData(values);
    }
  }

  fetchData(values) {
    const {
      afterCallback,
      method,
      changeSearch,
      params = {},
      onCancel,
      selectedRows,
      unicode = "ids|id",
    } = this.props;
    this.setState({
      confirmLoading: true,
    });
    if (method) {
      const [submitId, recordId] = unicode.split("|");
      if (selectedRows) {
        params[submitId] = selectedRows.map((item) => item[recordId]).join(",");
      }

      const isFunc = typeof method == 'function'
      const obj = { ...params, ...values }
      let req
      if (isFunc) {
        req = method(obj)
      } else {
        const [type, url] = getUrlType(method);
        req = request(type, url, obj)
      }

      req.then((res) => {
        if (afterCallback) {
          afterCallback(res);
        } else {
          changeSearch && changeSearch();
          this.onCancel();
        }
        this.setState({
          confirmLoading: false,
        });
      });
    }
  }

  onOk = (e) => {
    e.preventDefault();
    const { form } = this.props;
    if (form) {
      // 如果存在form
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.getFetchParams(values);
      });
    } else {
      this.getFetchParams();
    }
  };

  getWidth = (winType = "md") => {
    let winWidth;
    switch (winType) {
      case "xs":
        winWidth = 360;
        break;
      case 1:
      case "sm":
        winWidth = 560;
        break;
      case 2:
      case "md":
        winWidth = 860;
        break;
      case 3:
      case "lg":
        winWidth = 1060;
        break;
    }
    return winWidth;
  };
  onCancel = () => {
    this.props.onCancel();
  };

  getWinConifg() {
    const {
      onCancel = () => { },
      visible,
      title = "title",
      winType,
      wintype,
      placement = "right",
      tiptext,
      ..._props
    } = this.props;
    const _params = {
      closable: false,
      visible,
      onOk: this.onOk,
      onClose: this.onCancel,
      confirmLoading: this.state.confirmLoading,
      title,
      placement,
      width: this.getWidth(winType || wintype),
      footer: <div></div>,
      ..._props,
    };
    return _params;
  }

  getFooter = () => {
    const { footer = true, onOk, okText } = this.props;

    if (footer == true) {
      return (
        <div className="drawer-footer">
          <Button onClick={this.onCancel}>取消</Button>
          <Button
            onClick={onOk || this.onOk}
            loading={this.props.confirmLoading}
            type="primary"
          >
            {okText ? okText : "确定"}
          </Button>
        </div>
      );
    } else if (typeof footer == "object") {
      return <div className="drawer-footer">{footer}</div>;
    }
    return footer;
  };

  render() {
    const { visible, tiptext } = this.props;

    return visible ? (
      <Drawer {...this.getWinConifg()}>
        {tiptext ? (
          <div className="alert-group">
            <Alert message={<div>{tiptext}</div>} type="warning" />
          </div>
        ) : null}
        {this.props.children}
        {this.getFooter()}
      </Drawer>
    ) : null;
  }
}
