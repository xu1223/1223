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
        console.log(activeKey, 'activeKeyactiveKey')
        if (activeKey == 'list') {
            param['name'] = values['title']
            param['title'] = ''
        } else {
            param['title'] = values['title']
            param['name'] = ''
        }
        this.props.changeSearch({ ...param });
    }

    render() {
        const{
            activeKey
        } = this.props

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
                    name: "任务名称",
                    key: "title"
                },
                visible:activeKey == 'list',
                span: 6,
            },
            {
                type: 'input',
                labelConf: {
                    name: "邮件标题",
                    key: "title"
                },
                visible:activeKey == 'list',
                span: 6,
            },
            {
                labelConf: {
                    name: '状态',
                    key: 'status'
                },
                visible:activeKey == 'list',
                span: 6,
                data: managerlist || [],
            },



            {
                type: 'input',
                labelConf: {
                    name: "提醒类型",
                    key: "title"
                },
                visible:activeKey == 'remind',
                span: 6,
            },
            {
                type: 'input',
                labelConf: {
                    name: "邮件标题",
                    key: "title"
                },
                visible:activeKey == 'remind',
                span: 6,
            },
            {
                labelConf: {
                    name: '状态',
                    key: 'status'
                },
                visible:activeKey == 'remind',
                span: 6,
                data: managerlist || [],
            },



            {
                type: 'input',
                labelConf: {
                    name: "模板名称",
                    key: "title"
                },
                visible:activeKey == 'template',
                span: 6,
            },
            {
                labelConf: {
                    name: '模板类型',
                    key: 'status'
                },
                visible:activeKey == 'template',
                span: 6,
                data: managerlist || [],
            },


            
            {
                type: 'input',
                labelConf: {
                    name: "分组名称",
                    key: "title"
                },
                visible:activeKey == 'grouping',
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