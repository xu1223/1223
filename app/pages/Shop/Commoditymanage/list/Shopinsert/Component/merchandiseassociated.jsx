import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import { Card, Button, Row, Col, Table, Input, InputNumber, Popconfirm } from 'antd';
/**
 * 商品关联
 */
class Merchandiseassociated extends Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            type: true
        }
        this.columns = [
            {
                title: '商品图片',
                dataIndex: 'img_m',
                width: 120,
                key: 1,
                render: (text, row, index) => {
                    return <>
                        <img src={text || text != '' ? text : img_m} alt="" style={{ width: 50 }} />
                    </>

                }
            },
            {
                title: '商品名称',
                ColSpan: 9,
                dataIndex: 'name',
                width: 300,
                key: 33,
                render: (text, row, index) => {
                    return <div className='storage-table-style'>
                        {/* <div className='main-img-cont'>{row.main_supplier == 1 ? <img src={img_m} alt="" /> : ''}</div> */}
                        <p>{row.name ? row.name : ''}</p>
                        {/* <p style={{ color: '#4F4F4F' }}>SKU: {row.sku}</p> */}
                    </div>
                }

            },
            {
                title: '子SKU',
                ColSpan: 9,
                dataIndex: 'sku',
                width: 300,
                key: 4,
                render: (text, row = {}, index) => {
                    return <div>SKU: {row.sku}</div>
                }

            },

            {
                title: '操作',
                dataIndex: "operation",
                ColSpan: 0,
                width: 200,
                key: 11,
                render: (text, record, index) => {
                    //TODO:
                    return (<div className='operatingButton'>
                        <Popconfirm title='确定是否删除'
                            okText="确认"
                            cancelText="取消"
                            onConfirm={() => this.deleteShops(record, index)}>
                            <Button type="danger" >删除</Button>
                        </Popconfirm>

                    </div>)
                }
            }
        ]
    }
    /**
     * 添加商品模态框
     */
    addShops = () => {
        this.context.toggleWin('visibleAddShops', {})
    }
    // 取消添加山沟
    deleteShops = (item, index) => {
        let {
            crossSellProducts
        } = this.context
        crossSellProducts = crossSellProducts.splice(index, 1);
        this.setState({
            type: !this.state.type
        })
    }
    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        let { crossSellProducts } = this.context;
        const tableProps = {
            columns: this.columns,
            dataSource: crossSellProducts,
            rowSelection
        }
        return (
            <div className='content-main-card'>
                <Card className='dercription'  >
                    <div className='action-bar'>
                        <Row type="flex" justify='start' align='middle' gutter={10}>
                            <Col>
                                <Button type="primary" onClick={this.addShops}>添加商品</Button>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }} >
                            <Table
                                {...tableProps}
                            />
                        </Row>
                    </div>
                </Card>
            </div>
        )
    }
}
export default Merchandiseassociated 