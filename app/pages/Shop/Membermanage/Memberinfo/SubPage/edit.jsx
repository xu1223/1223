import React, {
    Component
} from 'react';
import {
    Form,
    Tabs,
    Row,
    Col,
    Table
} from 'antd';

const TabPane = Tabs.TabPane;

import { connect } from 'react-redux';
import { ListContext } from '@/config/context'
import RenderTool from '../Component/rendertool'
import Single from '../Component/single'
import { post, get } from 'fetch/request'
import api from 'fetch/api'
import kong1 from '../../../../../../public/img/kong1.png'
import kong2 from '../../../../../../public/img/kong2.png'
import kong3 from '../../../../../../public/img/kong3.png'
import './index.less';

class orderEdit extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false, //添加商品弹窗
            loading: true,
            activeKey: 1, //tab切换值
            id: 0,
        }
        const { type, id } = props.params
        this.operType = type   //获取类型
        this.id = id == '0' ? parseInt(id) : id    //获取id

    }

    componentDidMount() {
        if (this.id) {
            this.get_customer()
            get(api.get_manager_list, {}).then(res => {
                if (res) {
                    this.setState({
                        storagemanager: res.resultData
                    })
                }
            })
            get(api.get_customers_group_pager, {}).then(res => {
                if (res.resultId == 200) {
                    this.setState({
                        storagegroup: res.resultData
                    })
                }
            })
            post(api.get_zones_pager, {
            }).then(res => {
                if (res) {
                    this.setState({
                        zoneArea: res.resultData.data
                    })
                }
            })
            post(api.get_countrys_pager, {
            }).then(res => {
                if (res) {
                    this.setState({
                        storagecountry: res.resultData ? res.resultData.data : []
                    })
                }
            })
        } else {
            this.setState({
                loading: false,
            })
        }
    }

    get_customer() {
        get(api.get_customer, { customer_id: this.id }).then(res => {
            if (res) {
                const initData = res.resultData
                this.setState({
                    loading: false,
                    initData
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
    //返回
    closePage = () => {
        this.props.router.goBack();
    }
    //tab 切换
    changeTab = (val) => {
        this.setState({
            activeKey: val
        })
    }
    //跳转页面
    morelink = (link, name, id) => {
        let url = '/' + link + '/' + id;
        this.props.goLink(url, {
            title: name,
        })
    }
    render() {
        const {
            loading,
            initData = {},//详情数据
            storagemanager,
            storagegroup,
        } = this.state;
        const { form, local = {} } = this.props;
        const contextProps = {
            toggleWin: this.toggleWin,
            batConfig: this.props.batConfig,
            operType: this.operType,
            zoneArea: this.state.zoneArea,
            storagecountry: this.state.storagecountry,
            initData,
            loading,
            id: this.id,
            customer_id: initData.id,
            get_customer: this.get_customer,
            closePage: this.closePage,
            ...this.state.otherConfig,
        }
        const columns = [{
            title: '订单编号',
            dataIndex: 'invoice_no',
            width: 100,
        }, {
            title: '总额（USD）',
            dataIndex: 'total_price',
            width: 100,
        }, {
            title: '总数',
            dataIndex: 'total_number',
            width: 100,
        }, {
            title: '支付方式',
            dataIndex: 'payment_method',
            width: 100,
        }, {
            title: '订单时间',
            dataIndex: 'created_at',
            width: 100,
        }, {
            title: '支付时间',
            dataIndex: 'payment_time',
            width: 100,
        }, {
            title: '订单状态',
            dataIndex: 'order_status',
            width: 100,
            render: (text, record) => {
                let font =
                    text == 'processing' ? '处理中'
                        : text == 'unpaid' ? '未支付'
                            : text == 'paid' ? '已支付'
                                : text == 'partial' ? '部分支付'
                                    : text == 'shipped' ? '已发货'
                                        : text == 'canceled' ? '已取消'
                                            : text == 'completed' ? '已完成'
                                                : text == 'refunded' ? '已退款'
                                                    : text == 'partially_refunded' ? '部分退款' : '数据错误'
                return <div>
                    {font}
                </div>
            }
        },]
        return (
            <div style={{ marginTop: 0, padding: '20px', paddingBottom: 60 }}>
                <ListContext.Provider value={contextProps}>
                    <RenderTool
                        storagemanager={storagemanager}
                        storagegroup={storagegroup}
                    ></RenderTool>

                    <div className="tabSwitching">
                        <Table dataSource={initData.orders ? initData.orders : []} columns={columns} pagination={false} />
                        {
                            initData.order_total_count > 3 ? <a className="tab-link" onClick={() => this.morelink('Allorder', '全部订单', initData.email)}>
                                查看更多（{initData.order_total_count}）</a> : ''

                        }
                        <Row gutter={24} style={{ marginTop: '20px' }}>
                            <Col span={7}>
                                <p className="tab-title">购物车
                                {
                                        initData.total_cart_count > 3 ? <a className="tab-link" onClick={() => this.morelink('Cartmem', '会员购物车', initData.email)}>
                                            查看更多（{initData.total_cart_count}）
                                    </a>
                                            : ''
                                    }
                                </p>
                                {
                                    initData.carts ? initData.carts.length ? initData.carts.map(item => {
                                        return <Single data={item}></Single>
                                    })
                                        : <img src={kong3}></img> : <img src={kong3}></img>
                                }


                            </Col>
                            <Col span={7}>
                                <p className="tab-title">心愿单
                                
                                {
                                    initData.total_wishlist_count > 3 ? <a className="tab-link" onClick={() => this.morelink('wishlist', '会员心愿单', initData.email)}>
                                        查看更多（{initData.total_wishlist_count}）
                              </a>
                                        : ''
                                }
                                </p>
                                {
                                    initData.wishlists ? initData.wishlists.length ? initData.wishlists.map(item => {
                                        return <Single data={item}></Single>
                                    })
                                        : <img src={kong2}></img> : <img src={kong2}></img>
                                }
                             
                            </Col>
                            <Col span={7}>
                                <p className="tab-title">评论
                                {
                                    initData.total_review_count > 3 ? <a className="tab-link" onClick={() => this.morelink('Membercomments', '会员评论', initData.email)}>
                                        查看更多（{initData.total_review_count}）
                              </a>
                                        : ''
                                }
                                
                                </p>
                                {
                                    initData.reviews ? initData.reviews.length != 0 ? initData.reviews.map(item => {
                                        return <Single data={item} type={true}></Single>
                                    })
                                        : <img src={kong1}></img> : <img src={kong1}></img>
                                }
                             
                            </Col>
                        </Row>
                    </div>
                </ListContext.Provider>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        ...state.storage
    }
}

export default Form.create()(connect(
    mapStateToProps,
)(orderEdit))
