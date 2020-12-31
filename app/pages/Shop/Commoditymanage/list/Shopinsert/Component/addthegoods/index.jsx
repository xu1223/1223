import React, { Component } from 'react';
import api from '@/fetch/api';
import pageConfig from './Config';
import { post, get } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import DataOper from '@/advanced/dataOper2';
import { ListContext } from '@/config/context';
import Table from '@/components/TableComp';
import BatOperation from '@/components/BatOperation';
import CategoryComponent from '@/components/CategoryComp'
import {
    Row,
    Col,
    Button,
    Affix,
} from 'antd';
@DataOper(pageConfig)
export default class addshop extends Component {
    // static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            categroyList: [],
            stage: true,
            stageid: '',
            supdata: []
        }


        this.columns = [{
            title: '缩略图',
            dataIndex: 'img_m',
            width: 80,
            render: (text, record, index) => {
                return (
                    <a href={record.image}><img src={text} style={{ width: '60px' }} /></a>
                )
            }
        }, {
            title: '商品信息',
            dataIndex: 'sku',
            width: 150,
            render: (text, row, index) => {
                return (
                    <div>
                        <p>SPU:{row.spu}</p>
                        <p>SKU:{row.sku}</p>
                        <p>COLOR:{row.color}</p>
                        <p>SIZE:{row.size}</p>
                    </div>
                )
            }
        }, {
            title: '商品名称',
            dataIndex: 'name',
            width: 200,
        },  {
            title: '商品分类',
            dataIndex: 'categories',
            width: 200,
            render: (text, record) => {
                return <span>{text.parent_category_name} {
                    text.parent_category_name ? <span> > </span> : ''
                } {text.child_category_name}</span>
            },
        }, {
            title: '商品实际售价格(USD)',
            dataIndex: 'show_price',
            width: 100,
            render: (text, record) => {
                let data = '';
                data = parseFloat(text).toFixed(2)
                return <span>{data}</span>
            },
        }, {
            title: '商品市场价格(USD)',
            dataIndex: 'price',
            width: 100,
            render: (text, row, index) => {
                let data = '';
                data = parseFloat(text).toFixed(2)
                return <span>{data}</span>
            }
        },
        ];
    }
    beforeCallback = (value) => {
        this.props.setSelectRowsadd(this.props.selectedRows)
        this.props.toggleWin('visibleAddShops');
    }

    componentDidMount() {
        post(api.get_category_tree_list).then((res) => {
            if (res.resultId == 200) {
                res.resultData.forEach((item) => {
                    item["children"] = item.children;
                    item["cate_name"] = item.name;
                    item["review_status_num"] = item.parent_id;
                    if (item.children) {
                        item.children.forEach((i) => {
                            i["children"] = i.children ? i.children : [];
                            i["cate_name"] = i.name;
                            i["review_status_num"] = i.parent_id;
                            if (i.children) {
                                i.children.forEach((j) => {
                                    j["children"] = j.children ? j.children : [];
                                    j["cate_name"] = j.name;
                                    j["review_status_num"] = j.parent_id;
                                    // j.label = j.cate_name;
                                    // j.value = j.cate_id
                                });
                            }
                        });
                    }
                });
                this.setState({
                    categroyList: res.resultData,
                });
            }
        });
    }



    onCancel = () => {
        this.props.toggleWin('visibleAddShops');
    }
    handleClick = (e, cateStr) => {
      
        this.props.changeSearch(e)
     
    }
    //清除分类
    clearCategory = () => {
        this.setState({
            categoryId: ''
        }, () => {
            this.props.changeSearch({
                categoryId: ''
            }, this.state.activeKey)
        })
    }

    render() {
        const {
            categroyList,
        } = this.state;
        const {
            dataS,
            //  visible
        } = this.props
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            method: api.add_customer,
            visible: this.props.visibleAddShops,
            onCancel: this.onCancel,
            form: this.props.form,
            winType: 3,
        };
        const cateProps = {
            handleClick: this.handleClick,
            categroyList,
            clearCategory: this.clearCategory,
            type: 'dev',
            ref: ref => this.child = ref
        }
        let param = this.props.tableConfig

        if (param.dataSource) {
            param.dataSource.map(item => {
                item['selechange'] = 0
            })
        }

        const tableProps = {
            columns: this.columns,
            ...param,
        };


        return (
            <ModalComp {...modalProp}>
                <Row style={{padding:'20px'}}>
                    <Col span={6} style={{ marginRight: '10px' }}>
                        <Affix offsetTop={94}>
                            <CategoryComponent {...cateProps} />
                        </Affix>
                    </Col>
                    <Col span={17}>
                        <div className="content-table">
                            <Table {...tableProps} selectedRowKeys={this.state.listSelData} />
                        </div>
                    </Col>
                </Row>
            </ModalComp>
        )
    }
}