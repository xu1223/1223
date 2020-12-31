import React, { Component } from 'react';
import {
    stringify
} from 'qs'
import { ListContext } from '@/config/context';
import Eddlist from './edit'
import Addlist from './add'
import BatOperation from '@/components/BatOperation';
import {
    Row,
    Col,
    Button,
} from 'antd';
import {
    getToken,
    baseUrl,
} from '@/util'
import api from 'fetch/api';
export default class Tool extends Component {
    static defaultProps = {};
    state = {}
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }

    downLoad = () => {
      
    }

    getMethodUrl = (method, params) => {
        let url = __DEV__ ? baseUrl(method) : '';
        url += `${method}?${params}`
        return url;
    }
    toggleWin = (type) => {
        this.context.toggleWin(type, {})
    }

    render() {

        const _batProps = {
            config: [{
                title: '新增',
                noAuth: 'add',
                noCheck: true,
                onClick: () => this.toggleWin('addshow')
            }, {
                title: '删除',
                noAuth: 'del',
                type:"danger",
                method: api.del_param_option,
                unicode: 'option_ids|id',
            }],
            method:'',
            unicode: 'option_ids|id',
            batConfig: this.context.batConfig,
        };
        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                </Row>
                {/* 新增编辑弹窗 */}
                {
                    this.context.addshow ? <Addlist /> : ''
                }
                {/* 添加数据弹窗 */}
                {
                    this.context.editshow ? <Eddlist /> : ''
                }

            </div>

        )
    }
}