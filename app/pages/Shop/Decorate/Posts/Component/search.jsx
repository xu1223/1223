import React, { Component } from 'react';
import SearchComp2 from '@/components/SearchComp2';
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
        const {
            activeKey,
        } = this.props;
        let param = {}
        console.log(activeKey,'activeKeyactiveKey')
        if (activeKey == 'list') {
            param['name'] = values['title']
            param['title'] = ''
        } else {
            param['title'] = values['title']
            param['name'] = ''
        }
        this.props.changeSearch({...param});
    }

    render() {


        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "名称",
                    key: "title"
                },
                span: 6,

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