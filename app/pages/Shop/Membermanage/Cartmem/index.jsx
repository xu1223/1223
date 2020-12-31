import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig from './Config';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import {post } from '@/fetch/request'
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
            stage: true,  //防止误触
            downLoading: '',
        }
        const _batProps = (rowData) => {
            return {
                config: [{
                    title: '编辑',
                    noCheck: true,
                    onClick: () => {
                        this.jumpPage('Cartmemproedit', rowData.id, 'check')
                    },
                    type: ''
                }, {
                    title: '导出',
                    noCheck: true,
                    onClick: () => {
                        this.export(rowData.id)
                    },
                    type: ''
                }, {
                    title: '催单通知',
                    noCheck: true,
                    method: api.send_reminder_payment_notice,
                    type: '',
                }],
                rowData: { 'id': rowData.id },
                batConfig: this.props.batConfig,
                unicode: 'customer_id|id',
            }
        };

        this.columns = [{
            title: '会员邮箱',
            dataIndex: 'email',
            width: 100,
            render: (text, record) => {
                return <a onClick={() => { this.jumpPage('Memberinfoproedit', record.customer_id, 'check') }}>{text}</a>
            }
        }, {
            title: '会员名称',
            dataIndex: 'firstname',
            width: 80,
            render: (text, record) => {
                return <div>
                    {record.lastname}    {record.firstname}
                </div>
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
            title: '购物车商品',
            dataIndex: 'carts',
            width: 300,
            render: (text, row, index) => {
                return (
                    <div>
                        {
                            row.carts.length > 0 ? row.carts.map(item => {
                                return <img src={item} style={{ width: '60px' }} />
                            }) : null
                        }
                    </div>
                )
            }
        }, {
            title: '购物车数量',
            dataIndex: 'cart_count',
            width: 80,
            render: (text, row, index) => {
                return (
                    <div>
                        <a onClick={() => { this.jumpPage('Cartmemproedit', row.id, 'check') }}>{text}</a>
                    </div>
                )
            }
        }, {
            title: '加购时间',
            dataIndex: 'cart_recent_time',
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
    //导出
    export(id) {
        if (this.state.stage) {
            this.setState({  //以防止重复点击
                stage: false
            })
            post(api.customer_cart_export, { customer_id: id }).then(res => {
                if (res) {
                    if (res.resultId == 200) {
                        let url = res.resultData.url + '&access_token=' + localStorage.getItem('ACCESS_TOKEN')
                        this.setState({
                            downLoading: url
                        }, () => {
                            this.refs.golink.click();  //downLoading修改成功后点击a标签下载
                        });

                        message.success('操作成功')
                    }
                }
            })
            setTimeout(() => {
                this.setState({
                    stage: true
                })
            }, 2000)
        } else {
            message.warning('请勿重复点击')
        }

    }

    // 跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }
    componentDidMount = () => {

        const { id } = this.props.params  //判断是否是别的页面携带参数跳转
        this.props.changeSearch({
            email: id
        })
        this.country_idsetore()
    }
    country_idsetore = () => {
        post(api.get_manager_list, {   //会员列表
        }).then(res => {
            if (res) {
                this.setState({
                    storagemanager: res.resultData
                })
            }
        })
        post(api.get_sources_channel_contrast_pager, {  //国家列表
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
                <a href={this.state.downLoading} style={{ display: 'none' }} ref="golink"></a>
                <SearchWrap
                    selectdata={selectdata}
                    changeSearch={this.props.changeSearch}
                    storageList={storageList} />
                <div className="header-tool">
                    <p>会员购物车</p>
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