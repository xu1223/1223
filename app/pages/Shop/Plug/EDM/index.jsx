import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import pageConfig, { TabApi, handelSave ,tabConfig } from './Config';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import './index.less'
import {
    Card,
    message,
    Tabs
} from 'antd';
const { TabPane } = Tabs;


@DataOper(pageConfig)
export default class PositionManage extends Component {


    constructor(props, context) {
        super(props, context);
        this.listdata = []
        this.state = {
            areaList: [],
            activeKey: props.activeKey || 'list',
            managerlist: [],
            channel_contrast: [],
            message_tag_list: [],
            listdata: [],

        }




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

        fetch.order.get_collection_pager({ pagesize: '999' }).then((res) => {
            if (res) {
                this.setState({
                    collection_pager: res.resultData.data
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
    //  切换tab
    changeTab = (activeKey) => {
        this.setState({
            activeKey,
        })
        this.props.initListParam({
            action: api[TabApi[activeKey]],
        })
        this.props.changeSearch({}, activeKey)

    }
    //    跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    render() {
        const {
            managerlist,
            message_tag_list,
            channel_contrast,
            activeKey,
            rowData,
            collection_pager=[]
        } = this.state;
        console.log(this.props.tableConfig, '0000000')
        const tableProps = {
            columns: handelSave.call(this, activeKey),
            ...this.props.tableConfig,
        };
        const Keyshow = activeKey == 'template'
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
            rowData,
            collection_pager
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
                        <p>邮件EDM</p>
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
                    {
                        Keyshow ? <Card
                            className="content-main">

                        </Card> : <Card
                            className="content-main">
                                <div className="content-table">
                                    <Table {...tableProps} />
                                </div>
                            </Card>
                    }

                </ListContext.Provider>
            </div>
        </div>

    }
}