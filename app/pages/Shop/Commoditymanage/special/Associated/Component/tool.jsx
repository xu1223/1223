import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import {
    Row,
    Col,
    message,
} from 'antd';
import Addthegoods from './addthegoods/index'
import api from '@/fetch/api';
import fetch from '@/fetch';
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            Checkboxdata: []
        }
    }
    componentDidMount = () => {
    }
    tablist = () => {

    }
    setSelectRows = (value, val) => {
        if (value) {
            let ids = []
            value.map((item) => {
                ids.push(item.id)
            })
            fetch.order.add_collection_associated_products({
                product_ids: ids,
                collection_id: this.context.id
            }).then((res) => {
                if (res) {
                    message.success('添加成功')
                    this.context.changeSearch()
                }
            })
        }

    }
    render() {
        const _batProps = {
            config: [{
                title: '添加关联',
                onAuth: 'add',
                noCheck: true,
                method: '',
                onClick: () => this.context.toggleWin('visibleAddShops')
            },
            {
                title: '解除关联',
                onAuth: 'add',
                method: api.remove_collection_associated_products,
            },
            ],
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

                {this.context.visibleAddShops && <Addthegoods visibleAddShops={this.context.visibleAddShops} setSelectRowsadd={this.setSelectRows} toggleWin={this.context.toggleWin}></Addthegoods>}
            </div>

        )
    }
}