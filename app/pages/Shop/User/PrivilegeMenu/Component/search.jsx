import React, {
    Component
} from 'react';
import {
    Form,
} from 'antd';
import SearchComp2 from '@/components/SearchComp2/index.jsx';
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

    }

    //点击查询 或者重置 执行这里
    handleFormData = (values) => {
        //TODO:做一些值得处理
        this.props.getMenusList(values);
    }

    render() {
        //TODO: 这里对search组件自定义配置 
        const SearchConf = [{
                type: "sel_input",
                labelConf: [{
                    name: "权限编码",
                    key: 'code'
                }, {
                    name: "权限名称",
                    key: "name"

                }],
                span: 7,
                isExact: 'is_fuzzy', // 是否精确
                type: "input",
            }
            //后端说暂时隐藏，需跟产品讨论
            // , {
            //     labelConf: {
            //         name: '类型',
            //         key: 'level'
            //     },
            //     span: 4,
            //     data: typeData.slice(0, -1),
            // }
        ];

        return (
            <SearchComp2
                loading={this.props.loading}
                SearchConf={SearchConf}
                form ={this.props.form}
                handleFormData={this.handleFormData}
            />
        )
    }
}