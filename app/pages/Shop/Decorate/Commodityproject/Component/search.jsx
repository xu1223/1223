import React, { Component } from 'react';
import SearchComp2 from '@/components/SearchComp2';
import {
    Form,
    Tabs
} from 'antd';
const { TabPane } = Tabs;
import { tabConfig } from '../Config/index'
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
    changeTab = (e) => {

        console.log(e)
    }
    render() {
        const managerlist = [{
            name: '启用',
            id: '1'
        }, {
            name: '禁用',
            id: '0'
        }]
        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "商品专题名",
                    key: "name"
                },
                span: 6,

            },
            {
                labelConf: {
                    name: '状态',
                    key: 'is_active'
                },
                span: 6,
                data: managerlist || [],
            },




        ];

        return (
            <SearchComp2
                loading={this.props.loading}
                SearchConf={SearchConf}
                activeKey={this.props.activeKey}
                handleFormData={this.handleFormData}
                changeTab={this.props.onChange}
            />
        )
    }
}