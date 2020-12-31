import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig, { TabApi } from './Config';
import { is, fromJS } from 'immutable';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { get, post } from '@/fetch/request'

import './index.less'
import {
    Card,
    Switch,
    message,
    Input,
    Tabs,
} from 'antd';
import { tabConfig } from './Config/index'

const { TabPane } = Tabs;

@DataOper(pageConfig)
export default class PositionManage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {
            areaList: [],
            activeKey: props.activeKey || 'receive',
            managerlist: [],
            channel_contrast: [],
            message_tag_list: [],
            listdata: [],
            columns: [{
                title: '消息',
                dataIndex: 'title',
                width: 410,
                render: (text, record) => {
                    return <div className="is-title">
                        {
                            record.is_view == 2 ? <div className="is-view">
                                未读
                         </div>
                                : ''
                        }
                        <div>
                            <p> 主题: {record.title}</p>
                            <p>内容: {record.content}</p>
                        </div>
                    </div>
                }
            }, {
                title: '会员名称',
                dataIndex: 'to_email',
                width: 350,
                render: (text, record) => {
                    return <div>
                        <p>
                            {
                                text ? text : record.to_emails ? record.to_emails.map(item => {
                                    return <a onClick={() => this.morelink("Memberinfo", '会员信息', item.email)}>
                                        {item.email}
                                    </a>
                                })
                                    : <a onClick={() => this.morelink("Memberinfo", '会员信息', record.from_email)}>{record.from_email}</a>
                            }

                        </p>
                        <p className="tab-span">{
                            record.tags.map(item => {
                                return <span> {item.name}</span>
                            })
                        }</p>
                    </div>
                }
            }, {
                title: '国家',
                dataIndex: 'country_flag',
                width: 100,
                render: (text, record) => {
                    return <div>
                        {
                            text ? <img src={text}></img> : record.to_emails ?
                                record.to_emails.map((item) => {
                                    return <img src={item.country_flag}></img>
                                }) : ''
                        }
                    </div>
                }
            }, {
                title: '客服',
                dataIndex: 'manager_name',
                width: 180,

            },
            {
                title: '渠道来源',
                dataIndex: 'channel_name',
                width: 100,
                visible: true,
            },
            {
                title: '操作',
                dataIndex: "id",
                width: 300,
                fixed: 'right',
                render: (text, record) => {
                    return <BatOperation {..._batProps(record)} />
                }
            }]
        }

        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '查看',
                    onAuth: 'add',
                    noCheck: true,
                    onClick: () => this.save_message_view(rowData, 2)

                }, {
                    title: this.state.activeKey == 'receive' ? '回复' : '编辑',
                    onAuth: 'add',
                    noCheck: true,
                    visible: rowData.status == '0' ? false : true,
                    onClick: () => this.save_message_view(rowData, 1)


                }, {
                    title: '操作',
                    noCheck: true,
                    ghost: true,
                    visible: rowData.status == '0' ? true : false,
                    children: [{
                        title: '审核通过',
                        onAuth: 'add',
                        method: api.save_message_approval,
                        paramData: {
                            status: 1
                        },
                        childrenData: { 'status': 1 },
                    }, {
                        title: '审核驳回',
                        onAuth: 'add',
                        method: api.save_message_approval,
                        paramData: {
                            status: 2
                        },
                        childrenData: { 'status': 2 },
                    },
                    ]
                }],

                unicode: 'message_ids|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [];
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
    // 跳转页面

    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }
    // 设置已读信息
    save_message_view = (rowData, type) => {
        post(api.save_message_view, { message_id: rowData.id }).then((res) => {
            if (type == 1) {   //查看信息
                1
                this.jumpPage('Messageproedit', rowData.id, this.state.activeKey == 'draft' ? 'check' : 'edit')

            } else {  //编辑信息
                this.toggleWin('details', {
                    rowData_id: rowData.id
                })
            }
        })
    }
    componentDidMount = () => {
        this.changeTab(this.state.activeKey);
        get(api.get_manager_list, {}).then(res => {   //获取会员列表
            if (res) {
                this.setState({
                    managerlist: res.resultData
                })
            }
        })
        post(api.get_message_tag_list).then(res => {     //获取标签
            this.setState({
                message_tag_list: res.resultData
            })
        })
        get(api.get_all_channel_contrast, {}).then(res => {  ///获取渠道来源
            if (res) {
                this.setState({
                    channel_contrast: res.resultData
                })
            }
        })



    }

    // 共享 tool 和index
    toggleWin = (key = 'visible', cotherConfig = {}) => {
        let { otherConfig = {} } = this.state;
        otherConfig = {
            ...otherConfig,
            ...cotherConfig,
            [key]: !this.state[key]
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig,
        })
    }
    //  切换tab
    changeTab = (activeKey) => {
        this.setState({
            activeKey,
        })
        let columns = this.state.columns
        let istable = []
        columns.map(item => {   //根据不同状态切换不同值
            if (!item.visible) {
                istable.push(item)
            }
        })
        if (activeKey == 'receive') {    //收件箱
            istable.splice(istable.length - 1, 0, {
                title: '创建时间',
                dataIndex: 'created_at',
                width: 180,
                visible: true,
            });
            istable.splice(istable.length - 1, 0, {
                title: '渠道来源',
                dataIndex: 'channel_name',
                width: 100,
                visible: true,
            });
        } else if (activeKey == 'sent') { //发件箱

            istable.splice(istable.length - 1, 0, {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                visible: true,
                render: (text, record) => {
                    return <div>
                        {
                            text == 1 ? '已发送' : text == 2 ? '驳回' : '待审核'
                        }
                    </div>
                }
            });
            istable.splice(istable.length - 1, 0, {
                title: '创建时间',
                dataIndex: 'created_at',
                width: 180,
                visible: true,
            });
            istable.splice(istable.length - 1, 0, {
                title: '发件时间',
                dataIndex: 'sent_at',
                width: 200,
                visible: true,
            });
        } else if (activeKey == 'draft') {  //草稿箱
            istable.splice(istable.length - 1, 0, {
                title: '保存时间',
                dataIndex: 'created_at',
                width: 180,
                visible: true,
            });
        }
        this.setState({
            columns: istable  //重新渲染表格
        })
        this.props.initListParam({
            action: api[TabApi[activeKey]],
        })
        this.props.changeSearch({}, activeKey)
    }
    //    跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url = '/' + link + '/' + id + '/' + type;
        this.props.goLink(url, { type })
    }

    render() {
        const {
            managerlist,
            message_tag_list,
            channel_contrast,
            activeKey
        } = this.state;

        const tableProps = {
            columns: this.state.columns,
            ...this.props.tableConfig,
        };
        const {
        } = this.props;

        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            jumpPage: this.jumpPage,
            batConfig: this.props.batConfig,
            activeKey,
            managerlist,
            message_tag_list,
            channel_contrast,
            changeSearch: this.props.changeSearch,
        };


        return <div className="tabSwitching">
            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}
                        activeKey={this.state.activeKey}
                        message_tag_list={message_tag_list}
                        managerlist={managerlist}
                        channel_contrast={channel_contrast}
                        onChange={this.changeTab} />
                    <div className="header-tool">
                        <p>站内信</p>
                        <ToolWrap changeSearch={this.props.changeSearch} values={this.props.values} />
                    </div>
                    {
                        tabConfig ? <Tabs
                            type="card"
                            activeKey={this.state.activeKey}
                            onChange={(e) => this.changeTab(e)}
                        >
                            {
                                tabConfig.map((item) =>
                                    <TabPane tab={<span>{item.name}</span>} key={item.id}></TabPane>)
                            }
                        </Tabs> : ''
                    }
                    <Card
                        className="content-main">
                        <div className="content-table">
                            <Table {...tableProps} />
                        </div>
                    </Card>
                </ListContext.Provider>
            </div>
        </div>

    }
}