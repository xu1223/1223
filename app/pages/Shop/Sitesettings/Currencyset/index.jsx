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
                    noCheck: true,
                    onClick: () => this.toggleWin('Setting', rowData)
                }, {
                    title: '删除',
                    onAuth: 'add',
                    type:"danger",
                    noCheck: true,
                    method: api.currency_del,
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    id: rowData.id
                }
            }
        };


        this.columns = [{
            title: '货币',
            dataIndex: 'name',
        }, {
            title: '显示符号',
            dataIndex: 'symbol_left',

        },
        {
            title: '标准符号',
            dataIndex: 'code',

        },
        {
            title: '汇率（相对美元）',
            dataIndex: 'value',

        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                return <Switch disabled={record.default == 1 ? true : false}
                    defaultChecked={text == 1 ? true : false} onChange={(e) => this.onChange(e, record)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            render: (text, record) => {
                return <Input disabled={record.default == 1 ? true : false} defaultValue={text} onBlur={value => this.onBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                return record.default == 1 ? '默认货币不允许操作' : <BatOperation {..._batProps(record)} />
            }
        }
        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.edit_currency_sort_order({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res && res.resultData == 1) {
                message.success('修改成功')
            } else {
                message.error('修改失败')
            }
        })
    }
    //  修改状态
    onChange = (e, val) => {
        fetch.order.currency_active({
            id: val.id,
            is_active: e ? 1 : 0
        }).then((res) => {
            if (res && res.resultData == 1) {
                this.props.changeSearch({})
                message.success('修改成功')
            } else {
                message.error('修改失败')
            }
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
                        <p>货币设置</p>
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