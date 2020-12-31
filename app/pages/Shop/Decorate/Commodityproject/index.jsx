import React, { Component } from 'react';
import api from '@/fetch/api';
import { tabConfig } from './Config';
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
    Tabs,
} from 'antd';

const { TabPane } = Tabs;

@DataOper()
export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {
            areaList: [],
            activeKey: props.activeKey || '1',
            listdata: [],

        }

        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '装修',
                    onAuth: 'add',
                    noCheck: true,
                    // onClick: () => this.jumpPage('Decorateedit', rowData.tpl_id, 'edit', rowData.id)
                    url: `Decorateedit/${rowData.tpl_id}/edit/${rowData.id}`

                }, {
                    title: '编辑',
                    onAuth: 'edit',
                    noCheck: true,
                    onClick: () => this.toggleWin('Setting', rowData)
                }, {
                    title: '删除',
                    onAuth: 'del',
                    noCheck: true,
                    type: "danger",
                    method: 'POST /api/admin/delete_product_template_theme',
                },],
                unicode: 'id|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '商品专题名',
            dataIndex: 'name',
            width: 300,
        }, {
            title: '中文别名',
            dataIndex: 'name_cn',
            width: 300,

        }, {
            title: '状态',
            dataIndex: 'is_active',
            width: 100,
            render: (text, record) => {
                return <div>
                    {
                        text == 1 ? '启用' : '禁用'
                    }
                </div>
            }
        }, {
            title: '排序',
            dataIndex: 'manager_name',
            width: 180,

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



    componentDidMount = () => {
        this.changeTab(this.state.activeKey);
    }

    // 共享 tool 和index
    toggleWin = (key = 'visible', rowData = {}) => {
        console.log(rowData, 'rowDatarowData')
        let { otherConfig = {} } = this.state;
        otherConfig = {
            rowData,
            [key]: !this.state[key]
        }
        console.log(otherConfig, 'otherConfigotherConfig')
        this.setState({
            [key]: !this.state[key],
            rowData,
            otherConfig,
        })

    }
    //  切换tab
    changeTab = (activeKey = '0') => {
        this.setState({
            activeKey,
        })
        this.props.initListParam({
            action: `POST /api/admin/get_product_template_themes_pager`,
        });

        this.props.changeSearch({ is_mobile: activeKey + '' }, activeKey + '')
    }
    //    跳转页面
    jumpPage = (link, tip_id = 0, type = 'edit', id) => {
        let url = link + '/' + tip_id + '/' + type + '/' + id;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    render() {
        const {
            activeKey,
            rowData
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
            activeKey,
            changeSearch: this.props.changeSearch,
            rowData,
        };


        return <div className="tabSwitching">
            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}
                        activeKey={this.state.activeKey}
                        onChange={this.changeTab}
                    />
                    <div className="header-tool">
                        <p>商品专题</p>
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