import React from 'react';
import { get, post } from '@/fetch/request'

import {
    Menu,
    Button,
    message,
    Row,
    Dropdown,
    Icon

} from 'antd';

export default class BatOperation extends React.Component {
    state = {
        downurl: ''
    }
    constructor(props, context) {
        super(props, context);

    }

    exportone = (config) => {   //点击渲染
        const {
            batConfig = {},     //选择表格内的数据
            noCheck,            //是否开启验证选择  true为关闭
            unicode = 'ids|id', //请求参数的id
            param = {}          //携带的请求参数
        } = this.props
        const { listSelData, selectedRows, changeSearch } = batConfig;
        let [submitId, recordId] = unicode.split('|');
        if (config.unicode) {    //诺数据内进行配置unicode。则优先取数据内的unicode
            [submitId, recordId] = config.unicode
        }
        if (!noCheck) {
            if (!listSelData.length) {
                message.warning('请勾选列表,再进行操作');
                return;
            } else {
                config.param[submitId] = listSelData.toString()
            }
        }
        let url = ''   //最后的请求链接
        if (config.type == 'get') {
            let param = '&access_token=' + localStorage.getItem('accessToken')
            if (config.param) {
                for (let key in config.param) {
                    param = param + '?' + key + '=' + config.param[key]
                }
            }
            url = process.env['APP_HOST_URL_API_ADMIN'] + config.method + param
            this.setState({
                downurl: url
            }, () => {
                this.refs.dowlink.click();
            });
        } else {
            post(config.method, { ...config.param }).then(res => {
                if (res) {
                    if (res.resultId == 200) {
                        const token = '&access_token=' + localStorage.getItem('accessToken')
                        if (res.resultData.url) {   //配置后端返回数据的类型
                            url = res.resultData.url + token
                        } else if (res.resultData.urls[0]) {
                            url = res.resultData.urls[0] + token
                        }
                        this.setState({
                            downurl: url
                        }, () => {
                            this.refs.dowlink.click();
                        });
                    }
                }
            })
        }
    }
    //多个按钮点击事件
    handleMenuClick = (item) => {
        this.exportone(item.item.props.config)
    }
    //渲染按钮
    exportbutton = (data) => {
        let button = ''
        if (data.children) {
            let menu = <Menu onClick={this.handleMenuClick}>
                {
                    data.children.map(item => {    //判断children是否携带参数，携带参数优先使用
                        item.method = item.method ? item.method : data.method
                        item.type = item.type ? item.type : data.type
                        item.param = item.param ? item.param : data.param
                        item.unicode = item.unicode ? item.unicode : ''
                        return <Menu.Item key={item.title} disabled={item.disabled} config={item} > {item.title}</Menu.Item>
                    })
                }
            </Menu>
            button = <Dropdown overlay={menu}>
                <Button type="primary" >
                    {data.title} <Icon type="down" />
                </Button>
            </Dropdown>
        } else {
            button = <Button type="primary" disabled={!data.disabled} onClick={() => this.exportone(data)}>{data.title}</Button>
        }
        return button
    }


    render() {
        const button = this.exportbutton(this.props.config);
        return (
            <Row type="flex" justify="start" align='middle'>
                <a href={this.state.downurl} style={{ display: 'none' }} ref="dowlink"></a>
                {button}
            </Row>
        )
    }
}