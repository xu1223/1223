import React, { Component } from 'react';
import {
	stringify
} from 'qs'
import api from '@/fetch/api';
import { ListContext } from '@/config/context';
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

export default class Tool extends Component {
    static defaultProps = {};
    state = {}
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }

   

    render() {

        const _batProps =  {
            config: [{
                title: '新增',
                noAuth: 'add',
                noCheck: true,
                onClick:() => this.context.Jumppage('', 'add')
            },  {
                title: '删除',
                noAuth: 'del',
                type:'danger',
                method: api.del_filter,
                unicode: 'ids|id',
            }],
            method: '',
            unicode: 'ids|id',
            batConfig: this.context.batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <BatOperation {..._batProps} />
                    </Col>
                </Row>
            </div>

        )
    }
}