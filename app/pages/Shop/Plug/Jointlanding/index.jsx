import React, { Component } from 'react';
import fetch from '@/fetch';
import pageConfig, { TabApi } from './Config';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import Setting from './Component/setting'
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
            title: '登录方式',
            dataIndex: 'name',
        }, 
        {
            title: '接口名称',
            dataIndex: 'name',
        }, 
        
        
        {
            title: '图片',
            dataIndex: 'image',
            render: (text, record) => {
                return <img src={record.image} style={{ width: '50px',height:'50px' }}></img>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (text, record) => {
                return <Switch defaultChecked={text == 2 ? true : false}
                    onChange={(e) => this.onChange(e, record.id)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 100,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 300,
            fixed: 'right',
            render: (text, record) => {
                // return record.manager_id == -1 ? '默认邮箱不允许修改' :
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
        fetch.order.set_app_sort_order({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                this.props.changeSearch({})
                message.success('修改成功')
            }
        })
    }
    //  修改状态
    onChange = (e, id) => {
        fetch.order.set_app_enable_disable({
            id: id,
            status: e ? 2 : 3
        }).then((res) => {
            if (res) {
                this.props.changeSearch({})
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
        this.props.changeSearch({
            category: 'loginway'
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
                        <p>联合方式</p>
                    </div>
                    <Card
                        className="content-main">
                        <div className="content-table">
                            <Table {...tableProps} />
                        </div>
                    </Card>

                    {this.state.Setting && <Setting changeSearch={this.props.changeSearch}></Setting>}
                </ListContext.Provider>
            </div>
        </div>

    }
}