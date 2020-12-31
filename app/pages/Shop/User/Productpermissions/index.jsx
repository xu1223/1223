import React, {
    Component
} from 'react';
import {
    message,
    Card,
    Switch,
    Input,
    Table
} from 'antd';
import SearchWrap from './Component/search';
import ToolWrap from './Component/tool';
import api from '@/fetch/api';
import fetch from '@/fetch';
import {
    ListContext
} from '@/config/context';

export default class UserManagerment extends Component {
    static defaultProps = {

    };



    componentDidMount = async () => {
        this.indta()
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            ProductCategoryDataList: []
        }
        this.columns = [{
            title: '权限',
            dataIndex: 'name',
        }, {
            title: '权限编码',
            dataIndex: 'code',
        }, {
            title: '路由',
            dataIndex: 'index',
        },{
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        }, ];

    }
    indta = () => {
        fetch.order.get_menu_list_pager({
            page_size: '1000'
        }).then((res) => {
            if (res) {
                this.setState({
                    ProductCategoryDataList: res.resultData.data
                })
            }
        })
       


        
    }
    // 修改排序值
    onsortBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.auth_edit_menu({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
                this.indta()
            }
        })
    }

    // 共享 tool 和index 
    toggleWin = (key = 'visible', otherConfig) => {
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })
    }

    render() {
        const {
            groupsDataArr = [],
            rolesDataArr = [],
            ProductCategoryDataList = []
        } = this.state;

        const contextProps = {
            visible: this.state.visible,
            visibleg: this.state.visibleg,
            ...this.state.otherConfig,
            ProductCategoryDataList:ProductCategoryDataList,
            toggleWin: this.toggleWin,
            rolesDataArr,
            groupsDataArr,
            indta:this.indta
        }
        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch}
                    groupsDataArr={groupsDataArr}
                />
                <div className="header-tool">
                    <p>功能菜单</p>
                    <ToolWrap />
                </div>
                <Card className="content-main">

                    <div className="content-table">
                        <Table childrenColumnName={'children'} columns={this.columns} pagination={false}
                            dataSource={ProductCategoryDataList} />,
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}