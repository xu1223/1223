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
        values['date_start'] = ''
        values['date_end'] = ''
        if (values.order_time) {  //发送时间
            values['date_start'] = moment(values.order_time[0]).format('YYYY-MM-DD') + ' 00:00:00'
            values['date_end'] = moment(values.order_time[1]).format('YYYY-MM-DD') + ' 23:59:59'
            values['date_type'] = 1
        }
        if (values.order_time1) {  //创建时间
            values['date_start'] = moment(values.order_time1[0]).format('YYYY-MM-DD') + ' 00:00:00'
            values['date_end'] = moment(values.order_time1[1]).format('YYYY-MM-DD') + ' 23:59:59'
            values['date_type'] = 2
        }

        if (values['tag_ids']) {  //标签值字符串
            values['tag_ids'] = values['tag_ids'].toString()
        }

        values.order_time = ''
        delete values['order_time']
        delete values['order_time1']
        delete values['date_type']
        this.props.changeSearch({ ...values, order_time: '' });
    }

    render() {
        const {
            managerlist,
            message_tag_list,
            channel_contrast,
            activeKey
        } = this.props;
        const status_list = [{
            name: '全部',
            id: '',
        }, {
            name: '待审核',
            id: '0',
        }, {
            name: '已发送',
            id: 1,
        }, {
            name: '驳回',
            id: 2,
        },]

        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "会员名称",
                    key: "email"
                },
                span: 6,

            },
            {
                labelConf: {
                    name: '客服',
                    key: 'manager_id'
                },
                span: 6,
                data: managerlist || [],
            }, {
                labelConf: [{
                    name: '创建时间',
                    key: 'order_time',
                }, {
                    name: '发件时间',
                    key: 'order_time1'
                }],
                span: 6,
                type: 'range',
                visible: activeKey == 'draft' ? false : true,
            },
            {
                labelConf: [{
                    name: '保存时间',
                    key: 'order_time',
                },],
                span: 6,
                type: 'range',
                visible: activeKey == 'draft' ? true : false,
            },
            {
                labelConf: {
                    name: '标签',
                    key: 'tag_ids'
                },
                formConf: {
                    mode: 'multiple'
                },
                span: 6,
                data: message_tag_list || [],
                renderOption: (item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)
            },
            {
                labelConf: {
                    name: '渠道来源',
                    key: 'sources_channel_id'
                },
                span: 6,
                visible: activeKey == 'receive' ? true : false,
                data: channel_contrast || [],
            },
            {
                labelConf: {
                    name: '状态',
                    key: 'status'
                },
                span: 6,
                visible: activeKey == 'sent' ? true : false,
                data: status_list,
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