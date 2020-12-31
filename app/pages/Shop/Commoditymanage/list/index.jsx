import React, { Component } from 'react'
import pageConfig, { TabsConfig } from './Config';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import Table from '@/components/TableComp';
import SearchWrap from './Component/search';
import ToolWrap from './Component/tool';
import CategoryComponent from '@/components/CategoryComp'
import api from 'fetch/api';
import fetch from 'fetch';
import BatOperation from '@/components/BatOperation'
import {
    post,
} from 'fetch/request';
import {
    Card,
    Tabs,
    Icon,
    Row,
    message,
    Input,
    Col,
    Switch
} from 'antd';
import './index.less'
import { url } from 'koa-router';
const TabPane = Tabs.TabPane;
@DataOper(pageConfig)
export default class Commoditymanage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            areaList: [],
            activeKey: props.activeKey || TabsConfig[0].status,
            categroyList: [],
            addshow: false,
            editshow: false,
            get_search_list: []
        }

        this.columns = [{
            title: '缩略图',
            dataIndex: 'img_m',
            width: 120,
            render: (text, row = {}, index) => {
                return <>
                    <img src={text || text != '' ? text : img_m} alt="" style={{ width: 50 }} />
                </>
            }
        },
        {
            title: '是否批发',
            ColSpan: 9,
            dataIndex: 'is_wholesale',
            width: 100,
            render: (text, row = {}, index) => {
                let istext = text == 1 ? '是' : '否'
                return <div className='storage-table-style'>
                    <p>{istext}</p>
                </div>
            }
        },
        {
            title: '是否限时特价',
            ColSpan: 9,
            dataIndex: 'coupon_special_id',
            width: 100,
            render: (text, row = {}, index) => {
                let istext = text > 1 ? '是' : '否'
                return <div className='storage-table-style'>
                    <p>{istext}</p>
                </div>
            }
        },
        {
            title: '商品名称',
            ColSpan: 9,
            dataIndex: 'name',
            width: 250,
            render: (text, row = {}, index) => {
                return <div className='storage-table-style'>
                    {
                        row.product_url ? <a target="_blank" href={row.product_url}>{row.name ? row.name : ''}</a> :
                            <a>{row.name ? row.name : ''}</a>

                    }
                    <p>SPU: {row.spu ? row.spu : ''}</p>
                    <p>SKU: {row.sku ? row.sku : ''}</p>
                </div>
            }
        },
        {
            title: '商品分类',
            ColSpan: 0,
            dataIndex: 'categories',
            width: 200,
            render: (text, row = {}) => {
                return <div >
                    {
                        row.categories ? <p>
                            {row.categories.parent_category_name}
                            {
                                row.categories.child_category_name && row.categories.parent_category_name ? <span>></span> : ''
                            }
                            {row.categories.child_category_name}
                        </p> : ''
                    }
                </div>
            }
        },
        {
            title: '尺码',
            dataIndex: 'size',
            width: 200,
            ColSpan: 0,

        },
        {
            title: '重量【KG】',
            dataIndex: 'weight',
            width: 130,
            ColSpan: 0,
            render: (text, row = {}, index) => {
                return row.weight ? row.weight : ''
            }
        },
        {
            title: '材质',
            ColSpan: 0,
            dataIndex: 'material',
            width: 180,
            render: (text, row = {}, index) => {
                return row.material ? <p>{row.material}</p> : <p style={{ color: '#F36D6D' }}>未匹配</p>
            }
        },
        {
            title: '上下架时间',
            ColSpan: 0,
            dataIndex: 'published_at',
            width: 120,

        },

        {
            title: '商品价格(USD)',
            ColSpan: 0,
            dataIndex: 'show_price',
            width: 120,//alibaba_sku_mapping
            render: (text, row = {}, index) => {
                return (
                    <>
                        <p style={{ color: '#FD9B52' }}>{row.price ? row.price : ''}</p>
                        <p style={{ color: '#999999', textDecoration: 'line-through' }}>{row.show_price ? row.show_price : ''}</p>
                    </>
                )
            }
        },
        {
            title: '状态',
            ColSpan: 0,
            dataIndex: 'is_publish',
            width: 120,//alibaba_sku_mapping
            render: (text, record = {}, index) => {
                return (
                    <Switch checked={record.is_publish == 1 ? true : false} onChange={(e) => this.onSwitch(record, e)} checkedChildren="上架" unCheckedChildren="下架" />

                )
            }
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
            dataIndex: "operation",
            ColSpan: 0,
            width: 250,
            fixed: 'right',
            render: (text, record, index) => {
                return (<div className='operatingButton' style={{ display: 'flex' }}>
                    <BatOperation {...this._batProps(record)} />

                </div>)
            }
        }];
        this._batProps = (rowData) => {
            let obj = {
                config: [
                    {
                        title: '编辑',
                        noCheck: true,
                        size: 'small',
                        ghost: true,
                        url: `ShopInsertedit/${rowData.id}/edit`
                    },
                    {
                        title: '操作',
                        children: [{
                            title: "上架",
                            visible: rowData.is_publish == 1 ? false : true,
                            onClick: (e) => this.putaway('add', rowData)
                        }, {
                            title: "下架",
                            visible: rowData.is_publish == 1 ? true : false,
                            onClick: () => this.putaway('dow', rowData)
                        }, {
                            title: "指定上架",
                            noCheck: true,
                            visible: rowData.is_publish == 1 ? false : true,
                            onClick: (e) => this.putaway('moreadd', rowData)
                        }, {
                            title: "指定下架",
                            noCheck: true,
                            visible: rowData.is_publish == 1 ? true : false,
                            onClick: () => this.putaway('moredow', rowData)
                        },]
                    },
                ],
                rowData,
                unicode: 'id|id',
                batConfig: this.props.batConfig
            }
            return obj
        }
    }
    // 修改排序值
    onsortBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.set_products_sort_order({
            product_id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
            }
        })
    }

    //v存在为上架  不存在为下架
    onSwitch = (e, v) => {
        if (v) {
            this.putaway('add', e)
        } else {
            this.putaway('dow', e)
        }
    }
    //控制单个上下架
    putaway(type, rowData) {
        if (type == 'editshow') {
            this.toggleWin('editshow', type, rowData)
        } else {
            this.toggleWin('addshow', type, rowData)
        }
    }
    componentDidMount = () => {
        const { params } = this.props;
        this.props.changeSearch({
            storage_id: params.id
        })
        this.changeTab(this.state.activeKey)
        post(api.get_products_pager).then(res => {
        }).catch(e => {
            console.log(e)
        });
        post(api.get_category_tree_list).then(res => {
            this.setState({
                categroyList: res.resultData
            })
        })
        post(api.get_search_list).then(res => {
            this.setState({
                get_search_list: res.resultData
            })
        })

    }
    // tab切换
    changeTab = (activeKey, stage, params) => {
        this.setState({
            activeKey: activeKey
        });
        this.props.changeSearch({ is_publish: activeKey, ...params }, activeKey);
    }

    handleClick = (e, cateStr) => {  //分类类别回调，点击获取id值，进行分类搜索

        this.props.changeSearch(e)
    }
    // 清空搜索回调  置空站位
    clearCategory = () => {

    }
    // 

    toggleWin = (key = 'visible', other, rowData) => {
        let otherConfig = {
            type: other,
            rowData: rowData
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })
    }
    render() {
        const { activeKey, categroyList, get_search_list } = this.state;
        const { local = {} } = this.props;
        const { storageInitData = {}, storageList } = local;
        const { area = [] } = storageInitData;
        const dictData = area
        //表格定义参数 TODO： 这里只需要改 this.columns
        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        }
        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            categroyList: categroyList,
            editshow: this.state.editshow,
            addshow: this.state.addshow,
            get_search_list: this.state.get_search_list,
            dictData,
            storageList,
            batConfig: this.props.batConfig,
            changeSearch: this.props.changeSearch,
        };
        //分类列表处理数据
        categroyList.forEach(item => {
            item['children'] = item.children;
            item['cate_name'] = item.name;
            item['review_status_num'] = item.parent_id;
            if (item.children) {
                item.children.forEach(i => {
                    i['children'] = i.children ? i.children : []
                    i['cate_name'] = i.name;
                    i['review_status_num'] = i.parent_id;
                    if (i.children) {
                        i.children.forEach(j => {
                            j['children'] = j.children ? j.children : []
                            j['cate_name'] = j.name;
                            j['review_status_num'] = j.parent_id;
                        })
                    }
                })

            }
        })
        const cateProps = {
            handleClick: this.handleClick,
            categroyList: categroyList,
            clearCategory: this.clearCategory,
            type: 'infringement',
        }

        return (
            <div className="tabSwitching firstLegFeeSet">
               
                <div className='userStyle'>
                    <ListContext.Provider value={contextProps}>
                        <SearchWrap
                            changeSearch={this.props.changeSearch}
                            dictData={get_search_list}
                            storageList={storageList}
                            activeKey={this.state.activeKey}
                            onChange={this.changeTab} />
                        <div className="header-tool">
                            <p>商品列表
                   
                            </p>

                            <ToolWrap {...this.props} />
                        </div>
                        {
                                    TabsConfig ? <Tabs
                                        type="card"
                                        activeKey={this.state.activeKey}
                                        onChange={(e) => this.changeTab(e)}
                                    >
                                        {
                                            TabsConfig.map((item) =>
                                                <TabPane tab={<span>{item.name}</span>} key={item.id}></TabPane>)
                                        }
                                    </Tabs> : ''
                        }
                        <Card className="content-main">

                            <Row className='content'>
                                <Col span={3}>
                                    <CategoryComponent {...cateProps} />
                                </Col>
                                <Col span={21}>
                                    <div className="content-table" style={{ paddingTop: '0' }} >
                                        <Table
                                            {...tableProps}


                                        />
                                    </div>

                                </Col>

                            </Row>

                        </Card>
                    </ListContext.Provider>
                </div>
            </div>
        )
    }
}
