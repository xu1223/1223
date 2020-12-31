import React, { Component } from 'react';
import api from '@/fetch/api';
import { ListContext } from '@/config/context';
import menberifo from '../../../../../../public/img/menberifo.png'
import Renderpass from './renderpass';
import Editaddress from './editaddress'
import { get } from '@/fetch/request'
import {
    Row,
    Col,
    Form,
    Input,
    message,
    Select,
    Tooltip
} from 'antd';
const Option = Select.Option

class rendertool extends Component {
    static defaultProps = {};
    static contextType = ListContext;

    constructor(props, context) {
        super(props, context);
        this.state = {
            type: true
        }

    }

    componentDidMount() {
    }
    savecustomer(param) {    //设置会员和设置等级
        get(api.save_customer, param).then(res => {
            if (res.resultId == 200) {
                message.success('编辑成功');
            }
        })
    }
    edittype = (value) => {  //处理编辑数据，重新回显数据
        const {
            type
        } = this.state
        get(api.get_customer, { customer_id: this.context.id }).then(res => {
            if (res) {
                this.context.initData = res.resultData
                this.setState({
                    type: !type,
                })
            }
        })
    }
    changeSearch(data, type, id) {  //多个编辑处理
        if (type == 1) {  //电子订阅取消改功能 预留位置

        } else if (type == 2) { // 设置会员
            let param = {
                customer_id: id,
                customer_group_id: type
            }
            this.savecustomer(param)
        } else if (type == 3) { //设置等级
            let param = {
                customer_id: id,
                manager_id: type
            }
            this.savecustomer(param)
        } else if (type == 4) {  //设置密码
            this.context.toggleWin('visible');
        } else if (type == 5) {  //设置地址
            this.context.toggleWin('addershow');
        }

    }



    render() {
        const {
            storagemanager = [],
            storagegroup = [],
        } = this.props
        const {
            initData = {},
        } = this.context;
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        let subscription = [{
            name: '是',
            id: 1
        }, {
            name: '否',
            id: 0
        }]
        return (<div className="RightToolWrap" ref={(input) => { this.textInput = input; }}>
            <Row>
                <Col span={16}>
                    <div className="Memberoverview">
                        <div className="title">
                            会员概况 {this.state.type}
                        </div>
                        <div className="cont">
                            <div className="item">
                                <div className="top">
                                    <p>订单总额</p>
                                    <img src={menberifo}></img>
                                </div>
                                <div className="bottom">
                                    <p><span>{initData.order_total_price}</span></p>
                                    <p>下单总数 {initData.order_total_count} </p>
                                </div>
                            </div>
                            <div className="item">
                                <div className="top">
                                    <p>平均订单金额</p>
                                    <img src={menberifo}></img>
                                </div>
                                <div className="bottom">
                                    <p><span>{initData.avg_order_price}</span></p>
                                </div>
                            </div>
                            <div className="item itemfont" style={{ boxShadow: 'none' }}>
                                <p><span>注册时间 ：</span>{initData.created_at}</p>
                                <p><span>最近登录时间 ：</span>{initData.logined_at}</p>
                                <p><span>最近加购时间 ：</span>{initData.lately_add_cart_time}</p>
                                <p><span>最近下单时间 ：</span>{initData.lately_add_order_time}</p>
                                <div className="itemdays">
                                    会员{initData.register_days}天
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={8}>
                    <div className="Memberinfo" style={{ marginRight: '0' }}>
                        <p className="top">{initData.email} <img style={{ width: '30px' }} src={initData.country_flag}></img></p>
                        <Form  {...layout}    >
                            <Col span={12}>
                                <Form.Item label="渠道来源" >
                                    <span>
                                        {initData.channel_name ? initData.channel_name : ''}
                                    </span>

                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <p className="edit" onClick={() => this.changeSearch(1, 4, initData.id)} >设置</p>
                            </Col>
                            <Col span={24}>
                                <Col span={12}>
                                    <Form.Item name="price" label="电子订阅" >
                                        {
                                            initData.newsletter == 0 || initData.newsletter == 1 ? <Select disabled defaultValue={initData.newsletter} onChange={(value) => this.changeSearch(value, 1, initData.id)} showSearch optionFilterProp='children' >
                                                {
                                                    subscription.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                                }
                                            </Select> : ''
                                        }

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="会员等级" >
                                        {
                                            (initData.customer_group_id || initData.customer_group_id == 0) ? <Select onChange={(value) => this.changeSearch(value, 2, initData.id)} defaultValue={initData.customer_group_id} showSearch optionFilterProp='children' >
                                                {
                                                    storagegroup.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                                }
                                            </Select> : ''
                                        }
                                    </Form.Item>
                                </Col>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="专属客服" >
                                    {
                                        initData.manager_id ? <Select defaultValue={initData.manager_id} onChange={(value) => this.changeSearch(value, 3, initData.id)} showSearch optionFilterProp='children' >
                                            {
                                                storagemanager.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                            }
                                        </Select> : ''
                                    }

                                </Form.Item>
                            </Col>
                            <Col span={20}>
                                <Form.Item label="默认地址" >
                                    {
                                        initData.addresses ? initData.addresses.map(item => {
                                            if (item.default == 1) {
                                                let text = item.country_name + item.zone_name +item.zone_name+ item.city+ item.address_1
                                                return (
                                                    <Tooltip title={text}>
                                                        <div className="toolfont">{text}.</div>
                                                    </Tooltip>
                                                )
                                            }
                                        })
                                            :
                                            ''
                                    }

                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <p className="edit" onClick={() => this.changeSearch(1, 5, initData.id)} >设置</p>
                            </Col>
                        </Form>
                    </div>
                </Col>
            </Row>
            {this.context.visible &&
                <Renderpass />
            }
            {this.context.addershow &&
                <Editaddress edittype={this.edittype} _this={this} />
            }

        </div>
        )
    }
}

export default Form.create()(rendertool)