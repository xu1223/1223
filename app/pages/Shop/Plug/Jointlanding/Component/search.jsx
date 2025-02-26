import React, { Component } from 'react';
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
        this.state = {
        }
    }

    componentDidMount() { }

    //点击查询 或者重置 执行这里
    handleFormData = (values) => {

        this.props.changeSearch({ ...values });
    }

    render() {

        const managerlist = [{
            name: '启用',
            id: '2'
        }, {
            name: '禁用',
            id: '3'
        }]
        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "支付名称",
                    key: "name"
                },
                span: 6,
            },
            {
                labelConf: {
                    name: '状态',
                    key: 'status'
                },
                span: 6,
                data: managerlist || [],
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