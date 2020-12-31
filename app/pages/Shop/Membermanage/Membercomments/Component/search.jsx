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
        this.state={
            allStorageList:[]
        }
    }

    componentDidMount() {
        
    }


    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        console.log(values)
        this.props.changeSearch({...values});
    }

    render() {
        const {
            dictData = {},
            selectdata = {}
        } = this.props;
        const SearchConf = [{
            isExact: 'fuzzily',
            labelConf: [{
                name: "商品名称",
                key: 'product_name'
            }, {
                name: "SKU",
                key: "product_sku"
            }, {
                name: "SPU",
                key: "product_spu"
            }],
            type: "input",
            span: 6,
        }, {
            labelConf: {
                name: '会员名称',
                key: 'email'
            },
            span: 6,
            type: "input",
        }, {
            labelConf: [{
                name: '评论时间',
                key: 'date_start'
            }],
            span: 6,
            type: 'range',
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