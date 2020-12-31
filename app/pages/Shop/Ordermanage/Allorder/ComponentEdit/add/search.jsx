import React, { Component } from 'react';
import api from 'fetch/api';
import { post, get } from '@/fetch/request';
import SearchComp2 from '@/components/SearchComp2';
import moment from 'moment'
import {
    Form,
    Select
} from 'antd';

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
        console.log(values,'----------')
        this.props.changeSearch(values);
    }

    render() {
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