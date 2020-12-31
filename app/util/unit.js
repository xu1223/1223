import React from 'react'
import {
    Icon,
    message,
    Popover,
    Tooltip,
    Modal,
    Tag,
    Button
} from 'antd';
const confirm = Modal.confirm;
import CopyToClipboard from 'react-copy-to-clipboard';

/**
 * 复制行内信息
 * @param {copy的标题和内容} text 
 * @param {copy的内容 如果 内容没有的时候 为 text} 
 */
export function giveCopy(text, content, key) {
    return [
        text,
        <CopyToClipboard text={content || text} key onCopy={() => { message.success('复制成功') }}>
            <Icon type="copy" style={{ fontSize: 16, color: '#08c', "marginLeft": 10, "cursor": "pointer" }} />
        </CopyToClipboard>
    ]
}

/**
 * 渲染气泡
 * @param {内容} text  要copy的内容
 * @param {标题} title  copy的标题 如果增加 则 copy 会限制高度 100px
 * @param {是否复制} unCopy  默认为false
 */
export function givePop(text, title = '', unCopy = false) {
    let key = ''
    if (text && typeof text == 'object') {
        key = text.key
        text = text.text
    }
    let content = !unCopy ? giveCopy(text) : text
    if (title) {
        content = <div style={{ maxHeight: 300, maxWidth: 400, overflowY: 'auto', overflowX: 'hidden' }}>{text}</div>
        title = giveCopy(title, text, key)
    }
    const _props = {
        content,
        title,
    }
    if (key) {
        _props.key = key
    }
    return text ? <Popover {..._props} ><div className="overflowTd">{text}</div></Popover> : ''
}

/**
 * 渲染a标签
 * @param {url} text 
 */
export function renderA(text) {
    return <div className="overflowTd"><a title={text} href={text} target="_blank">{text}</a></div>
}


function getHeight(btListHeight = 0, scrollTopHeight) {
    return window.innerHeight - (scrollTopHeight || 520) - (btListHeight ? -220 : 0);
}

// 获取表格的配置
export function getTableConfig(columns, scrollTopHeight) {
    let sumWidth = 0
    columns.map(item => {
        if (item.children) {
            item.children.map(_item => {
                sumWidth += parseInt(_item.width);
            })
        } else {
            sumWidth += parseInt(item.width);
        }
    })
    return {
        scrollXY: {
            x: sumWidth,
            y: getHeight(0, scrollTopHeight)
        }
    }
}



//将组件 绑定权限
export const wrapAuth = ComposedComponent => class WrapComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    getAuth(auth) {
        const { powerPrefix, powerKey } = this.props;
        let pageKey
        if (powerKey) {
            pageKey = powerKey
        } else {
            const _pageKey = location.hash.indexOf('?') > -1 ? location.hash.substr(2).split("/")[0].split('?')[0] : location.hash.substr(2).split("/")[0]
            pageKey = powerPrefix ? powerPrefix + '_' + _pageKey : _pageKey
        }
        return ((global.powerData && auth) && global.powerData[pageKey]) ? global.powerData[pageKey][auth] : false
    }
    render() {
        const {
            auth,
            noAuth,
            ..._props
        } = this.props;

        if (!(noAuth || this.getAuth(auth))) {
            _props.ghost = false
            _props.shape = ''
            _props.disabled = true
        }
        return <ComposedComponent  {..._props} />;
    }
}

export function powerShow(key, auth, string, delay) {
    if (!!delay) {
        setTimeout(() => {
            if (global.powerData[key] != undefined && global.powerData[key][auth] != undefined)
                return string
        }, delay)
    } else {
        if (global.powerData[key] != undefined && global.powerData[key][auth] != undefined)
            return string
    }

}