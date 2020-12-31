import React, { Component } from 'react';
import {
    Row,
    Col,
    Skeleton,
    Form,
    Input,
    Select,
    DatePicker,
    Card,
    Button,
    message,
} from 'antd';
const FormItem = Form.Item
const {
    TextArea
} = Input;
const { Search } = Input;
const { Option } = Select;
import { ListContext } from '@/config/context'
import { formItemLayout3 } from '@/config/localStoreKey'
import api from 'fetch/api'
import { post, get } from '@/fetch/request'
import nodeimg from '../../../../../static/img/vip.png'
import Addmember from './addmember'
import moment from 'moment';
import Pay from '../Component/pay'
export default class StoreInfo extends Component {
    static contextType = ListContext;  //设置 上下文

    constructor(props, context) {
        super(props, context);
        this.state = {
            information: '',
            informationedit: '',
            orderstate: '未付款',
            type: false
        }

    }

    componentDidMount() {
        this.order_status_type()

    }
    // 初始化页面
    order_status_type = () => {
        let status = '未支付'
        if (this.context.order_status) {
        }
        this.setState({
            orderstate: status
        })
    }


    // 根据邮箱获取个人信息i
    Searchchange = (value) => {
        if (value == '') {
            message.warning('邮箱不能为空')
            return
        }
        get(api.get_customer_and_address, { email: value, default: 1 }).then(res => {
            if (res.resultData instanceof Array) {
                message.warning('没有此邮箱')

            } else {
                this.context.toggadder(res.resultData, true)
            }
        })
    }

    // 获取地址信息
    changeadder = (value, type) => {
        if (!type) {
            this.context.toggadder(value)
            this.setState({
                type: true
            })
        } else {

            this.context.information['addresses'] = value
            this.context.toggadder(this.context.information)
            this.setState({
                type: !this.state.type
            })
        }

    }

    // 渲染地址信息
    informationlist = value => {
        let {
            information
        } = this.context
        if (information.addresses instanceof Array) {
            information.addresses = information.addresses[0] || ''
        }
        return <div className="inforammain">
            <div className="top">
                <p>{information.lastname || '**'} {information.firstname || '**'}</p>
                <span>{information.email}</span>
                {
                    information.contactemail ? <p style={{ fontSize: '12px' }}>联系邮箱：{information.contactemail}</p> : ''
                }
            </div>
            <div className="bottom">
                {
                    information.addresses ? <div style={{ wordWrap: 'break-word;' }}>
                        {information.addresses.country_name} {information.addresses.zone_name} {information.addresses.city} {information.addresses.address_1}
                        {information.addresses.postcode} {information.addresses.mobile} {information.addresses.lastname} {information.addresses.firstname}
                    </div> : ''
                }

            </div>
            {
                this.context.operType == 'add' ? <i onClick={() => this.colse()} className="iconfont order-ico-qingkong close"></i> : ''
            }
            {
                (this.context.operType != 'check' && (this.context.order_status == 'unpaid' || this.context.operType == 'add')) ?
                    <Button round className="button" onClick={() => this.context.toggleWin('addvisible', { addmembder: this.state.information })} >修改信息</Button>
                    : ''
            }
        </div>
    }

    // 修改金额
    onBlur = (value, type) => {
        this.context.togginitData(value.target.value, type)
    }

    // 清空选择地址
    colse() {
        this.setState({
            information: '',
        })
        this.context.toggadder({})
    }

    // 标记已付款
    payvalues = value => {
        this.context.paydata(value)
        this.setState({
            orderstate1: '已付款'
        })
    }

    render() {
        const {
            loading,
            initData = {},//详情信息
            information,
            paylist,
            order_status,
            operType,
            get_manager_list = [],
            get_geo_zones_pager = [],
        } = this.context;
        const {
            form,
        } = this.props;
        let {
            orderstate,
            orderstate1
        } = this.state;
        const {
            getFieldDecorator,
        } = form;
        const req = true
        const isDisabled = operType == 'check'
        const tiemDisabled = operType != 'add'
        const discountDisabled = operType != 'edit'
        let total_price = 0
        if (initData.total_price) {
            total_price = parseFloat(initData.total_price).toFixed(2)
        }
        let text = order_status
        orderstate =
            text == 'processing' ? '处理中'
                : text == 'unpaid' ? '未支付'
                    : text == 'paid' ? '已支付'
                        : text == 'partial' ? '部分支付'
                            : text == 'shipped' ? '已发货'
                                : text == 'canceled' ? '已取消'
                                    : text == 'completed' ? '已完成'
                                        : text == 'refunded' ? '已退款'
                                            : text == 'partially_refunded' ? '部分退款' : '未支付'
        return <div className='card-body content-main-card'>

            <Card title={<span><i className='iconfont shop_ziyuan16'></i> 订单信息 </span>}>
                <Row type='flex' justify='space-between' style={{ padding: '40px 0' }}>
                    <Col span={6}>
                        {
                            operType == 'add' ? <div className='h-l-s'>
                                <Search
                                    placeholder=""
                                    onSearch={value => this.Searchchange(value)}
                                    style={{ marginRight: '10px' }}
                                /> <Button style={{ minWidth: '88px' }} type="primary" onClick={() => this.context.toggleWin('addvisible')} >添加会员</Button>
                            </div> : ''
                        }
                        <div>
                            {
                                operType == 'add' ? information.email ? this.informationlist() : <img src={nodeimg}></img> :
                                    this.informationlist(initData)
                            }

                        </div>
                    </Col>
                    <Col span={12}>
                        <Skeleton paragraph={{ rows: 3 }} loading={loading} >
                            <Row>
                                <Col span={12}>

                                    <FormItem {...formItemLayout3} label='订单编号'>
                                        <p style={{ color: '#C9C9C9' }}>{initData.invoice_no || '创建成功后自动生成系统订单编号'}</p>
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='下单时间'>
                                        {getFieldDecorator('created_at', {
                                            rules: [{ required: req, message: '请填写下单时间', }],
                                            initialValue: initData.created_at ? moment(initData.created_at, 'YYYY-MM-DD HH:mm:ss') : '',
                                        })(
                                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled={tiemDisabled} style={{ width: "100%" }} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='支付方式'>
                                        {getFieldDecorator('payment_method', {
                                            rules: [{ required: req, message: '请填写支付方式', }],
                                            initialValue: initData.payment_method || '',
                                        })(
                                            <Select getFieldDecorator={initData.payment_method} disabled={isDisabled} showSearch optionFilterProp='name'>
                                                {
                                                    paylist.map(item => {
                                                        return <Option name={item.label} value={item.value}>{item.label}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='物流方式'>
                                        {getFieldDecorator('shipment_method', {
                                            rules: [{ required: req, message: '请填写物流方式', }],
                                            initialValue: initData.shipment_method || '',
                                        })(
                                            <Select
                                                disabled={isDisabled}
                                                showSearch
                                                optionFilterProp='name'
                                            >
                                                {
                                                    get_geo_zones_pager.map(item => {
                                                        return <Option name={item} value={item}>{item}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='客服'>
                                        {getFieldDecorator('manager_id', {
                                            initialValue: initData.manager_id || '',
                                        })(
                                            <Select disabled={true} showSearch optionFilterProp='name'>
                                                {
                                                    get_manager_list.map(item => {
                                                        return <Option name={item.name} value={item.id}>{item.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='买家留言'>
                                        {getFieldDecorator('note', {
                                            initialValue: initData.note || '',
                                        })(
                                            <TextArea disabled={isDisabled} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem {...formItemLayout3} label='订单备注'>
                                        {getFieldDecorator('memo', {
                                            initialValue: initData.memo || '',
                                        })(
                                            <TextArea disabled={isDisabled} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Skeleton>
                    </Col>
                    <Col span={4}>
                        <div className='status-p'>
                            <div class="background-main">
                                <div class="b-m-h">
                                    <p>
                                        <span style={{ color: '#333333', fontSize: '14px', fontWeight: '500' }}>
                                            {orderstate1 ? orderstate1 : orderstate}

                                        </span>
                                    </p>

                                    {
                                        (operType == 'add' || (order_status == 'unpaid' && operType != 'check')) ?
                                            <span onClick={() => { this.context.toggleWin('visibleLog') }}>标记付款</span>
                                            : ''
                                    }
                                </div>
                                <div class="background-total">
                                    <div class="b-t-f">
                                        <p><label>商品总数：</label><span>{initData.total_number || 0}</span></p>
                                        <p><label>商品总重：</label><span>{initData.total_weight || 0}</span></p>
                                        <p><label>商品总额：</label><span>{initData.subtotal_price || 0}</span></p>

                                        <FormItem {...formItemLayout3} label='金额调整：'>
                                            {getFieldDecorator('total_discount', {
                                                initialValue: initData.total_discount || '',
                                            })(
                                                <Input disabled={discountDisabled} onBlur={value => this.onBlur(value, 'total_discount')} style={{ width: '85px' }} />
                                            )}
                                        </FormItem>

                                        <p><label>优惠劵金额：</label><span >{initData.coupon_history || 0}</span></p>
                                        <p><label>活动优惠金额：</label><span >{initData.activity_history || 0}</span></p>
                                        <FormItem {...formItemLayout3} label='运费：'>
                                            {getFieldDecorator('shipping_fee', {
                                                initialValue: initData.shipping_fee || '',
                                            })(
                                                <Input disabled={isDisabled} onBlur={value => this.onBlur(value, 'shipping_fee')} style={{ width: '85px' }} />
                                            )}
                                        </FormItem>
                                        <FormItem {...formItemLayout3} label='支付手续费：'>
                                            {getFieldDecorator('payment_fee', {
                                                initialValue: initData.payment_fee || '',
                                            })(
                                                <span>{initData.payment_fee || 0}</span>
                                                // <Input disabled={false} onBlur={value => this.onBlur(value, 'payment_fee')} style={{ width: '85px' }} />
                                            )}
                                        </FormItem>
                                        <p><label>实际支付金额：</label><span >{total_price}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
            {this.context.visibleLog && <Pay paystate={true} payvalues={this.payvalues} />}
            {this.context.addvisible && <Addmember changeadder={this.changeadder} />}
        </div >
    }
}
