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
import fetch from '@/fetch';
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

    state = {}

    componentDidMount = async () => {
        this.props.changeSearch({
            pagesize: '20'
        });
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

    constructor(props, context) {
        super(props, context);

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
            title: '角色名称',
            dataIndex: 'name',
        }, {
            title: '角色描述',
            dataIndex: 'memo',
        }, {
            title: '使用人数',
            dataIndex: 'members',
            render: (text, record) => {
                let data = ''

                if (text) {
                    data = text.length
                }
                return <span>{data}</span>
            }

        }, {
            title: '创建者',
            dataIndex: 'id',
            render: (text, record) => {
                return <span>管理员</span>
            }
        }, {
            title: '创建时间',
            dataIndex: 'created_at',

        }, {
            title: '修改时间',
            dataIndex: 'updated_at',

        },
        {
            title: '状态',
            dataIndex: 'is_rec',
            render: (text, record) => {
                return <span><Switch checked={record.status == '1' ? true : false} onChange={(e) => this.switchChange(e, record)} /></span>
            }

        }, {
            title: '操作',
            dataIndex: "key",
            render: (text, record, index) => {
                return <BatOperation {...this._batProps(record)} />
            }
        }];

    }


    //启用禁用
    switchChange = (checked, record) => {
        let status = checked ? '1' : '2'
        fetch.order.edit_role({
            id: record.id,
            status
        }).then((res) => {
            if (res) {
                message.success('修改成功')
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
            ProductCategoryDataList=[]
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        }

        const contextProps = {
            changeSearch: this.props.changeSearch,
            visible: this.state.visible,
            visibleg: this.state.visibleg,
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            batConfig: this.props.batConfig,
            rolesDataArr,
            groupsDataArr,
            ProductCategoryDataList:ProductCategoryDataList
        }
        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch}
                    groupsDataArr={groupsDataArr}
                />
                <div className="header-tool">
                    <p>角色管理</p>
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