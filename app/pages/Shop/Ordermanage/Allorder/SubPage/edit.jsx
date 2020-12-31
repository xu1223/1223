import React, {
    Component
} from 'react';
import {
    Form,
    Tabs,
    Button,
    message,
    Col,
    Row,
    Table
} from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListContext } from '@/config/context'
import BaseInfo from '../ComponentEdit/baseInfo'
import { post, get } from 'fetch/request'
import api from 'fetch/api'
import '../index.less'
import Shopinfo from '../ComponentEdit/shopinfo'
import moment from 'moment';
import Shipments from '../Component/shipments'
import BatOperation from '@/components/BatOperation';
const { TabPane } = Tabs;
class orderEdit extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false, //添加商品弹窗
            loading: true,
            addvisible: false,
            shopinfo: false,
            addshop: false,
            paylist: [],
            information: {},
            shopdata: [],
            initData: {},
            paydata: ''
        }
        const { type, id } = props.params
        this.operType = type
        this.id = id == '0' ? parseInt(id) : id
        this.batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    noCheck: true,
                    ghost: true,
                    onClick: () => {
                        this.edit_shop(rowData)
                    }
                },],
                unicode: 'order_id|id',
                batConfig: {
                    listSelData: [],
                    selectedRows: []
                },
                rowData
            }
        };
        this.columns2 = [{
            title: '交易ID',
            dataIndex: 'payment_code',
            width: 200,
        }, {
            title: '交易金额',
            dataIndex: 'total_price',
            width: 200,
        }, {
            title: '币种',
            dataIndex: 'code',
            width: 200,
        }, {
            title: '交易时间',
            dataIndex: 'payment_time',
            width: 200,
        }, {
            title: '交易方式',
            dataIndex: 'payment_method',
            width: 200,
        }, {
            title: '手动标记付款',
            dataIndex: 'payment_status',
            width: 200,
            render: (text, record) => {
                let data = text == 'manual_paid' ? '是' : '否'
                return <div>
                    {data}
                </div>
            }
        }, {
            title: '交易备注',
            dataIndex: 'receipt_remarks',
            width: 200,
        }]
        this.columns3 = [{
            title: '物流单号',
            dataIndex: 'shipment_code',
            width: 200,
        }, {
            title: '物流方式',
            dataIndex: 'shipment_method',
            width: 200,
        }, {
            title: '发货时间',
            dataIndex: 'sent_at',
            width: 200,
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            render: (text, record) => {
                return <BatOperation {...this.batProps(record)} />
            }
        },
        ]
        this.columns4 = [{
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

    componentDidMount() {
        //获取详情
        if (this.id) {
            get(api.get_order, { order_id: this.id }).then(res => {
                if (res) {
                    const initData = res.resultData
                    let isdata = {}
                    let shopdata = []
                    isdata['id'] = initData['id']
                    isdata['order_status'] = initData['order_status']
                    isdata['payment_method'] = initData['payment_method']
                    isdata['created_at'] = initData['created_at']
                    isdata['shipment_method'] = initData['shipment_method']
                    isdata['manager_id'] = initData['manager_id']
                    isdata['note'] = initData['note']
                    isdata['memo'] = initData['memo']
                    isdata['total_number'] = initData['total_number'] || 0
                    isdata['total_weight'] = initData['total_weight'] || 0
                    isdata['subtotal_price'] = initData['subtotal_price'] || 0
                    isdata['total_discount'] = initData['total_discount'] || 0
                    isdata['coupon_history'] = initData['coupon_history'] ? initData['coupon_history'].amount : 0
                    isdata['activity_history'] = initData['activity_history'] ? initData['activity_history'].amount : 0
                    isdata['shipping_fee'] = initData['shipping_fee'] || 0
                    isdata['payment_fee'] = initData['payment_fee'] || 0
                    isdata['total_price'] = initData['total_price'] || 0
                    isdata['invoice_no'] = initData['invoice_no'] || ''
                    this.toggshop(initData.products)
                    let information = {
                        id: initData.customer_id,
                        firstname: "",
                        lastname: "",
                        email: initData.email,
                        avatar: "",
                        addresses: [{
                            customer_id: initData.id,
                            firstname: initData.shipment_firstname,
                            lastname: initData.shipment_lastname,
                            mobile: initData.shipment_mobile,
                            address_1: initData.payment_address_1,
                            city: initData.shipment_city,
                            postcode: initData.shipment_postcode,
                            country_id: initData.shipment_country_id,
                            zone_id: initData.shipment_zone_id,
                        }]
                    }
                    this.setState({
                        loading: false,
                        information: information,
                        initData: isdata,
                        order_status: initData.order_status,
                        table2: [{
                            payment_code: initData['payment_code'],
                            total_price: initData['total_price'],
                            code: 'USD',
                            payment_time: initData['payment_time'],
                            payment_method: initData['payment_method'],
                            payment_status: initData['payment_status'],
                            receipt_remarks: initData['receipt_remarks'],
                        }]
                        // initData
                    })
                    // this.props.setData(initData.apply_detail)
                    // this.onChangePlat(initData.platform)
                }
            })
            this.get_marked_deliver_goods_list()

        } else {
            this.setState({
                loading: false,
            })
        }
        get(api.get_pay_method, {}).then(res => {
            if (res) {
                const { data } = res
                this.setState({
                    paylist: res.resultData
                })

            }
        })

        post(api.get_countrys_list, {
        }).then(res => {
            if (res) {
                this.setState({
                    storagecountry: res.resultData ? res.resultData : []
                })
            }
        })
        post(api.get_all_geo_zone_name, {

        }).then(res => {
            if (res) {
                this.setState({
                    get_geo_zones_pager: res.resultData ? res.resultData : []
                })
            }
        })

        post(api.get_manager_list, {
        }).then(res => {
            if (res) {
                this.setState({
                    get_manager_list: res.resultData ? res.resultData : []
                })
            }
        })


    }
    get_marked_deliver_goods_list() {
        post(api.get_marked_deliver_goods_list, {
            order_id: this.id
        }).then(res => {
            if (res) {
                this.setState({
                    table3: res.resultData ? res.resultData.order_shippings : [],
                    table4: res.resultData ? res.resultData.to_be_shipped : []
                })
            }
        })
    }

    onChangePlat = (value) => {
        const platform = Array.isArray(value) ? value.join(',') : value
        post(api.getAllStoreList, { platform }).then(res => {
            console.log(res)
            this.setState({
                storeList: res.resultData.data.list
            })
        })
    }

    componentWillUnmount() {
        // this.props.clearData()

    }
    toggadder = (value) => {
        console.log(value, 2224444444222)
        this.setState({
            information: value
        })
    }  //获取地址

    toggshop = (value) => {
        let param = this.state.shopdata

        if (value.length != 0) {
            value.map(item => {
                item['transactionprice'] = item.price 
            })
            param.push(...value)
            this.number(param)
            this.setState({
                shopdata: param,
            })
        }
    }

    shopedit = (value) => {
        console.log(value, '===========')
        this.setState({
            shopdata: value
        })
        this.number(value)
    }

    number = (param) => {
        let initData = this.state.initData
        initData['total_number'] = ''
        initData['total_weight'] = ''
        initData['subtotal_price'] = ''
        param.map(item => {
            initData['total_number'] = Number(initData['total_number'] || 0) + Number(item['quantity'])
            initData['total_weight'] = (Number(initData['total_weight'] || 0) + Number(item['total_weight']))
            initData['subtotal_price'] = Number(initData['subtotal_price'] || 0) + Number(item['transactionprice'])

        })
        initData['total_price'] = Number(initData['subtotal_price'] || 0) - Number(initData['coupon_history'] || 0)
            - Number(initData['activity_history'] || 0) + Number(initData['payment_fee'] || 0) + Number(initData['shipping_fee'] || 0)
            + Number(initData['total_discount'] || 0)

        initData['total_weight'] = Math.round(initData['total_weight'] * 100) / 100;
        initData['subtotal_price'] = Math.round(initData['subtotal_price'] * 100) / 100;
        initData['total_price'] = Math.round(initData['total_price'] * 100) / 100;
        this.setState({
            initData: initData
        })
    }
    togginitData = (value, index) => {
        let initData = this.state.initData
        initData[index] = value
        initData['total_price'] = Number(initData['subtotal_price'] || 0) - Number(initData['coupon_history'] || 0)
            - Number(initData['activity_history'] || 0) + Number(initData['payment_fee'] || 0) + Number(initData['shipping_fee'] || 0)
            + Number(initData['total_discount'] || 0)
        if (Number(initData['total_price']) < 0) {
            message.error('优惠金额不能超过支付金额')
            return false
        }
        this.setState({
            initData: initData
        })
    }
    edit_shop = (rowData) => {
        if (this.state.order_status == 'completed') {
            message.error('完成订单无法发货')
            return false
        }
        this.toggleWin('shipments', {
            shipmentsedit: rowData
        })
    }
    // 共享 tool 和index 
    toggleWin = (key = 'visible', cotherConfig = {}) => {
        let { otherConfig = {} } = this.state;
        otherConfig = {
            ...otherConfig,
            ...cotherConfig,
            [key]: !this.state[key]
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig,
        })
    }

    closePage = () => {
        this.props.goBack();
    }
    shopclose = () => {
        this.props.goBack();
    }
    paydata = (value) => {
        this.setState({
            paydata: value
        })
    }
    handleSubmit = () => {
        const {
            information,
            shopdata,
            paydata
        } = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (shopdata.length == 0) {
                    message.error('请选择商品')
                    return false
                }

                if (!information.email) {
                    message.error('请填写收货地址')
                    return false
                }
                let param = values
                for (let k in values) {
                    if (values[k]) {
                        param[k] = values[k]
                    }
                }
                param['products'] = []
                shopdata.map(item => {
                    param['products'].push({
                        "id": item.id ? item.id : 0,
                        "product_id": item.product_id,
                        "option_value_name": item.size,
                        "quantity": item.quantity,
                        "price": item.transactionprice ? item.transactionprice : item.price,
                    })
                })
                if (paydata) {
                    for (let k in paydata) {
                        if (paydata[k]) {
                            param[k] = paydata[k]
                        }
                    }

                    param['order_status'] = 'paid'
                }


                param['customer_id'] = information['id'] || information['customer_id']
                param['email'] = information['email']
                param['shipment_firstname'] = information.addresses['firstname']
                param['shipment_lastname'] = information.addresses['lastname']
                param['shipment_mobile'] = information.addresses['mobile']
                param['shipment_country_id'] = information.addresses['country_id']
                param['shipment_zone_id'] = information.addresses['zone_id']
                param['shipment_address_1'] = information.addresses['address_1']
                param['shipment_city'] = information.addresses['city']
                param['shipment_postcode'] = information.addresses['postcode']
                param['created_at'] = moment(param['created_at']).format('YYYY-MM-DD HH:mm:ss')
                param['products'] = JSON.stringify(param['products'])
                param['payment_name'] = param['shipment_firstname'] + param['shipment_lastname']
                if (!param['payment_time'] && param['payment_code']) {
                    param['payment_time'] = moment().format('YYYY-MM-DD HH:mm:ss')
                }

                if (this.id != 0) {
                    param['order_id'] = this.id
                }

                post(api.save_order, param).then(res => {
                    if (res) {
                        if (res.resultId == 200) {
                            message.success(res.resultMsg)
                            this.props.goBack();
                        } else {
                            message.error(res.resultMsg)
                        }
                    }
                })
            }
        })
    }
    _batProps = (rowData) => {
        return {
            config: [
                {
                    title: '保存',
                    noCheck: true,
                    ghost: true,
                    visible: this.operType != 'check',
                    onClick: () => { this.handleSubmit() }
                }, {
                    title: '更多',
                    noCheck: true,
                    ghost: true,
                    visible: this.operType == 'check',
                    children: [
                        {
                            title: '星标订单',
                            visible: rowData.order_status == 'unpaid' || rowData.order_status == 'paid',
                            onAuth: 'add',
                            method: api.add_star_order
                        }, {
                            title: '取消订单',
                            visible: rowData.order_status == 'unpaid' || rowData.order_status == 'paid',
                            onAuth: 'add',
                            method: api.order_cancle
                        }, {
                            title: '完成订单',
                            visible: rowData.order_status == 'completed',
                            onAuth: 'add',
                            method: api.finish_order
                        }, {
                            title: '激活订单',
                            visible: rowData.order_status == 'canceled',
                            onAuth: 'add',
                            method: api.activation_order
                        }, {
                            title: '催款通知',
                            visible: rowData.order_status == 'unpaid',
                            onAuth: 'add',
                            method: api.send_payment_notice
                        }, {
                            title: '收款通知',
                            visible: rowData.order_status == 'paid',
                            onAuth: 'add',
                            method: api.send_confirm_payment
                        }, {
                            title: '发货通知',
                            visible: rowData.order_status == 'shipped',
                            onAuth: 'add',
                            method: api.send_deliver_goods_notice
                        }
                    ]
                }, {
                    title: '关闭',
                    noCheck: true,
                    ghost: true,
                    onClick: () => { this.shopclose() }
                },],
            unicode: 'order_id|id',
            batConfig: {
                listSelData: [],
                selectedRows: []
            },
            rowData
        }
    };

    render() {
        const {
            loading,
            initData = {},//详情数据
            paylist,
            addvisible,
            zoneArea,
            storagecountry,
            shopinfo,   //
            information,
            addshop,
            order_status,
            table4,
            table2 = [],
            table3,
        } = this.state;
        const { form, local = {} } = this.props;
        const contextProps = {
            toggleWin: this.toggleWin,
            operType: this.operType,
            initData,
            order_status,
            addvisible,
            batConfig: this.props.batConfig,
            shopinfo,
            get_manager_list: this.state.get_manager_list,
            loading,
            paylist: paylist,
            get_geo_zones_pager: this.state.get_geo_zones_pager,
            platData: local.platData,
            closePage: this.closePage,
            togginitData: this.togginitData,
            information: information,
            toggadder: this.toggadder,
            shopdata: this.state.shopdata,
            toggshop: this.toggshop,
            shopedit: this.shopedit,
            paydata: this.paydata,
            zoneArea,
            addshop,
            storagecountry,
            ...this.state.otherConfig,
        }
        return (
            <div style={{ marginTop: 0, paddingBottom: 80 }}>
                <ListContext.Provider value={contextProps}>
                    <Form
                        onFinish={this.shopclose}
                        onSubmit={this.handleSubmit}>
                        <BaseInfo form={form} onChangePlat={this.onChangePlat} />
                        <div className="tabSwitching">
                            <Tabs
                                defaultActiveKey="1"
                            >
                                <TabPane key="1" tab={<span><i style={{ marginRight: '3px' }} className={'iconfont ' + 'order-ico-dingdanhuoqu' + ''}></i>商品信息</span>} >
                                    <Shopinfo />
                                </TabPane>
                                {
                                    this.operType == 'check' ?
                                        <TabPane key="2" tab={<span><i style={{ marginRight: '3px' }} className={'iconfont ' + 'order-ico-shouru' + ''}></i>支付信息</span>} >
                                            <div className="allmain">
                                                <Table columns={this.columns2} dataSource={table2} pagination={false} >

                                                </Table>
                                            </div>
                                        </TabPane>
                                        : ''
                                }
                                {
                                    this.operType == 'check' ?
                                        <TabPane key="3" tab={<span><i style={{ marginRight: '3px' }} className={'iconfont ' + 'order-ico-xiugaiwuliu' + ''}></i>物流信息</span>} >
                                            <Row span={24} className="allmain">
                                                <Col span={12} style={{ padding: "0 20px" }}>
                                                    <Table pagination={false} columns={this.columns3} dataSource={table3} >

                                                    </Table>
                                                </Col>
                                                <Col span={12} style={{ padding: "0 20px" }}>
                                                    <Table pagination={false} columns={this.columns4} dataSource={table4} >

                                                    </Table>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        : ''
                                }
                            </Tabs>
                        </div>

                        <div className="shop-footer-btn">
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'flex-end' }}>

                                <BatOperation style={{ display: 'flex', justifyContent: 'flex-end' }}  {...this._batProps(initData)} />

                            </div>
                        </div>
                    </Form>
                    {this.state.shipments && <Shipments id={this.id} get_marked_deliver_goods_list={this.get_marked_deliver_goods_list} />}
                </ListContext.Provider>
            </div>
        )
    }
}

export default Form.create()(orderEdit)
