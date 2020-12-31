import React, { Component } from 'react';

import { ListContext } from '@/config/context';
import Addlist from './add'
import BatOperation from '@/components/BatOperation';
import {
    Row,
    Col,
} from 'antd';

import api from 'fetch/api';
export default class Tool extends Component {
    static defaultProps = {};
    state = {}
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
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
                title: '批量删除',
                noAuth: 'del',
                type:"danger",
                method: api.del_search,
                unicode: 'search_ids|id',
            }],
            method: '',
            unicode: 'search_ids|id',
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
        
            </div>

        )
    }
}