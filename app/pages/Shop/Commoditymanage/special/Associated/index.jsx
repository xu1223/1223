import React, { Component } from 'react';
import api from '@/fetch/api';
import fetch from '@/fetch';
import pageConfig, { TabApi } from './Config';
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
            channel_contrast: [],
            listdata: [],
        }
        this.id = ''

        const _batProps = (rowData) => {
            return {
                config: [ {
                    title: '解除关联',
                    onAuth: 'add',
                    noCheck: true,
                    method: api.remove_collection_associated_products,
                    childrenData:{
                        ids: rowData.id
                    }
                }],
                unicode: 'id|ids',
                batConfig: this.props.batConfig,
                rowData,
                
            }
        };


        this.columns = [{
            title: '图片',
            dataIndex: 'product',
            render: (text, record) => {
                let data = record.product
                return <img src={data.img_m} style={{width:'150px',height:'150px'}}></img>
            }
        }, {
            title: '商品名称/商品SKU/商品分类',
            dataIndex: 'name',
            width:'600px',
            render: (text, record) => {
                let data = record.product
                return <div>
                    <a href={data.product_url}>{data.name}</a>
                    <p>{data.sku}</p>
                    <p>{data.categories.parent_category_name} > {data.categories.child_category_name}</p>
                </div>
            }
        },
        {
            title: '商品价格（USD）',
            dataIndex: 'price',
            width:'150px',
            render: (text, record) => {
                let data = record.product
                return <span>{data.price}</span>
            }
        },
        {
            title: '上架时间',
            dataIndex: 'published_at',
            render: (text, record) => {
                let data = record.product
                return <span>{data.published_at}</span>
            }
        },
        {
            title: '排序',
            dataIndex: 'sort_order',
            width: 150,
            render: (text, record) => {
                return <Input disabled={record.manager_id == -1 ? true : false} defaultValue={text} onBlur={value => this.onBlur(value, record.id, text)}></Input>
            }
        },
        {
            title: '操作',
            dataIndex: "id",
            width: 150,
            fixed: 'right',
            render: (text, record) => {
                return <BatOperation {..._batProps(record)} />
            }
        }
        ]



    }

    // 修改排序值
    onBlur = (e, id, text) => {
        if (e.target.value == text) {
            return

        }
        fetch.order.sort_collection_associated_products({
            id: id,
            sort_order: e.target.value
        }).then((res) => {
            if (res) {
                message.success('修改成功')
                this.props.changeSearch({})
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
        if (this.props.params) {
            let { id } = this.props.params;  //获取id
            this.id = id
            this.props.changeSearch({
                collection_id: id
            })
        }
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


    //    跳转页面
    jumpPage = (link, id = 0, type = 'add') => {
        let url = link + '/' + id + '/' + type;
        let href = window.location.origin + '/#/' + url
        window.open(href)
    }

    render() {
        const {


            channel_contrast,
            rowData,
        } = this.state;

        const tableProps = {
            columns: this.columns,
            ...this.props.tableConfig,
        };
        const {
        } = this.props;

        const contextProps = {
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            jumpPage: this.jumpPage,
            batConfig: this.props.batConfig,
            id:this.id,
            channel_contrast,
            changeSearch: this.props.changeSearch,
            rowData
        };


        return <div className="tabSwitching">

            <div className='userStyle listStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        changeSearch={this.props.changeSearch}

                        channel_contrast={channel_contrast}
                    />
                    <div className="header-tool">
                        <p>专题商品</p>
                        <ToolWrap changeSearch={this.props.changeSearch} values={this.props.values} />
                    </div>
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