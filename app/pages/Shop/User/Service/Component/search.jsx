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


    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        //TODO:做一些值得处理
      
        let extra = {};

        this.props.changeSearch({
            ...values,
            ...extra
        });
    }

    render() {

        const Recommendation = [{
            name: '是',
            id: '1'
        }, {
            name: '否',
            id: '2'
        }];
        const SearchConf = [{
            labelConf: [{
                name: "英文名",
                key: 'name'
            },  {
                name: "姓名",
                key: "title"
            }],
            span: 6,
            type: "input",
        }, {
            labelConf: {
                name: '是否推荐',
                key: 'is_rec'
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