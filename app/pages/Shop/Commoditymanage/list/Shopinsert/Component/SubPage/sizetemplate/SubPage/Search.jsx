import React, { Component } from 'react';

import {
	Form,
} from 'antd';

import api from 'fetch/api';
import {
    post
} from 'fetch/request';
import {SearchComp} from 'components'
import moment from 'moment'
@Form.create()
export default class Search extends Component {
    static defaultProps = {
    };

    state = {

    }

    constructor(props, context) {
        super(props, context);
    }
    
    componentDidMount() {
        this.getManagerNameList(); //获取客服下拉列表
    }

    getManagerNameList = () => {
        post(api.get_manager_list, {}).then(res => {
            const data = res.resultData;
            this.setState({
                managerNameList: data,
            })
        })
    }
    //点击查询 或者重置 执行这里
    handleFormData = (values) =>{
        //TODO:做一些值得处理
        const [date_start,date_end] = values.range_time || [];
        values.date_start = date_start && moment(date_start).format("YYYY-MM-DD HH:mm:ss") || '';
        values.date_end = date_end && moment(date_end).format("YYYY-MM-DD HH:mm:ss") || '';
        delete values.range_time
        this.props.changeSearch(values);
    }
    
    
    render() {
        //TODO: 这里对search组件自定义配置 
        const SearchConf = [{
            labelConf:{
                name:"模板标题",
                key:"name"
            },
            type:"input"
        },{
            labelConf:{
                name:"编辑者",
                key:"manager_id"
            },
            data: this.state.managerNameList || [],
            renderOption: (item) => (<Option key={item.id} value={item.id}>{item.name}</Option>)
        }, {
            labelConf: {
                name: "保存时间",
                key: "range_time"
            },
            span: 12,
            type: "range",
            format: "YYYY-MM-DD HH:mm:ss",
            showTime: true,
        
        }];

        const SearchProps = {
            handleFormData : this.handleFormData,
            form:this.props.form,
            SearchConf,
            loading:this.props.loading
        }
        return (
            <SearchComp 
                {...SearchProps}
            />
        )
    }
}