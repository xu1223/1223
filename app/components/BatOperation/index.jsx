import React from 'react';
import {
    is,
    fromJS
} from 'immutable';

import {
    Menu,
    Button,
    message,
    Dropdown,
    Icon,
    Row,
    Col,
    Tooltip,
    Modal,
} from 'antd';
const MenuItem = Menu.Item;
const { SubMenu } = Menu;

import { request } from '@/fetch/request'
import Utils, { getUrlType } from '@/util/'

/**
 * @class 批量设置组件
 * @desc pageKey 是一个页面的权限前缀
 */
export default class BatOperation extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.pageKey = this.getPageKey()
        this.state = {}
    }

    /**
     * 获取当前页面的pageKey 
     */
    getPageKey = () => {
        const { powerKey, powerPrefix } = this.props;
        let pageKey
        if (powerKey) {
            pageKey = powerKey
        } else {
            const hasKey = location.hash.substr(2).split("/")[0]
            const _pageKey = location.hash.indexOf('?') > -1 ? hasKey.split('?')[0] : hasKey
            pageKey = [powerPrefix, _pageKey].filter(item => item).join('_')
        }
        return pageKey
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    /**
     * 获取权限值
     * @param   {object} data 
     * @returns {Boolean} true 表示有权限
     */
    getPower = (data) => {
        if (data.auth) {
            const pageKey = this.pageKey || this.getPageKey()
            return global.powerData && global.powerData[pageKey] && global.powerData[pageKey][data.auth]
        } else {
            return true
        }
    }

    /**
     * 渲染按钮内容
     * @param {object} data 
     * @param {object} _parent 父级公共的配置
     * @returns {object}  obj 
     * @returns {array}   obj.subArr 当前要渲染 MenuItem 
     * @returns {number}} obj.see 是否启用 Dropdown 的禁用状态
     */
    getMenuItem(data, _parent) {
        const subArr = []
        let see = 0
        data.forEach(item => {
            const { title } = item
            const config = { ..._parent, ...item }
            // 获取当前按钮的权限
            const disabled = this.getPower(config)
            // 判断是否有权限
            if (disabled) {
                see++
            }
            if (config.visible !== false) {
                if (item.url) {
                    subArr.push(<MenuItem disabled={!disabled} key={title} config={config}><a  href={this.changeUrl(item.url)} target='_blank'>{title}</a></MenuItem>)
                } else {
                    subArr.push(<MenuItem disabled={!disabled} key={title} config={config}>{item.component ? item.component : title}</MenuItem>)
                }
            }
        })
        return {
            subArr,
            see
        }
    }

    // a标签跳转前的钩子函数
    beforeJump = (e, callback = () => { }) => {
        if (callback() != undefined) {
            e.preventDefault()
        }
    }

    changeUrl = url => {
        let _url = url.indexOf('#') > -1 ? url : url.split('/')[0] ? '#/' + url : '#' + url
        _url = _url + (_url.indexOf('?') > -1 ? '&' : '?') + `hash=${location.hash.split('#/')[1]}`
        return _url
    }

    /**
     * 渲染
     * @param {array} data 当前配置数据
     */
    renderData = (data = []) => {
        const _html = []
        // rowData 行操作 的标志
        const { rowData } = this.props;
        data.forEach((item, index) => {
            if (rowData && !!item.icon) {
                item = { size: 'small', shape: 'round', ghost: true, ...item }
            } else {
                // debugger
                // 如果没有 icon 则 按钮为不透明
                item.ghost = false
            }
            const { children = [], type = "primary", shape, ghost = false, className = '', title = '批量操作', loading = false, component, visible, url, beforeJump, ..._parent } = item
            const antdIcon = item.antdIcon
            const icon = shape == 'round' && !item.icon ? 'order-ico-order_shengchengbaoguo' : item.icon
            const size = rowData ? 'small' : 'default'
            // 不用显示
            if (visible === false) {
                return
            }
            if (children.length) {
                const { subArr, see } = this.getMenuItem(children, _parent)
                if (!subArr.length) {
                    return
                }
                const btnProps = { key: title, shape, type, ghost, size }
                const btnGroup = <Dropdown disabled={see == 0} key={title + index} placement="bottomLeft" overlay={<Menu onClick={({ item }) => {
                    this.handleClick(item.props.config)
                }}>{subArr}</Menu>}>
                    <Button className={shape == 'round' ? (className + ' btn-round') : className} {...btnProps} loading={loading}>
                        {icon && <i className={'iconfont ' + icon}></i>}
                        {shape != 'round' && title}
                        {!rowData && shape != 'round' && <Icon type="down" />}
                    </Button>
                </Dropdown>
                _html.push(btnGroup)
            } else {
                const hasPower = this.getPower(item)
                const btnProps = {
                    size, type, ghost,
                    key: title + index,
                    config: _parent,
                    disabled: !hasPower,
                    onClick: (e) => this.handleClick({ e, title, url, ..._parent })
                }
                if (component && hasPower) {
                    // TODO 自定义的组件 没有权限就隐藏
                    if (component.props.url) {
                        _html.push(<a href={this.changeUrl(component.props.url) || '#'}   target='_blank' onContextMenu={e => this.beforeJump(e, component.props.beforeJump)} onClick={e => this.beforeJump(e, component.props.beforeJump)}>{component}</a>)
                    } else {
                        _html.push(component)
                    }
                } else if (shape && shape == 'round') {
                    btnProps.shape = shape
                    if (url) {
                        _html.push(
                            <Tooltip title={title}>
                                <a href={this.changeUrl(item.url) || '#'} style={{marginRight:'10px'}} target='_blank' onClick={e => this.beforeJump(e, beforeJump)} onContextMenu={e => this.beforeJump(e, beforeJump)}>
                                    <Button className={className + ' btn-round'} {...btnProps} loading={loading}>
                                        {antdIcon && <Icon type={antdIcon} />}{icon && <i className={'iconfont ' + icon}></i>}
                                    </Button>
                                </a>
                            </Tooltip>
                        )
                    } else {
                        _html.push(
                            <Tooltip title={title}>
                                <Button className={className + ' btn-round'} {...btnProps} loading={loading}>
                                    {antdIcon && <Icon type={antdIcon} />}{icon && <i className={'iconfont ' + icon}></i>}
                                </Button>
                            </Tooltip>
                        )
                    }
                } else if (url) {
                    _html.push(
                        <a href={this.changeUrl(item.url) || '#'} style={{marginRight:'10px'}} target='_blank' onClick={e => this.beforeJump(e, beforeJump)} onContextMenu={e => this.beforeJump(e, beforeJump)}>
                            <Button className={className} {...btnProps} loading={loading}>
                                {antdIcon && <Icon type={antdIcon} />}{icon && <i className={'iconfont ' + icon}></i>}{title}
                            </Button>
                        </a>
                    )
                }
                else {
                    _html.push(
                        <Button className={className} {...btnProps} loading={loading}>
                            {antdIcon && <Icon type={antdIcon} />}{icon && <i className={'iconfont ' + icon}></i>}{title}
                        </Button>
                    )
                }
            }
        })
        return _html
    }

    /**
     * 按钮事件
     * @param {object} curConfig 当前节点的配置
     */
    handleClick = (curConfig) => {
        const { batConfig, config, rowData, ...baseConfig } = this.props;
        const { e, method, params = {}, unicode = 'ids|id', title, vcode, operType, noCheck, onClick, callback, checkOnlyOne, content = '确定后不可撤销', titleText, url, childrenData } = { ...baseConfig, ...curConfig }
        const { listSelData, selectedRows, changeSearch } = batConfig;
        const { showMessage = true } = params;
        // 行操作 和 设置了 noCheck 为true 的按钮 不需要判断是否勾选 以及合法性
        if (!noCheck && !rowData) {
            //需要勾选时 走 合法性校验
            if (!listSelData.length) {
                message.warning('请勾选列表,再进行操作');
                return;
            } else if (!!vcode) {
                // 例如： vcode: 'status|20|不符合接口请求数据' 参数以|分隔  status：列需交验的字段   20：该字段对应的合法值 第三个参数为可选值 非法提示
                const [checkKey, checkVal, tipMsg = '请勾选有效数据，再进行操作'] = vcode.split("|")
                if (selectedRows.findIndex(item => !checkVal.split(',').includes(item[checkKey] + '')) != -1) {
                    message.warning(tipMsg)
                    return;
                }
            } else if (checkOnlyOne && listSelData.length > 1) {
                // 设置了checkOnlyOne 为true 的时候 进行只选一条数据的校验
                message.error('每次只能勾选一条数据');
                return;
            }
        }

        if (onClick) {
            // 走click 回调
            onClick(e)
            return
        }
        if (url) {
            return
        }

        Utils.modal({
            title: `是否${titleText || title}`,
            content,
            onOk: () => {
                // 兼容 字符串 和 函数的形式
                const isFunc = typeof method == 'function'
                let type, url
                if (!isFunc) {
                    const arr = getUrlType(method)
                    type = arr[0]
                    url = arr[1]
                }

                const [submitId, recordId] = unicode.split('|');
                if (rowData) {
                    params[submitId] = rowData[recordId] + ''
                } else {
                    params[submitId] = selectedRows.map(item => item[recordId]).join(',');
                }
                console.log(params,2222)
                if (childrenData) {
                    Object.getOwnPropertyNames(childrenData).forEach(function (key) {
                        params[key] = childrenData[key]
                    })
                }
                console.log(params,4444)
                return new Promise((resolve, reject) => {
                    (isFunc ? method(params) : request(type, url, params)).then(res => {
                        if (res.resultId == 1 || res.resultId == 200) {
                            if (showMessage) {
                                message.success(res.resultMsg);
                            }
                            changeSearch && changeSearch({ pageSize: 1 })
                            callback && callback(res)
                            setTimeout(resolve, 300); // 执行关闭弹框
                        } else {
                            message.error(res.resultMsg)
                            setTimeout(reject, 300); // 取消按钮loding
                        }
                    }).catch((e) => {
                        setTimeout(reject, 300); // 取消按钮loding
                    })
                })

            }
        })
    }

    render() {
        const _html = this.renderData(this.props.config);
        return (
            _html.length ? <Col> {_html} </Col> : null
        )
    }
}