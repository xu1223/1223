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
            areaList: [],
            stage: true,  //防止误触
        }
        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    noCheck: true,
                    onClick: () => {
                        this.jumpPage('Wishlistproedit', rowData.id, 'check')
                    },
                    type: ''
                },],
                rowData: { 'id': rowData.id },
                batConfig: this.props.batConfig,
                unicode: 'customer_id|id',
            }
        };

        this.columns = [{
            title: '会员邮箱',
            dataIndex: 'email',
            width: 200,
            render: (text, record) => {
                return <a onClick={() => this.morelink("Memberinfo", '会员信息', text)}>
                    {text}
                </a>
            }
        }, {
            title: '客服',
            dataIndex: 'manager_name',
            width: 100,
        }, {
            title: '渠道来源',
            dataIndex: 'channel_name',
            width: 100,
        }, {
            title: '心愿单商品',
            dataIndex: 'wishlists',
            width: 300,
            render: (text, row, index) => {
                return (
                    <div>
                        {
                            row.wishlists.length > 0 ? row.wishlists.map(item => {
                                return <img src={item.img_m} style={{ width: '60px' }} />
                            }) : null
                        }
                    </div>
                )
            }
        }, {
            title: '心愿单数量',
            dataIndex: 'wish_count',
            width: 80,
            render: (text, row, index) => {
                return (
                    <div>
                        <a onClick={() => { this.jumpPage('Wishlistproedit', row.id, 'check') }}>{text}</a>
                    </div>
                )
            }
        }, {
            title: '加购时间',
            dataIndex: 'wish_recent_time',
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
    //  跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }


    componentDidMount = () => {
        // 根据id判断是否是从别的页面携带参数跳转
        const { id } = this.props.params
        this.props.changeSearch({
            email: id
        })
        this.country_idsetore()
    }
    // 生成导航栏tab标签
    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }
    country_idsetore = () => {

        post(api.get_manager_list, {  //获取会员列表
        }).then(res => {
            if (res) {
                this.setState({
                    storagemanager: res.resultData
                })
            }
        })

        post(api.get_sources_channel_contrast_pager, {  ///获取渠道来源
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
        } = this.state
        let selectdata = {
            storagecontrast,
            storagemanager,
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
                    storageList={storageList} />
                <div className="header-tool">
                    <p>心愿单</p>
                    <ToolWrap
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