import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig from './Config';
import { is, fromJS } from 'immutable';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { get, post } from '@/fetch/request'
import {
    Card,
    message,
    Input
} from 'antd';

@DataOper(pageConfig)
export default class PositionManage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            areaList: []
        }
        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '查看',
                    noCheck: true,
                    ghost: true,
                    onClick: () => {
                        this.jumpPage('Memberinfoproedit', rowData.id, 'check')
                    }
                }],
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '会员邮箱',
            dataIndex: 'email',
            width: 200,

        }, {
            title: '会员等级',
            dataIndex: 'customer_group_name',
            width: 100,
        }, {
            title: '购物车数量',
            dataIndex: 'cart_count',
            width: 100,
        }, {
            title: '订单总数',
            dataIndex: 'order_count',
            width: 100,
        }, {
            title: '支付总额（＄）',
            dataIndex: 'pay_total',
            width: 100,
            render: (text, record) => {
                let pay = Math.floor(text * 100) / 100
                return <div>
                    {pay}
                </div>
            }
        }, {
            title: '注册时间',
            dataIndex: 'created_at',
            width: 100,

        }, {
            title: '最近加购时间',
            dataIndex: 'cart_recent_time',
            width: 100,
        }, {
            title: '最近下单时间',
            dataIndex: 'order_recent_time',
            width: 100,
        }, {
            title: '客服',
            dataIndex: 'manager_name',
            width: 100,
        }, {
            title: '渠道来源',
            dataIndex: 'channel_name',
            width: 100,
        },
        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 200,
            render: (text, record) => {
                return <BatOperation {..._batProps(record)} />
            }
        }];
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
    jumpPage = (link, id = 0, type = 'add') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    componentDidMount = () => {
        const { id } = this.props.params   //获取携带过来参数请求
        const { params } = this.props;
        this.props.changeSearch({
            storage_id: params.id,
            email: id
        })
        this.country_idsetore()
    }
    country_idsetore = () => {
        post(api.get_countrys_pager, {  //国家列表
            page_size: '9999'
        }).then(res => {
            if (res) {
                this.setState({
                    storagecountry: res.resultData ? res.resultData.data : []
                })
            }
        })
        post(api.get_manager_list, {  //客服列表  
        }).then(res => {
            if (res) {
                this.setState({
                    storagemanager: res.resultData
                })
            }
        })
        post(api.get_customers_group_pager, {  //会员等级
        }).then(res => {
            if (res) {
                this.setState({
                    storagegroup: res.resultData
                })
            }
        })
        post(api.get_sources_channel_contrast_pager, {   //来源渠道
        }).then(res => {
            if (res) {
                this.setState({
                    storagecontrast: res.resultData.data
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

    render() {
        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };
        const { local = {} } = this.props;
        const { storageInitData = {}, storageList } = local;
        const { area = [] } = storageInitData;
        const dictData = area
        const {
            storagecontrast,
            storagemanager,
            storagegroup,
            storagecountry
        } = this.state
        let selectdata = {
            storagecontrast,
            storagemanager,
            storagegroup,
            storagecountry
        }
        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            dictData,
            storageList,
            batConfig: this.props.batConfig,
            changeSearch: this.props.changeSearch,
        };


        return <div className='userStyle'>

            <ListContext.Provider value={contextProps}>
                <SearchWrap
                    selectdata={selectdata}
                    changeSearch={this.props.changeSearch}
                    dictData={dictData}
                    storageList={storageList} />
                <div className="header-tool">
                    <p>会员信息</p>
                    <ToolWrap
                        selectdata={selectdata}
                        listSelData={this.props.listSelData}
                        values={this.props.values} />
                </div>
                <Card
                    className="content-main">

                    <div className="content-table">
                        <Table {...tableProps} />
                    </div>
                </Card>
            </ListContext.Provider>
        </div>
    }
}