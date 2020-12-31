import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig ,{tabConfig} from './Config';
import { is, fromJS } from 'immutable';
import ToolWrap from './Component/tool';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { get, post } from '@/fetch/request'
import pc from '../../../../../public/img/pc.png'
import phone from '../../../../../public/img/phone.png'
import xx from '../../../../../public/img/xx.png'
import paypal from '../../../../../public/img/paypal.png'
import './index.less'
import {
    Card,
    Switch,
    message,
    Tabs,
    Tooltip,
    Icon,
    Popover,
    Input
} from 'antd';


const { TabPane } = Tabs;

@DataOper(pageConfig)
export default class PositionManage extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            areaList: [],
            activeKey: props.activeKey || '10',
            managerlist: [],
            countrylist: [],
            contrastlist: [],
            zonestlist: [],

        }
        this.id = 'all'
        const orderstatus = (text) => {
            let status =
                text == 'processing' ? '处理中'
                    : text == 'unpaid' ? '未支付'
                        : text == 'paid' ? '已支付'
                            : text == 'partial' ? '部分支付'
                                : text == 'shipped' ? '已发货'
                                    : text == 'canceled' ? '已取消'
                                        : text == 'completed' ? '已完成'
                                            : text == 'refunded' ? '已退款'
                                                : text == 'partially_refunded' ? '部分退款' : '数据错误'
            return (
                <div style={{ color: '#AFAFAF' }}>
                    {status}
                </div>
            )
        }
        const TooltipTitle = (text, title, state) => {
            return (
                <div>
                    <span style={{ marginRight: 8 }}>{text}</span>
                    <Tooltip placement="top" title={title}>
                        {
                            <Icon style={{ marginLeft: '3px', color: '#4AAAF3' }} type="exclamation-circle" />

                        }

                    </Tooltip>
                </div>
            );
        };
        const _batProps = (rowData) => {

            return {
                config: [{
                    title: '编辑',
                    noCheck: true,
                    ghost: true,
                    visible: rowData.order_status == 'unpaid' || rowData.order_status == 'paid',
                    // onClick: () => { this.jumpPage('Allorderpor', rowData.id, 'edit') },
                    url:`Allorderporedit/${rowData.id}/edit?tType=edit`
                }, {
                    title: '更多',
                    noCheck: true,
                    ghost: true,
                    children: [{
                        title: '标记付款',
                        noCheck: true,
                        visible: rowData.order_status == 'unpaid',
                        onClick: () => { this.toggleWin('visibleLog', { rowData }) }
                    }, {
                        title: '标记发货',
                        noCheck: true,
                        visible: rowData.order_status == 'paid' || rowData.order_status == 'shipped',
                        onClick: () => { this.toggleWin('shipments', { rowData }) }
                    },
                    {
                        title: '星标订单',
                        visible: rowData.order_status == 'unpaid' || rowData.order_status == 'paid',
                        onAuth: 'add',
                        method: api.add_star_order
                    }, {
                        title: '取消订单',
                        visible: rowData.order_status == 'unpaid' || rowData.order_status == 'paid',
                        onAuth: 'add',
                        method: api.order_cancle
                    }, {
                        title: '完成订单',
                        visible: rowData.order_status == 'shipped',
                        onAuth: 'add',
                        method: api.finish_order
                    }, {
                        title: '激活订单',
                        visible: rowData.order_status == 'canceled',
                        onAuth: 'add',
                        method: api.activation_order
                    }, {
                        title: '查看',
                        noCheck: true,
                        ghost: true,
                        onClick: () => { this.jumpPage('Allorderporedit', rowData.id, 'check') }
                    },
                    ]
                }, {
                    title: '其他',
                    noCheck: true,
                    ghost: true,
                    children: [{
                        title: '催款通知',
                        visible: rowData.order_status == 'unpaid',
                        onAuth: 'add',
                        method: api.send_payment_notice
                    }, {
                        title: '收款通知',
                        visible: rowData.order_status == 'paid',
                        onAuth: 'add',
                        method: api.send_confirm_payment
                    }, {
                        title: '发货通知',
                        visible: rowData.order_status == 'shipped',
                        onAuth: 'add',
                        method: api.send_deliver_goods_notice
                    }, {
                        title: '备注',
                        noCheck: true,
                        visible: true,
                        onClick: () => { this.toggleWin('visibleMark', { rowData }) }
                    }

                    ]
                }],
                unicode: 'order_id|id',
                batConfig: this.props.batConfig,
                rowData
            }
        };

        this.columns = [{
            title: '订单编号',
            dataIndex: 'invoice_no',
            width: 200,
            render: (text, record) => {
                let img = record.source_device == 'phone' ? phone : pc
                return <div style={{ position: 'relative' }}>
                    <img src={img} style={{ marginRight: '5px' }} alt="2222"></img>
                    {text}
                    {
                        record.is_star == 1 ? <img src={xx} style={{ position: 'absolute', right: '-10px', top: '-20px' }} ></img> : ''

                    }
                </div>
            }
        }, {
            title: '收货国家',
            dataIndex: 'country_name',
            width: 200,
            render: (text, record) => {
                return <div>
                    {text}&nbsp;
                    <img style={{ width: '30px' }} src={record.country_flag ? record.country_flag : ''}></img>
                </div>
            }
        }, {
            title: '客服',
            dataIndex: 'customer',
            width: 130,
            render: (text, record) => {
                return <div>
                    {record.manager_name}
                    {
                        record.memo ?
                            <Popover content={this.showModel(record.memo)} title='订单备注' trigger="hover">
                                <Icon type="form" style={{ marginLeft: '3px', color: '#909EA9' }} />
                            </Popover>
                            : ''
                    }
                </div>
            }
        }, {
            title: TooltipTitle('会员名称', '括号内为该会员历史总订单数量'),
            dataIndex: 'email',
            width: 180,
            render: (text, record) => {
                let email =  text ? text : record.shipment_email
                return (<div>
                    <a onClick={() => this.morelink("Memberinfo", '会员信息', email)} style={{ display: 'inline-block', verticalAlign: 'middle' }}>{email}</a>
                    <a onClick={() => this.changeList(text)} style={{ marginLeft: '3px', color: 'red', display: 'inline-block' }}>({record.history_order_count})</a>
                    {
                        record.note != '' ?
                            <Popover content={this.showModel(record.note)} title='订单备注' trigger="hover">
                                <i style={{ marginLeft: '3px', color: '#909EA9' }} className={'iconfont shop_ziyuan26'}></i>
                            </Popover>
                            : null
                    }
                </div>)
            }
        }, {
            title: '收货人',
            dataIndex: 'shipment_firstname',
            width: 100,
            render: (text, record) => {
                return (<div>
                    {record.shipment_firstname}{record.shipment_lastname}
                </div>)
            }
        }, {

            title: TooltipTitle('总额(USD)', '括号内为商品总件数'),
            dataIndex: 'total_price',
            width: 150,
            render: (text, record) => {
                let data = '';
                if (text)
                    data = parseFloat(text).toFixed(2)
                return (<div>
                    <span>{data}</span>
                    <span style={{ marginLeft: '3px' }}>({record.total_number})</span>
                </div>)
            },
        }, {
            title: '物流方式',
            dataIndex: 'shipment_method',
            width: 100,
        }, {
            title: '支付方式',
            dataIndex: 'payment_method',
            width: 140,
            render: (text, record) => {
                return (
                    <div>
                        {
                            record.payment_status == 'manual_paid'
                                ? <div>
                                    <img src={paypal}></img> {text}
                                </div>
                                : <p>{text} </p>


                        }
                    </div>


                )
            },

        }, {
            title: '订单状态',
            dataIndex: 'order_status',
            width: 100,
            render: (text, record) => {
                return (orderstatus(text))
            },

        }, {
            title: '订单时间',
            dataIndex: 'created_at',
            width: 140,
            render: (text, record) => {
                return <div style={{ color: '#AFAFAF' }}>
                    {text}
                </div>
            },
        }, {
            title: '支付时间',
            dataIndex: 'payment_time',
            width: 140,
            render: (text, record) => {
                return <div style={{ color: '#AFAFAF' }}>
                    {text}
                </div>
            },
        }, {
            title: '渠道来源',
            dataIndex: 'channel_name',
            width: 100,
            render: (text, record) => {
                return <div style={{ color: '#AFAFAF' }}>
                    {text}
                </div>
            },
        }, {
            title: '排序',
            dataIndex: 'sort_order',
            width: 180,
            render: (text, record) => {
                return <Input defaultValue={text} onBlur={value => this.onsortBlur(value, record.id, text)}></Input>
            }
        },{
            title: '操作',
            dataIndex: "id",
            width: 300,
            fixed: 'right',
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
    changeSearch(data, id) {

        if (id == 'asteroid') {
            this.props.changeSearch({
                is_star: '1',
                ...data
            })
        } else if (id == 'all') {
            this.props.changeSearch({
                is_star: '',
                ...data
            })
        } else {
            this.props.changeSearch({
                is_star: this.props.params.id == 'asteroid' ? 1 : '',
                ...data
            })

        }


    }
    //点击全部订单数 进行订单搜索
    changeList = (row) => {
        this.changeSearch({
            email: row,
        })

    }
    showModel = (value) => {
        return (
            <div>
                <p>{value}</p>
            </div>
        )
    }

    onChangeSta = (value, rowData) => {
        post(api.changeStoreStatus, { id: rowData.id, status: value ? 1 : 2 }).then(res => {
            if (res) {
                message.success('操作成功')
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        this.id =  nextProps.params.id
   
        if (this.props.params.id != nextProps.params.id) {
            this.changeTab(this.state.activeKey, nextProps.params.id);
        }
    }
    componentDidMount = () => {
        this.changeTab(this.state.activeKey);
        get(api.get_manager_list, {}).then(res => {
            if (res) {
                this.setState({
                    managerlist: res.resultData
                })
            }
        })
        get(api.get_countrys_pager, {}).then(res => {
            if (res) {
                this.setState({
                    countrylist: res.resultData.data
                })
            }
        })
        get(api.get_all_channel_contrast, {}).then(res => {
            if (res) {
                this.setState({
                    contrastlist: res.resultData.data
                })
            }
        })
        get(api.get_all_geo_zone_name, {}).then(res => {
            if (res) {
                this.setState({
                    zonestlist: res.resultData
                })
            }
        })
        get(api.get_pay_method, {}).then(res => {
            if (res) {
                this.setState({
                    paylist: res.resultData
                })
            }
        })
        post(api.get_sources_channel_contrast_pager, {
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

    changeTab = (activeKey, id) => {
        if (activeKey == 10) {
            activeKey = ''
        }
        this.setState({
            activeKey
        });
        let ids = id ? id : 'all'
        this.id = id
        this.changeSearch({
            order_status: activeKey ? activeKey : '',
        }, ids)

    }
    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }
    jumpPage = (link, id = 0, type = 'add') => {
        let url =  link + '/' + id + '/' + type;
        let href = window.location.origin+'/#/'+url
        window.open(href)
    }

    render() {
        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };

        const {
            // dictData,
            managerlist,
            countrylist,
            contrastlist,
            zonestlist,
            activeKey,
            paylist,
            storagecontrast
        } = this.state;
        const storageList = {
            managerlist,
            countrylist,
            contrastlist,
            zonestlist,
            paylist,
            storagecontrast
        }
        const {
        } = this.props;


        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            jumpPage: this.jumpPage,
            batConfig: this.props.batConfig,
            activeKey,
            paylist: paylist,
            changeSearch: this.changeSearch,
        };

        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        props={this.props}
                        changeSearch={this.changeSearch}
                        activeKey={this.state.activeKey}
                        storageList={storageList}
                        activeKey={activeKey}
                        onChange={this.changeTab}
                    />
                    <div className="header-tool">
                        <p>{this.id == 'asteroid' ? '星标订单' : '全部订单'}</p>
                        <ToolWrap values={this.props.values} />
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