import React, { Component } from 'react';
import { post, get } from '@/fetch/request';
import SearchComp2 from '@/components/SearchComp2';
import {
    Form,
} from 'antd';
@Form.create()
export default class Search extends Component {
    static defaultProps = {};
    state = {}
    constructor(props, context) {
        super(props, context);

    }

    componentDidMount() {
    }



    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        this.props.changeSearch({ ...values });
    }

    render() {
        const selectdata = [{
            name: '全部',
            id: ''
        }, {
            name: '已订阅',
            id: 1
        }, {
            name: '未订阅',
            id: '0'
        }]
        const registerdata = [{
            name: '全部',
            id: ''
        }, {
            name: '已注册',
            id: 1
        }, {
            name: '未注册',
            id: 2
        }]
        const SearchConf = [{
            type: 'input',
            labelConf: {
                name: "会员名称",
                key: "email"
            },
            span: 6,

        }, {
            labelConf: {
                name: '订阅状态',
                key: 'newsletter'
            },
            span: 6,
            data: selectdata,
        }, {
            labelConf: {
                name: '注册状态',
                key: 'is_register'
            },
            span: 6,
            data: registerdata,
        },

        ];

        return (
            <SearchComp2
                loading={this.props.loading}
                SearchConf={SearchConf}
                handleFormData={this.handleFormData}
            />
        )
    }
}