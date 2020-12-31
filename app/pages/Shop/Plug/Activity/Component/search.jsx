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
    
        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "任务名称",
                    key: "keyword"
                },
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