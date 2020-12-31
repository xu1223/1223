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
                    noCheck: true,
                    type: "danger",
                    method: 'POST /api/admin/delete_menu'
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    id: rowData.id
                }
            }
        };


        this.columns = [{
            title: '导航名称',
            dataIndex: 'name',
        }, {
            title: '中文别名',
            dataIndex: 'name_cn',
            render: (text, record) => {
                return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        {text}
                    </span>
                    <span>
                        {
                            record.show_system != 2 ? <i className="iconfont shop_ziyuan24" style={{ color: '#4486F7', fontSize: '24px' }}></i> : ''
                        }
                        {
                            record.show_system != 3 ? <i className="iconfont shop_ziyuan25" style={{ color: '#4486F7', fontSize: '24px' }}></i> : ''
                        }

                    </span>
                </div>
            }

        },
        {
            title: '状态',
            dataIndex: 'is_active',
            width: 100,
            render: (text, record) => {
                return <Switch defaultChecked={text == 1 ? true : false}
                    onChange={(e) => this.onChange(e, record.id)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 100,
            render: (text, record) => {
                return <Input disabled={record.manager_id == -1 ? true : false} defaultValue={text} onBlur={value => this.onBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                return record.manager_id == -1 ? '默认邮箱不允许修改' : <BatOperation {..._batProps(record)} />
            }
        }
        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return
        }
        fetch.order.menu_sort_order({
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
        fetch.order.menu_active({
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
        fetch.order.get_menu_tree({}).then((res) => {
            if (res) {
                let arr = res.resultData || []
                arr.unshift({
                    id: 0,
                    name: '顶级导航'
                })
                this.setState({
                    menutree: arr
                })
            }
        })
        fetch.order.product_theme_list({}).then((res) => {
            if (res) {
                this.setState({
                    productlist: res.resultData
                })
            }
        })
        fetch.order.get_categorys_pager({}).then((res) => {
            if (res) {
                this.setState({
                    categoryspager: res.resultData
                })
            }
        })
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
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    render() {
        const {
            channel_contrast,
            rowData,
            menutree = [],
            categoryspager = [],
            productlist = []
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
            rowData,
            menutree,
            categoryspager,
            productlist
        };


        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}

                        channel_contrast={channel_contrast}
                    />
                    <div className="header-tool">
                        <p>导航菜单</p>
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