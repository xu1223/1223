import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import pageConfig, { TabApi } from './Config';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import './index.less'
import {
    Card,
    Input,
    Tabs,
    Switch,
    message
} from 'antd';

const { TabPane } = Tabs;

@DataOper(pageConfig)
export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {
            areaList: [],
            channel_contrast: [],
            listdata: [],

        }

        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    onAuth: 'add',
                    visible :rowData.manager_id != -1,
                    noCheck: true,
                    onClick: () => this.toggleWin('Setting', rowData)
                }, {
                    title: '删除',
                    onAuth: 'add',
                    noCheck: true,
                    type:"danger",
                    visible :rowData.manager_id != -1,
                    method: api.mail_setting_del,
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    is_column: 1,
                    id: rowData.id
                }
            }
        };


        this.columns = [{
            title: '邮箱账号',
            dataIndex: 'username',
        }, {
            title: '主机',
            dataIndex: 'host',
        },
        {
            title: '端口',
            dataIndex: 'port',
        },
        {
            title: '加密类型',
            dataIndex: 'encryption',
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (text, record) => {
                return <Switch disabled={record.manager_id == -1 ? true : false} defaultChecked={text == 1 ? true : false}
                    onChange={(e) => this.onChange(e, record.id)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 100,
            render: (text, record) => {
                return <Input disabled={record.manager_id == -1 ? true : false}  defaultValue={text} onBlur={value => this.onBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                // return record.manager_id == -1 ? '默认邮箱不允许修改' :
                return  <BatOperation {..._batProps(record)} />  
            }
        }
        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.edit_mail_setting_sort_order({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }
    //  修改状态
    onChange = (e, id) => {
        fetch.order.mail_setting_active({
            id: id,
            is_active: e ? 1 : 0
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }

    // 跳转页面

    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }

    componentDidMount = () => {
        this.props.changeSearch({})
    }

    // 共享 tool 和index
    toggleWin = (key = 'visible', rowData = {}) => {
        let { otherConfig = {} } = this.state;
        otherConfig = {
            rowData,
            [key]: !this.state[key]
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig,
            rowData,
        })
    }


    //    跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url =  link + '/' + id + '/' + type;
        let href = window.location.origin+'/#/'+url
        window.open(href)
    }

    render() {
        const {


            channel_contrast,
            rowData,
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };
        const {
        } = this.props;

        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            jumpPage: this.jumpPage,
            batConfig: this.props.batConfig,

            channel_contrast,
            changeSearch: this.props.changeSearch,
            rowData
        };


        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}

                        channel_contrast={channel_contrast}
                    />
                    <div className="header-tool">
                        <p>邮箱设置</p>
                        <ToolWrap changeSearch={this.props.changeSearch} values={this.props.values} />
                    </div>
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