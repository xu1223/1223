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
    message,
    Icon,
    Tooltip
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
                    noCheck: true,
                    onClick: () => this.toggleWin('Setting', rowData)
                }, {
                    title: '删除',
                    onAuth: 'add',
                    noCheck: true,
                    type:"danger",
                    method: api.mail_setting_del,
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    id: rowData.id
                }
            }
        };


        this.columns = [{
            title: '活动名称',
            dataIndex: 'name',
        }, {
            title: '开始时间',
            dataIndex: 'date_start',
        },
        {
            title: '结束时间',
            dataIndex: 'date_end',
        },

        {
            title: <div>状态    <Tooltip title="开启后将在前台进行显示">
            <Icon style={{color:'#4486F7'}} type="question-circle" />
        </Tooltip></div>,
            dataIndex: 'status',
            width: 100,
            render: (text, record) => {
                return <Switch defaultChecked={text == 1 ? true : false}
                    onChange={(e) => this.onChange(e, record.id)} />
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

    //  修改状态
    onChange = (e, id) => {
        fetch.order.set_full_mall_activity_status({
            id: id,
            status: e ? 1 : 0
        }).then((res) => {
            if (res) {
                message.success('修改成功')
                this.props.changeSearch({})
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
                        <p>促销活动</p>
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