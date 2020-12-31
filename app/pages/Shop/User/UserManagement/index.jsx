import React, {
    Component
} from 'react';
import {
    message,
    Card,
    Switch,
    Input
} from 'antd';
import SearchWrap from './Component/search';
import ToolWrap from './Component/tool';
import api from '@/fetch/api';
import {
    post
} from '@/fetch/request';
import Table from '@/components/TableComp' //统一使用Table 组件
import BatOperation from '@/components/BatOperation';
import {
    ListContext
} from '@/config/context';
import DataOper from '@/advanced/dataOper2';
import pageConfig from './Config';
@DataOper(pageConfig)
export default class UserManagerment extends Component {
    static defaultProps = {

    };


    componentDidMount = async () => {
        this.props.changeSearch({
            pagesize: '20'
        });
        post(api.get_role_list_pager, {
            page_size: '9999'
        }).then(res => {
            if (res) {
                this.setState({
                    get_role_list_pager: res.resultData.data
                })
            }
        })

    }

    constructor(props, context) {
        super(props, context);
        this.state = {}

        this._batProps = (record) => {
            let obj = {
                config: [{
                    title: '编辑',
                    noAuth: 'edit',
                    noCheck: true,
                    size: 'small',
                    ghost: true,
                    onClick: () => this.toggleWin('visible', { rowData: record })
                }, {
                    title: '删除',
                    noAuth: 'delete',
                    method: api.delete_member,
                    size: 'small',
                    ghost: true,
                    params: { ids: record.id },
                    type: 'danger',
                }],
                batConfig: this.props.batConfig,
                rowData: record
            }
            return obj
        }

        this.columns = [{
            title: '用户ID',
            dataIndex: 'id',
            width: '7%',
        }, {
            title: '姓名',
            dataIndex: 'name',
            width: '9%',
        }, {
            title: '电话',
            dataIndex: 'mobile',
            width: '10%',
        }, {
            title: '添加时间',
            dataIndex: 'created_at',
            width: '8%',

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        }, {
            title: '操作',
            dataIndex: "key",
            width: '20%',
            render: (text, record, index) => {
                return <BatOperation {...this._batProps(record)} />
            }
        }];

    }
    // 修改排序值
    onsortBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        // fetch.order.sort_order_bottom_column({
        //     id: id,
        //     is_column: this.state.activeKey == 'cate' ? 1 : 0,
        //     sort_order: e.target.value
        // }).then((res) => {
        //     if (res) {
        //         message.success('修改成功')
        //     }
        // })
    }
    //启用禁用
    switchChange = (checked, record) => {
        let status = checked ? '1' : '2'
        post(api.edit_member, {
            id: record.id,
            status
        }).then(res => {
            if (res) {
                message.success(res.resultMsg);
                this.props.changeSearch();
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
            get_role_list_pager = []
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        }

        const contextProps = {
            visible: this.state.visible,
            visibleg: this.state.visibleg,
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            batConfig: this.props.batConfig,
            rolesDataArr,
            groupsDataArr,
            get_role_list_pager
        }
        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch}
                    groupsDataArr={groupsDataArr}
                />
                <div className="header-tool">
                    <p>用户管理</p>
                    <ToolWrap />
                </div>
                <Card className="content-main">

                    <div className="content-table">
                        <Table
                            {...tableProps}
                        />
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}