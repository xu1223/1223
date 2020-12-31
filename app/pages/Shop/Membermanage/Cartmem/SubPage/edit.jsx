import React, {
    Component
} from 'react';
import {
    Form,
    Tabs,
    InputNumber,
    Select,
    message
} from 'antd';
const Option = Select.Option
const TabPane = Tabs.TabPane;
import Table from '@/components/TableComp';
import { ListContext } from '@/config/context'
import Edittool from '../Component/edittool'
import pageConfig from './Config';
import DataOper from '@/advanced/dataOper2';
import { post, get } from 'fetch/request'

import api from 'fetch/api'
import '../index.less';
@DataOper(pageConfig)
export default class orderEdit extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false, //添加商品弹窗
            loading: true,
        }
        const { type, id } = props.params
        this.operType = type
        this.id = id == '0' ? parseInt(id) : id
        this.columns = [{
            title: '图片',
            dataIndex: 'image',
            width: 100,
            render: (text, record, index) => {
                return (
                    <img src={text} style={{ width: '60px' }} />
                )
            }
        }, {
            title: '商品名称',
            dataIndex: 'name',
            width: 100,
            render: (text, record, index) => {
                return (
                    <a href={record.product_url} target="_blank">{text}</a>
                )
            }
        }, {
            title: '规格',
            dataIndex: 'size',
            width: 150,
            render: (text, record, index) => {
                return (
                    <div>
                        <p>color:{record.color}</p>
                        <p>size: &nbsp;&nbsp;
                            {
                                record.product_option_values.Size ? <Select
                                    defaultValue={text}
                                    style={{ width: '90px' }}
                                    onBlur={(event) => this.onSearch(event, record)}
                                >
                                    {
                                        record.product_option_values.Size.map(item => <Option name={item.option_value_name} value={item.id}>{item.option_value_name}</Option>)
                                    }
                                </Select>
                                    : ''
                            }
                        </p>
                    </div>
                )
            }
        }, {
            title: '商品sku',
            dataIndex: 'zsku',
            width: 100,
        }, {
            title: '商品价格（USD）',
            dataIndex: 'price',
            width: 100,
            render: (text, record) => {
                let data = '';
                if (text)
                    data = parseFloat(text).toFixed(2)
                return <div className={'right'}>{data}</div>
            },
        }, {
            title: '重量(KG)',
            dataIndex: 'weight',
            width: 100,
            render: (text, record) => {
                return <div className={'right'}>{text}</div>
            },
        }, {
            title: '加购数量',
            dataIndex: 'quantity',
            width: 100,
            render: (text, record, index) => {
                return (
                    <InputNumber defaultValue={text} min={1} max={99999} onBlur={(event) => this.changeNum(event, record)} />

                )
            },
        }, {
            title: '重量小计(KG)',
            dataIndex: 'total_weight',
            width: 100,
            render: (text, record) => {

                return <div className={'right'}>{text}</div>
            },
        }, {
            title: '小计（USD）',
            dataIndex: 'totol_price',
            width: 100,
            render: (text, record) => {
                let data = 0;
                data = parseFloat(record.price * record.quantity).toFixed(2)
                return <div >{data}</div>
            }
        }];
    }

    componentDidMount() {
        this.props.changeSearch({
            customer_id: this.id
        })

    }
    componentWillUnmount() {
    }
    //修改加购数量
    changeNum(e, item) {
        let param = {}
        param = {
            customer_id: this.id,
            id: item.id,
            quantity: e.target.value,
            products: [{
                option_value_id: item.option_value_id
            }, {
                product_id: item.product_id
            }]
        }
        if (item.quantity == e.target.value) {
            return false
        }
        param['products'] = JSON.stringify(param['products'])

        get(api.save_cart_product, param
        ).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    message.success('修改成功')
                    this.props.changeSearch({
                        customer_id: this.id
                    })
                } else {
                    message.error(res.msg)
                }

            }
        })
    }
    //修改选择值
    onSearch = (e, item) => {
        let param = {
            customer_id: this.id,
            id: item.id,
            product_option_value_id: e,

        }
        get(api.save_cart_product, param).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    message.success('修改成功')
                } else {
                    message.error(res.resultMsg)
                }
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
    //关闭弹窗
    closePage = () => {
        this.props.router.goBack();
    }


    render() {
        const {
            loading,
            visible
        } = this.state;
        const { form, local = {} } = this.props;
        const contextProps = {
            toggleWin: this.toggleWin,
            batConfig: this.props.batConfig,
            operType: this.operType,
            visible,
            loading,
            id: this.id,
            changeSearch: this.props.changeSearch,
            get_customer_carts_detail: this.get_customer_carts_detail,
            get_customer: this.get_customer,
            closePage: this.closePage,
            ...this.state.otherConfig,
        }

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        }
        return (
            <ListContext.Provider value={contextProps}>
                <div className="header-tool">
                    <p>购物车详情</p>
                    <Edittool
                        visible={this.state.visible}
                        param={this.props.param}
                    >

                    </Edittool>
                </div>
                <div className='userStyle' style={{ background: '#fff' }}>


                    <div className=" tabSwitching" style={{ marginTop: '20px' }}>
                        <Table {...tableProps} />
                    </div>
                    {/* {this.state.visible &&
                   
                } */}
                </div>
            </ListContext.Provider>
        )
    }
}


