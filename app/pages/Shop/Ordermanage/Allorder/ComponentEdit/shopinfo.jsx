import React, { Component } from 'react';
import api from '@/fetch/api';
import { get } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout1 } from 'config/localStoreKey';
import BatOperation from '@/components/BatOperation';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Table,
} from 'antd';
import Tool from './tool.jsx'

const FormItem = Form.Item;
const Option = Select.Option

class editadder extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedRowKeys: [],
            type: true,
            columnstype: true
        }
        this.columns = [{
            title: '图片',
            dataIndex: 'img_m',
            width: 80,
            render: (text, record, index) => {
                return (
                    <a href={record.image}><img src={text} style={{ width: '60px' }} /></a>
                )
            }
        }, {
            title: '商品信息',
            dataIndex: 'sku',
            width: 150,
            render: (text, row, index) => {
                return (
                    <div>
                        <p>SKU:{row.sku}</p>
                        <p>COLOR:{row.color}</p>
                        <p>SIZE:{row.size}</p>
                    </div>
                )
            }
        }, {
            title: '商品名称',
            dataIndex: 'name',
            width: 300,
            render:(text, record)=>{
               return <a target="_blank" href={record.product_url}>{text}</a>
            }
        },
        {
            title: '重量（KG）',
            dataIndex: 'weight',
            width: 200,
        },
        {
            title: '重量小计（KG）',
            dataIndex: 'total_weight',
            width: 200,
            render: (text, row, index) => {
                return (
                    <div>
                        {text}
                    </div>
                )
            }
        },

        {
            title: '商品销售价格(USD)',
            dataIndex: 'price',
            width: 200,
            render: (text, row, index) => {
                let data = '';
                data = parseFloat(text).toFixed(2)
                return <span>{data}</span>
            }
        }, {
            title: '商品展示价格(USD)',
            dataIndex: 'show_price',
            width: 200,
            render: (text, record) => {
                let data = '';
                data = parseFloat(text).toFixed(2)
                return <span>{data}</span>
            },
        },
        {
            title: '商品成交价格(USD)',
            dataIndex: 'transactionprice',
            width: 200,
            render: (text, record, index) => {
                let price =  text ? text  : record.price 
                return <span>
                    <Input  disabled={this.context.operType == 'check' || this.context.order_status =='paid'}  value={price} onChange={(value) => this.onBlurprice(value, record, index)} ></Input>
                </span>
            },

        }, {
            title: '下单数',
            dataIndex: 'quantity',
            width: 200,
            render: (text, record, index) => {
                return <span>
                    <Input disabled={this.context.operType == 'check'  || this.context.order_status =='paid'}  defaultValue={text} onBlur={(value) => this.onBlur(value, record, index)} ></Input>
                </span>
            },
        },
        {
            title: '合计',
            dataIndex: 'color',
            width: 200,
            render: (text, record) => {
                let price  =  record.transactionprice ? record.transactionprice * record.quantity : record.price * record.quantity
                let show_price = record.price * record.quantity
                price = Number(price) * 100  / 100
                show_price = Number(show_price) * 100  / 100
                return <span>
                    <p>销售价：{show_price}</p>
                    <p>成交价：{price}</p>
                </span>
            },
        },

        ];

        this._batProps = (rowData, index) => {
            let obj = {
                config: [
                    {
                        title: '移除',
                        noCheck: true,
                        size: 'small',
                        ghost: true,
                        onClick: () => this.colse(rowData, index)
                    },
                ],
                rowData,
                unicode: 'id|id',
                batConfig: {
                    listSelData: [],
                    selectedRows: []
                }
            }
            return obj
        }
    }
    // 移除该商品
    colse = (value, index) => {
        this.context.shopdata.splice(index, 1)
        this.context.shopedit(this.context.shopdata)
    }
        // 修改成交价格
    onBlurprice = (value, row, index) => {
 
        row['transactionprice'] = value.target.value
        this.context.shopdata[index]['transactionprice'] = value.target.value
        console.log(value.target.value,this.context.shopdata[index]['transactionprice'],'2222222')
        this.context.shopedit(this.context.shopdata)
    }

    // 修改下单数
    onBlur = (value, row, index) => {
        this.context.shopdata[index]['total_weight'] = parseFloat(value.target.value * row['weight']).toFixed(2)
        this.context.shopdata[index]['quantity'] = value.target.value
        this.context.shopedit(this.context.shopdata)
    }

    componentDidMount() {

    }
    // 商品选中获取商品
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('shopinfo');
    }

    render() {
        const {
            selectedRowKeys,
            columnstype
        } = this.state;
        const {
            shopdata = [],
            order_status,
            operType
        } = this.context;
        const {
            rowData = {},
        } = this.props
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        if (columnstype) {
            if ( operType != 'check' &&  (this.context.order_status == 'unpaid' || this.context.operType == 'add')) {
                this.setState({
                    columnstype: false
                })
                this.columns.push({
                    title: '操作',
                    dataIndex: "id",
                    ColSpan: 0,
                    width: 100,
                    fixed: 'right',
                    render: (text, record, index) => {
                        return (<div className='operatingButton' style={{ display: 'flex' }}>
                            <BatOperation {...this._batProps(record, index)} />
                        </div>)
                    }
                })
            }
        }

        return (
            <div className="allmain">
                {
                    ( operType != 'check' &&  (order_status == 'unpaid' || operType == 'add')) ?
                        <Tool selectedRowKeys={selectedRowKeys}>

                        </Tool>
                        : ''
                }

                <Table style={{ marginTop: '20px' }} rowSelection={rowSelection} pagination={false} columns={this.columns} dataSource={shopdata} />
            </div>
        )
    }
}

export default Form.create()(editadder)