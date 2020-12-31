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
import pageConfig from './Config';
import DataOper from '@/advanced/dataOper2';
import fetch from '@/fetch/index';
import api from '@/fetch/api';
import {
    post
} from '@/fetch/request';
import Table from '@/components/TableComp' //统一使用Table 组件
import BatOperation from '@/components/BatOperation';
import {
    ListContext
} from '@/config/context';
import './index.less'
@DataOper(pageConfig)
export default class UserManagerment extends Component {
    static defaultProps = {

    };

    state = {}

    componentDidMount = async () => {
        this.props.changeSearch({
            pagesize: '20'
        });
        fetch.order.get_member_list_pager({
        
        }).then((res) => {
            if (res) {
                message.success('修改成功')
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
                    method: api.delete_live_chat,
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
            title: '名字',
            dataIndex: 'title',
        }, {
            title: '英文名',
            dataIndex: 'name',
        }, {
            title: '邮箱',
            dataIndex: 'email',
        }, {
            title: 'Whatsapp',
            dataIndex: 'whatsapp',

        }, {
            title: '联系手机',
            dataIndex: 'mobile',
        },
        {
            title: '推荐',
            dataIndex: 'is_rec',
            render: (text, record) => {
                return <span><Switch checked={record.is_rec == '1' ? true : false} checkedChildren="启用" unCheckedChildren="禁用" onChange={(e) => this.switchChange(e, record)} /></span>
            }

        },

        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        },

        {
            title: '操作',
            dataIndex: "key",
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
        let is_rec = checked ? '1' : '2'
        post(api.edit_live_chat, {
            id: record.id,
            is_rec
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
        }
        return <div className='userStyle'>
            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    changeSearch={this.props.changeSearch}
                    groupsDataArr={groupsDataArr}
                />
                <div className="header-tool">
                    <p>客服管理</p>
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