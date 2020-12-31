import React, { Component } from 'react';
import { post, get } from '@/fetch/request';
import SearchComp2 from '@/components/SearchComp2';
import moment from 'moment';
import { tabConfig } from '../Config/index'
import {
    Form,
} from 'antd';
@Form.create()
export default class Search extends Component {
    static defaultProps = {};
    state = {}
    constructor(props, context) {
        super(props, context);
        this.state = {
        }
    }

    componentDidMount() { }

    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        if (values.order_time) {
            values['date_start'] = moment(values.order_time[0]).format('YYYY-MM-DD') +' 00:00:00';
            values['date_end'] = moment(values.order_time[1]).format('YYYY-MM-DD') + ' 23:59:59';
        } else {
            values['date_start'] = ''
            values['date_end'] = ''
        }
        if (values.pay_time) {
            values['pay_start'] = moment(values.order_time[0]).format('YYYY-MM-DD') +' 00:00:00';
            values['pay_end'] = moment(values.order_time[1]).format('YYYY-MM-DD') + ' 23:59:59';
        } else {
            values['pay_start'] = ''
            values['pay_end'] = ''
        }

        delete values.order_time
        delete values.pay_time
        
        this.props.changeSearch({ ...values });
    }

    render() {
        const {

            activeKey,
            storageList = {}
        } = this.props;
 
        const SearchConf = [
             {
                type: 'input',
                labelConf: {
                    name: "订单编号",
                    key: "tag"
                },
                span: 6,
                
            },
            {
                type: 'input',
                labelConf: {
                    name: "收货人",
                    key: "shipment_name"
                },
                placeholder:'请输入名或者姓，不可同时输入',
                span: 6,
                
            }, 
             {
                labelConf: {
                    name: '收货国家',
                    key: 'country_id'
                },
                span: 6,
                data: storageList.countrylist,
            }, {
                labelConf: [{
                    name: '下单时间',
                    key: 'order_time'
                }, {
                    name: "支付时间",
                    key: "pay_time"
                }],
                span: 6,
                type: 'range',
            },
            {
                labelConf: {
                    name: '支付方式',
                    key: 'payment_method'
                },
                span: 6,
                data: storageList.paylist,
                renderOption: (item) => (<Option key={item.value} value={item.value}>{item.label}</Option>)
            }, {
                labelConf: {
                    name: '物流方式',
                    key: 'shipment_method'
                },
                span: 6,
                data: storageList.zonestlist,
                renderOption: (item) => (<Option key={item} value={item}>{item}</Option>)
            }, 
            {
                labelConf: {
                    name: '客服',
                    key: 'manager_id'
                },
                span: 6,
                data:  storageList.managerlist,
            }, 
            
            {
                type: 'input',
                labelConf: {
                    name: "联系邮箱",
                    key: "email"
                },
                span: 6, 

            },
            {
                labelConf: {
                    name: '手动标记付款',
                    key: 'payment_status'
                },
                span: 6,
                data: [{
                    id: 'manual_paid',
                    name: '是'
                }, {
                    id: 'paid',
                    name: '否'
                }]
            }, {
                labelConf: {
                    name: '支付设备',
                    key: 'device'
                },
                span: 6,
                data: [{
                    id: 'computer',
                    name: 'pc端'
                }, {
                    id: 'phone',
                    name: '移动端'
                }]
            }, {
                labelConf: {
                    name: '渠道来源',
                    key: 'sources_channel_id'
                },
                span: 6,
                data: storageList.storagecontrast,
            }, 
            
        
        
        ];

        return (
            <SearchComp2
                loading={this.props.loading}
                SearchConf={SearchConf}
                handleFormData={this.handleFormData}
                activeKey={this.props.activeKey}
                changeTab={this.props.onChange}
            />
        )
    }
}