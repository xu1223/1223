import React, {
    Component
} from 'react';
import {
    Form,
} from 'antd';

import SearchComp2 from '@/components/SearchComp2/index.jsx';
import moment from 'moment';
import {
    workingCondition,
} from '../Config/index';
@Form.create()
export default class Search extends Component {
    static defaultProps = {};

    state = {}

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() { }

    getTime = ([start_time, end_time]) => {
        start_time = new Date(moment(start_time).format('YYYY-MM-DD') + ' 0:00:00').getTime() / 1000;
        end_time = new Date(moment(end_time).format('YYYY-MM-DD') + ' 23:59:59').getTime() / 1000;
        return {
            start_time,
            end_time,
        }
    }

    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        //TODO:做一些值得处理
        const {
            devtime = [],
        } = values;
        let extra = {};
        if (devtime.length > 0) {
            extra = {
                ...this.getTime(devtime)
            }
        } else {
            extra = {
                start_time: '',
                end_time: ''
            }
        }
        this.props.changeSearch({
            ...values,
            ...extra
        });
    }

    render() {

        const Recommendation = [{
            name: '全部',
            id: ''
        }, {
            name: '启用',
            id: '1'
        }, {
            name: '禁用',
            id: '2'
        }];
        //TODO: 这里对search组件自定义配置 
        const SearchConf = [
            {
                type: 'input',
                labelConf: {
                    name: "角色名称",
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
                data: Recommendation,
            },];

        return (
            <SearchComp2
                loading={this.props.loading}
                SearchConf={SearchConf}
                form={this.props.form}
                handleFormData={this.handleFormData}
            />
        )
    }
}