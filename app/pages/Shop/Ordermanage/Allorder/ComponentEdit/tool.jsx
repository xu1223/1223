import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import FileWrap from 'components/UpAndDown/index';
import p_template from '@/static/file/p_template.xlsx'
import {
    Row,
    Col,
    message,

} from 'antd';
import api from "@/fetch/api"
import { get } from '@/fetch/request'
import Addshop from './add/index'
import Cart from './cart'
export default class Tool extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.columns = {

        }
    }
    add = () => {

    }
    colse = () => {
        const {
            selectedRowKeys
        } = this.props
        console.log(selectedRowKeys, 'key', this.context)
        let data = []
        let param = []
        data = JSON.parse(JSON.stringify(this.context.shopdata))
        selectedRowKeys.map(item => {
            delete data[item];
        })

        data.map(item => {
            if (item) {
                param.push(item)
            }
        }
        )
        this.context.shopdata = param
        this.context.shopedit(this.context.shopdata)
    }
    filedata = (selectedRows) => {
        console.log(selectedRows, '=22222')
        const {
            shopdata
        } = this.context
        let param = []
        selectedRows.map(item => {
            shopdata.map(v => {
                if (v.product_id == item.product_id) {
                    item['isshow'] = true
                }
            })

            if (!item['isshow']) {
                item['id'] = 0
                item['quantity'] = 1
                item['transactionprice'] = item['quantity'] * item['price']
                item['total_weight'] = item['quantity'] * item['weight']
                param.push(item)
            }
        })
        this.context.toggshop(param)
    }
    render() {
        const {
            activeKey,
            shoptable = []
        } = this.context;
        const batConfig = {
            listSelData: [],
            selectedRows: []
        }
        const _batProps = {
            config: [{
                title: '添加商品',
                onAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('addshop')
            }, {
                title: '移除商品',
                onAuth: 'add',
                noCheck: true,
                onClick: () => this.colse()
            }, {
                title: '引用购物车商品',
                onAuth: 'add',
                noCheck: true,
                onClick: () => this.context.toggleWin('visibleMark')
            },
            ],
            unicode: 'order_id|id',
            batConfig: batConfig,
        };

        return (
            <div className='action-bar'>
                <Row type="flex" justify='space-between' align='middle' gutter={10}>
                    <Col>
                        <div style={{ display: 'flex' }}>
                            <BatOperation {..._batProps} />
                            <div style={{ marginLeft: '10px' }}>
                                <FileWrap
                                    upLoadUrl="/api/admin/batch_add_product_to_order"
                                    title="导入商品"
                                    name='file'
                                    upLoadFile={p_template}
                                    uploadParamas={{ access_token: localStorage.getItem('ACCESS_TOKEN') }}
                                    showImportBtn={true}
                                    filedata={(data) => this.filedata(data)}
                                />
                            </div>
                        </div>
                    </Col>

                </Row>
                {
                    this.context.addshop && <Addshop
                        toggshop={this.context.toggshop}
                        shopdata={this.context.shopdata}
                        addshop={this.context.addshop} toggleWin={this.context.toggleWin}></Addshop>
                }

                {
                    this.context.visibleMark && <Cart></Cart>
                }
            </div>

        )
    }
}