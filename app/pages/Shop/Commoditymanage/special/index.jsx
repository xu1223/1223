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
                    title: '关联商品',
                    onAuth: 'add',
                    noCheck: true,
                    onClick: () => this.morelink('Associatededit', rowData.id)
                }, {
                    title: '删除',
                    onAuth: 'add',
                    noCheck: true,
                    type:"danger",
                    method: api.collection_del,
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    id: rowData.id
                }
            }
        };


        this.columns = [{
            title: '专题名称',
            dataIndex: 'name',
        }, {
            title: '中文别名',
            dataIndex: 'name_cn',
        },
        {
            title: '简介',
            dataIndex: 'memo',
        },
        {
            title: '商品',
            dataIndex: 'products',
            width:400,
            render: (text, record) => {
                if (record.products && record.products.length > 0) {
                    let imgs = []
                    for (var i = 0; i < record.products.length; i++) {
                        if (i < 3) {
                            imgs.push(record.products[i].img_m)
                        } else {
                            break;
                        }
                    }
                    return <div style={{display:'flex',alignItems:'center'}}>
                        {
                            imgs.map((item => {
                                return <img src={item} style={{width:'50px',marginRight:'5px',height:'50px',border:'1px solid #999'}}></img>
                            }))
                        }
                        共 {record.products.length} 个商品
                    </div>
                }
            }
        },
        {
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
            fixed: 'right',
            width:300,
            render: (text, record) => {
                return <BatOperation {..._batProps(record)} />
            }
        }
        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.sort_order_collection({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
                this.props.changeSearch({})
            }
        })
    }


    // 跳转页面

    morelink = (link, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url)
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
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
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
                        <p>专题商品</p>
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