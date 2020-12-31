import React, {
    Component
} from 'react';
import {
    Form,
    Tabs,
    Row,
    Select,
    message,
    Col
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
            width: 300,
            render: (text, record, index) => {
                return (
                    <a href={record.product_url} target="_blank">{text}</a>
                )
            }
        },
        {
            title: '商品sku',
            dataIndex: 'sku',
            width: 100,
        }, {
            title: 'SKU属性',
            dataIndex: 'product_option_values',
            width: 300,
            render: (text, record) => {
                let color = text.Color ? text.Color[0].option_value_name : ''
                let size = text.Size ? text.Size : []
                return <div className={'right'}>
                    {
                        text ?
                            <Row>
                                <Col span={12}>
                                    color: {color}
                                </Col>
                                <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '5px' }}>size: </span>
                                    <Select
                                        showSearch
                                        style={{ width: '80px' }}
                                        placeholder=""
                                        optionFilterProp="children"
                                        onChange={(val) => this.onSearch(val, record)}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {
                                            size.map(item => {
                                                return <Option value={item.id}>{item.option_value_name}</Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            : ''
                    }

                </div>
            },
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
            title: '商品分类',
            dataIndex: 'categories',
            width: 100,
            render: (text, record) => {
                return <div className={'right'}>
                    {
                        record.categories ? <span>{record.categories.parent_category_name} {
                            record.categories.parent_category_name ? <span> > </span> : ''
                        }  {record.categories.child_category_name}</span>
                            : ''
                    }


                </div>
            },
        },



        ];
    }

    componentDidMount() {
        this.props.changeSearch({
            customer_id: this.id
        })

    }
    componentWillUnmount() {
    }

    onSearch = (e, val) => {
        val['issize'] = e
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
                    <p>心愿单详情</p>
                    <Edittool changeSearch={this.props.changeSearch}>

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


