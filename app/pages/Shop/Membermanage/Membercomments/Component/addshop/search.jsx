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
            isExact: 'is_like',
            labelConf: [{
                name: "商品名称",
                key: 'name'
            }, {
                name: "SKU",
                key: "sku"
            }, {
                name: "SPU",
                key: "spu"
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