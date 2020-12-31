import React, { Component } from 'react';
import api from 'fetch/api';
import { post, get } from '@/fetch/request';
import SearchComp2 from '@/components/SearchComp2';
import moment from 'moment'
import {
    Form,
    Select
} from 'antd';
import { TabsConfig } from '../Config/index'
const { Option } = Select;
@Form.create()
export default class Search extends Component {
    static defaultProps = {};
    state = {}
    constructor(props, context) {
        super(props, context);
        this.state = {
            allStorageList: []
        }
    }

    componentDidMount() {

    }


    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        const [start_time, end_time] = values.range_time || [];
        let date_start = start_time && moment(start_time).format("YYYY-MM-DD");
        let date_end = end_time && moment(end_time).format("YYYY-MM-DD");
        this.props.changeSearch({ ...values, date_start, date_end });
    }

    render() {
        const wholesale = [{
            name: '是',
            value: 1
        }, {
            name: '否',
            value: '0'
        }]
        const {
            dictData
        } = this.props;
        const SearchConf = [
            {
                isExact: 'is_like',
                labelConf: [{
                    name: "SKU",
                    key: "sku"
                }, {
                    name: "SPU",
                    key: "spu"
                }, {
                    name: "商品名称",
                    key: 'name'
                }],
                type: "input",
                span: 6,
            },
            {
                labelConf: {
                    name: '商品标签',
                    key: 'search_ids'
                },
                span: 4,
                data: dictData,
                renderOption: (item) => (<Option key={item.id} value={item.id}>{item.keyword}</Option>)
            }, {
                labelConf: {
                    name: "是否支持批发",
                    key: "is_wholesale"
                },
                span: 4,
                data: wholesale,
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