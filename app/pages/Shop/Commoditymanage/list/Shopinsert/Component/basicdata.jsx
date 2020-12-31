import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import { formItemLayout3, formItemLayout2 } from '@/config/localStoreKey';
import {
    Row,
    Col,
    Icon,
    Skeleton,
    Form,
    Input,
    Select,
    Card,
    Checkbox,
    TreeSelect,
    message
} from 'antd';
import Ueditor from 'components/Ueditor/index_pub';
import { WinMessage, WinTernaryOperator } from '@/components/Confirm/index.js';
import SizeGuide from './sizeguide';
const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
/**
 * 基本数据
 */
import '../index.less'
export default class Basicdata extends Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
    }
    /**
     * 同步sku
     */
    synchronizationSku = (type) => {
        const { formFieldsName, dommodityAttribute, dommodityAttributefn } = this.context;
        if (dommodityAttribute.length === 0) {
            WinMessage({
                content: '请先选择分类填写SKU 添加属性数据',
                timer: 5
            })
            return false;
        } else {

        }
        const { getFieldValue } = this.props.form;
        if (type === 'show_price') {
            let show_price = getFieldValue(formFieldsName['show_price']);
            dommodityAttribute.forEach(v => {
                v['show_price'] = show_price
            })
        } else if (type == 'price') {
            let price = getFieldValue(formFieldsName['price']);
            dommodityAttribute.forEach(v => {
                v['price'] = price
            })
        } else if (type === 'weight') {
            let weight = getFieldValue(formFieldsName['weight']);
            dommodityAttribute.forEach(v => {
                v['weight'] = weight
            });
        }
        message.success('同步成功')
        // this.context.toggleWin('visibleAddress', {})
    }

    // 根据分类请求属性值
    onChangegetTree = (value) => {
        this.context.getCcategoryOptionValuefn(value)
    }

    // 生成商品标签
    onTagslist = (data) => {
        if (data instanceof Array) {
            return data.map((v, index) => {
                return <Option key={index} value={v.id}>{v.keyword}</Option>
            })

        } else {
            return []
        }
    }
    //修改shu 
    skuFn = (val) => {
        if (!val.target.value) {
            this.context.isSkufn(false)
        } else {
            this.context.isSkuVal(val.target.value)
            this.context.isSkufn(true)
        }
    }
    //获取 hxcart尺码表 的数据
    setStateSizeTable = (columns, dataSource) => {
        let dataSourceParms = [],
            columnsArry = [],
            valueArr = [];
        columns && columns.map(item => {
            let _dest = item.dataIndex

            if (_dest.indexOf("|") != -1) {
                _dest = _dest.split("|")[0];
            }
            valueArr.push(item.dataIndex);
            columnsArry.push(_dest)
        })
        dataSourceParms.push(columnsArry)


        dataSource.map((item, index) => {
            //delete item.key;
            const arr = [];
            valueArr.map(_item => {
                arr.push(item[_item] || '')
            })
            dataSourceParms.push(arr);
        })
        return dataSourceParms
    }

    render() {
        const {
            form,
            rowData,
            sizeChartBind,
            sizeChartTable,
            size_stage,
        } = this.props;
        console.log(sizeChartTable, 'rowDatarowDatarowDatarowDatarowDatarowData')
        const {
            getFieldDecorator
        } = form;
        const { formFields, formFieldsName, getTreeCategorySimple, getCategorySearchData, _parms } = this.context
        let product_searches = []
        if (_parms.product_searches) {
            _parms.product_searches.map(item => {
                product_searches.push(item.search_id)
            })
        }
        return (
            <>
                <div className='content-main-card'>
                    <Card className='dercription' title={<span><Icon type="file-text" theme="filled" /> 基础信息</span>}>
                        <Skeleton loading={false} paragraph={{ rows: 10 }}>
                            {/* <Form> */}
                            <Row>
                                <Col span={8}>
                                    <FormItem {...formItemLayout3} label='SPU'>
                                        {getFieldDecorator(formFieldsName['model'], {
                                            initialValue: _parms.spu ? _parms.spu : '',
                                            rules: [{ required: true, message: '必填项', }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout3} label='SKU'>
                                        {getFieldDecorator(formFieldsName['sku'], {
                                            initialValue: WinTernaryOperator(_parms, 'sku'),
                                            rules: [{ required: true, message: '必填项', }],
                                        })(
                                            <Input onChange={this.skuFn} />
                                        )}
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label='商品名称:'>
                                        {getFieldDecorator(formFieldsName['name'], {
                                            initialValue: WinTernaryOperator(_parms, 'name'),
                                            rules: [{ required: true, message: '必填项', }],
                                        })(
                                            <Input width="700px" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16} className="shops-info">
                                    <FormItem {...formItemLayout2} label='商品分类:'>
                                        {getFieldDecorator(formFieldsName['category_ids'], {
                                            initialValue: _parms.categories ? _parms.categories.child_category_id : '',
                                            rules: [{ required: true, message: '必填项', }],
                                        })(
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select"
                                                allowClear
                                                onChange={this.onChangegetTree}
                                                treeData={getTreeCategorySimple}
                                            >
                                                {/* {this.renderTreeNodes(categroyList)} */}
                                            </TreeSelect>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className="basicdatga-icon">
                                    <FormItem {...formItemLayout3} label='实际售价:'>
                                        {getFieldDecorator(formFieldsName['price'], {
                                            initialValue: WinTernaryOperator(_parms, 'price'),
                                        })(
                                            <Input addonAfter="USD" />
                                        )}

                                        <i className="iconfont order-ico-tuisong iconfontclick" onClick={() => this.synchronizationSku('price')} title="同步到实际售价"></i>
                                    </FormItem>
                                </Col>
                                <Col span={8} className="basicdatga-icon">
                                    <FormItem {...formItemLayout3} label='市场价 '>
                                        {getFieldDecorator(formFieldsName['show_price'], {
                                            initialValue: WinTernaryOperator(_parms, 'show_price'),

                                        })(
                                            <Input addonAfter="USD" />
                                        )}
                                        <i className="iconfont order-ico-tuisong iconfontclick" onClick={() => this.synchronizationSku('show_price')} title="同步到市场价"></i>

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className="basicdatga-icon shops-info">
                                    <FormItem {...formItemLayout3} label='商品标重'>
                                        {getFieldDecorator(formFieldsName['weight'], {
                                            initialValue: WinTernaryOperator(_parms, 'weight'),

                                        })(
                                            <Input addonAfter="KG" />
                                        )}
                                        <i className="iconfont order-ico-tuisong iconfontclick" onClick={() => this.synchronizationSku('weight')} title="同步到标重"></i>
                                    </FormItem>
                                </Col>
                                <Col span={8}>

                                    <FormItem {...formItemLayout3} label='材质 ：'>
                                        {getFieldDecorator(formFieldsName['material'], {
                                            initialValue: WinTernaryOperator(_parms, 'material'),
                                        })(
                                            <Input />
                                        )}

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label=' 商品标签 ：'>
                                        {getFieldDecorator(formFieldsName['product_searches'], {
                                            initialValue: product_searches,

                                        })(
                                            <Select mode="multiple" >
                                                {this.onTagslist(getCategorySearchData)}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} className="shops-info">
                                    <FormItem {...formItemLayout3} label=' 商品排序 ：'>
                                        {getFieldDecorator(formFieldsName['sort_order'], {
                                            initialValue: _parms.sort_order,
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...formItemLayout3} label='最小起订量 ：'>
                                        {getFieldDecorator(formFieldsName['minimum'], {
                                            initialValue: WinTernaryOperator(_parms, 'minimum'),
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>


                        </Skeleton>
                    </Card>

                </div>
                <div className='content-main-card'>
                    <Card className='dercription' style={{ marginTop: '10px' }} title={<span><Icon type="file-text" theme="filled" /> 商品描述</span>}>
                        <Row>
                            <Col span={20} >
                                <FormItem {...formItemLayout2} label="产品描述">
                                    <Ueditor initialFrameHeight={300} id='wapcontainer1' richText={WinTernaryOperator(_parms, 'description')} />
                                </FormItem>
                            </Col>

                        </Row>

                    </Card>
                </div>
                <div className='content-main-card'>
                    <Card className='dercription' style={{ marginTop: '10px' }} title={<span><Icon type="file-text" theme="filled" /> 商品尺寸信息</span>}>
                        <div className="shops-aded-size-tip">
                            双击单元格可编辑；鼠标滑动至单元格边框可增加行、列
                        </div>
                        <div>
                            {   //处理数据shoptype，为编辑情况展示，其余为详情数据出来之后在进行渲染避免渲染出错
                                (sizeChartTable.length > 0 ||  size_stage || !this.context.shoptype  ) ?
                                    <SizeGuide
                                        {...this.props}
                                        form={form}
                                        initData={rowData}
                                        isEditPager={true}
                                        setStateSizeTable={this.setStateSizeTable}
                                        sizeChartBind={sizeChartBind}
                                        sizeChartTable={sizeChartTable == true ? [] : sizeChartTable}
                                    />
                                    : ''
                            }

                        </div>
                    </Card>
                </div>

            </>
        )
    }
}