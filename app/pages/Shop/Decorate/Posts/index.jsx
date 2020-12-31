import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import pageConfig, { TabApi ,tabConfig }  from './Config';
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
            activeKey: props.activeKey || 'cate',
            managerlist: [],
            channel_contrast: [],
            message_tag_list: [],
            listdata: [],

        }

        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    onAuth: 'add',
                    noCheck: true,
                    onClick: () => this.toggleWin(this.state.activeKey == 'cate' ? 'Setting' : 'Addlist', rowData)
                }, {
                    title: '删除',
                    onAuth: 'add',
                    noCheck: true,
                    type:"danger",
                    method: api.del_bottom_column,
                }],
                batConfig: this.props.batConfig,
                rowData,
                paramData: {
                    is_column: this.state.activeKey == 'cate' ? 1 : 0,
                    id: rowData.id
                }
            }
        };

        let arr = [{
            title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (text, record) => {
                return <Switch defaultChecked={text == 1 ? true : false} onChange={(e) => this.onChange(e, record.id)} />
            }

        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
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
                return <BatOperation {..._batProps(record)} />
            }
        }]
        this.columns = [{
            title: '分类名称',
            dataIndex: 'title',
            width: 300,
        }, {
            title: '中文别名',
            dataIndex: 'title_cn',
            width: 300,

        },
        ...arr
        ]
        this.columns1 = [{
            title: '文章名称',
            dataIndex: 'name',
            width: 300,
        }, {
            title: '中文别名',
            dataIndex: 'name_cn',
            width: 300,

        },
        ...arr
        ]


    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.sort_order_bottom_column({
            id: id,
            is_column: this.state.activeKey == 'cate' ? 1 : 0,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }
    //  修改状态
    onChange = (e, id) => {
        fetch.order.publish_bottom_column({
            id: id,
            is_column: this.state.activeKey == 'cate' ? 1 : 0,
            status: e ? 1 : 0
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
        this.changeTab(this.state.activeKey);
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
    //  切换tab
    changeTab = (activeKey) => {
        this.setState({
            activeKey,
        })
        console.log(api[TabApi[activeKey]], [TabApi[activeKey]], activeKey)
        this.props.initListParam({
            action: api[TabApi[activeKey]],
        })
        this.props.changeSearch({}, activeKey)
    }
    //    跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
  
        let url =  link + '/' + id + '/' + type;
        let href = window.location.origin+'/#/'+url
        window.open(href)
    }

    render() {
        const {
            managerlist,
            message_tag_list,
            channel_contrast,
            activeKey,
            rowData,
        } = this.state;

        const tableProps = {
            columns: activeKey == 'cate' ? this.columns : this.columns1,
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
            rowData
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
                        activeKey={activeKey}
                        onChange={this.changeTab}
                    />
                    <div className="header-tool">
                        <p>文章管理</p>
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