import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import { DrawerComp } from '@/components/ModalComp2';
import api from '@/fetch/api'
import { post, get } from 'fetch/request'
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Table,
    message
} from 'antd';
import { compose } from 'redux';
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

class Shipments extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {

        }
        this.type = false
        if (props.id) {
            this.type = true
        }

        this.columns = [{
            title: 'SKU',
            dataIndex: 'zsku',
            width: 200,
        }, {
            title: '下单数量',
            dataIndex: 'quantity',
            width: 200,
        }, {
            title: '本次发货数量',
            dataIndex: 'quantity_shipped',
            width: 200,
            render: (text, record) => {
                let data = Number(record.quantity) - Number(record.quantity_shipped)
                return <div>
                    <Input disabled={this.type || data == 0} defaultValue={text} onChange={(value) => this.changeinput(value, record, data)} ></Input>
                </div>
            }
        }, {
            title: '剩余未发货数量',
            dataIndex: 'id',
            width: 200,
            render: (text, record) => {
                let data = Number(record.quantity) - Number(record.quantity_shipped)
                return <div>
                    {data}
                </div>
            }
        },]
    }
    // 限制发货数量
    changeinput = (e, record, data) => {
        if (Number(e.target.value) > Number(data)) {
            record['istest'] = 0
            message.error('发货数量不能超过剩余数量')
        } else {
            record['istest'] = Number(e.target.value)
        }

    }
    // 处理数据
    beforeCallback = (values, callback) => {
        const {
            tabledata
        } = this.state
        let param = {}
        let data = []  //发货数据
        let isdata = {}   //提交数据
        let order_id = ''  //订单id
        if (this.props.id) {  //判断订单id是否存在 不存在为新增
            order_id = this.props.id
            tabledata.map(item => {  
                data.push({ 
                    "order_product_id": item.order_product_id,
                    "quantity_shipped": item.quantity_shipped,
                    id: item.id
                })
            })
            isdata = {
                "shipment_method": values.shipment_method,
                "shipment_code": values.shipment_code,
                "order_product": data,
                id: this.context.shipmentsedit.id
            }
        } else {
            for (var i = 0; i < tabledata.length; i++) {  
                if (tabledata[i].istest > 0) {  //判断发货数量是否大于0
                    data.push({
                        "order_product_id": tabledata[i].order_product_id,
                        "quantity_shipped": tabledata[i].istest
                    })
                }else{
                    message.error('发货数量有误,请重新填写')
                    return false
                }

            }
            if (data.length == 0) {
                message.error('发货数量有误,请重新填写')
                return false
            }
            order_id = this.context.rowData.id
            isdata = {
                "shipment_method": values.shipment_method,
                "shipment_code": values.shipment_code,
                "order_product": data,
            }
        }
        param['shippings'] = []
        param['shippings'].push(isdata)
        param['order_id'] = order_id
        param['shippings'] = JSON.stringify(param['shippings'])

        setTimeout(() => {
            this.props.get_marked_deliver_goods_list()
        }, 2000)
        callback(param);
    }
    componentDidMount() {
        let order_id = ''
        if (this.props.id) {
            order_id = this.props.id
            this.setState({
                tabledata: this.context.shipmentsedit.shipping_detail
            })
        } else {
            order_id = this.context.rowData.id

            post(api.get_marked_deliver_goods_list, {
                order_id: order_id
            }).then(res => {
                if (res) {
                    this.setState({
                        tabledata: res.resultData ? res.resultData.to_be_shipped : []
                    })
                }
            })
        }

        post(api.get_all_geo_zone_name, {
        }).then(res => {
            if (res) {
                this.setState({
                    shipmentlist: res.resultData
                })
            }
        })
    }

    render() {
        const {
            shipmentlist = [],
            tabledata = [],
        } = this.state
        const {
            shipments,
            shipmentsedit = {},
            paylist
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: shipments,
            onCancel: () => this.context.toggleWin('shipments'),
            method: api.marked_deliver_goods,
            form: this.props.form,
            ...this.context.batConfig,
        };

        const {
            getFieldDecorator
        } = this.props.form;

        return <DrawerComp {...modalProp} >
            <Form>
                <FormItem label="物流单号：" {...formItemLayout4} >
                    {getFieldDecorator('shipment_code', {
                        initialValue: shipmentsedit.shipment_code || '',
                        rules: [{ required: true, message: '请填写物流单号' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="物流方式：" {...formItemLayout4} >
                    {getFieldDecorator('shipment_method', {
                        initialValue: shipmentsedit.shipment_method || '',
                        rules: [{ required: true, message: '请填写物流方式' }],
                    })(
                        <Select
                            showSearch
                            optionFilterProp='children'
                        >
                            {
                                shipmentlist.map(item => <Option name={item} value={item}>{item}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label="商品详情：" {...formItemLayout4} >
                    {getFieldDecorator('order_product', {
                    })(
                        <Table columns={this.columns} dataSource={tabledata} pagination={false} >

                        </Table>
                    )}
                </FormItem>
            </Form>
        </DrawerComp>
    }
}


export default Form.create()(Shipments)