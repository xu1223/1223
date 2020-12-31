import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';

import Setting from './setting'
import {
    Row,
    Col,
    Button,
    message

} from 'antd';
import api from "@/fetch"
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
        }
    }
    componentDidMount = () => {

    }
    batch_active = (val) => {
        const {
            batConfig
        } = this.context
        api.order.batch_active_product_template_theme({
            is_active: val,
            ids: batConfig.listSelData

        }).then((res) => {
            if (res) {
                message.success('修改成功')
                this.props.changeSearch()
            }
        })
    }
    render() {

        const _batProps = {
            config: [{
                title: '新增专题页',
                onAuth: 'add',
                noCheck: true,
                method: '',
                onClick: () => this.context.toggleWin('Setting',)
            }, {
                title: '删除',
                onAuth: 'del',
                type:"danger",
                method: 'POST /api/admin/batch_delete_product_template_theme',
            }, {
                title: '批量启用',
                onAuth: 'add',
                onClick: () => this.batch_active('1')
            }, {
                title: '批量禁用',
                onAuth: 'add',
                onClick: () => this.batch_active('0')
            },
            ],
            Arr:true,
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

                {this.context.Setting && <Setting changeSearch={this.props.changeSearch}></Setting>}
            </div>

        )
    }
}