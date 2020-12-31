import React, { Component } from 'react';

import {
    Form,
    Row,
    Col,
    Input,
    Icon,
    Switch,
    Select,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { formItemLayout1, formItemLayout6 } from 'config/localStoreKey'
import api from '@/fetch/api';
import { post } from 'fetch/request'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';
import UploadImg from './uploadImg'

class SaveCategoryPage extends Component {
    static defaultProps = {

    };

    state = {
        categoryStr: [],
        infndata: {}
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        const {
            rowData = {},
        } = this.context;
        // 获取详情数据
        if (rowData.id) {
            post(api.get_category, {
                id: rowData.id
            }).then(res => {
                this.setState({
                    infndata: res.resultData,
                })
            })
        }
    }
    //   保存
    beforeCallback = (values, callback) => {
        const {
            rowData = {},
        } = this.context;
        const len = Object.keys(rowData).length == 0;   //判断是否为编辑， true为新增 false为编辑
        let _id = ''
        if (values.parent_id instanceof Array) {  //判断id数组，只取最后一位
            _id = values.parent_id[values.parent_id.length - 1]
        } else {  //回显时只有单个id不会出现数组情况 
            _id = values.parent_id
        }
        let _values = {
            parent_id: _id,
            name: values.name,
            name_cn: values.name_cn,
            filter_ids: values.filter_ids.toString(),
            sort_order: values.sort_order,
            meta_title: values.meta_title,
            meta_description: values.meta_description,
            meta_keyword: values.meta_keyword,
            url: values.url,
            advertising_image: values.advertising_image
        }
        if (!len) {
            _values.id = rowData.id
        }
        callback(_values)
        this.context.getproductCategorySelectAll()
    }

    //  关闭
    onCancel = () => {
        this.props.form.resetFields();  //清除之前所填写数据避免回显
        this.context.toggleWin('visibleCategory', {});
    }
    handleChange = () => {

    }
    uploadchange = (value) => {

        this.props.form.setFieldsValue({ ...value })
    }

    render() {

        const {
            getFieldDecorator,
        } = this.props.form;
        const {
            get_filter_list
        } = this.props
        const {
            rowData = {},
            ProductCategoryDataList,
        } = this.context;

        const len = Object.keys(rowData).length == 0;
        const {
            infndata
        } = this.state;

        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: len ? <span>新增产品分类</span> : <span>编辑产品分类</span>,
            visible: this.context.visibleCategory,
            method: api.save_category,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        }
        // 获取筛选器组内的id，用于回显
        let rowData_id = []
        rowData_id.push(infndata.parent_id)
        let filter_ids = []
        if (infndata.filter_group) {
            let filter_group = infndata.filter_group
            filter_group.map(item => {
                filter_ids.push(item.filter_id)
            })
        }


        return (
            <ModalComp
                {...modalProp}
            >
                <Form className="resetFormStyle" style={{ padding: '20px' }}>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="上级分类"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('parent_id', {
                                    initialValue: rowData_id ? rowData_id == 0 ? '顶级分类' : rowData_id : [],
                                    rules: [{ required: true, message: '请选择分类' }],
                                })(
                                    <Select allowClear={true} >
                                        {
                                            ProductCategoryDataList.map(item => {
                                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                                            })
                                        }

                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="分类名称"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('name', {
                                    initialValue: infndata.name || '',
                                    rules: [{ required: true, message: '请输入名称' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="分类中文名称"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('name_cn', {
                                    initialValue: infndata.name_cn || '',
                                    rules: [{ required: true, message: '请输入名称' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="筛选器组"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('filter_ids', {
                                    initialValue: filter_ids || [],
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder="Please select"
                                        defaultValue={['a10', 'c12']}
                                        onChange={() => this.handleChange}
                                        style={{ width: '100%' }}
                                    >
                                        {
                                            get_filter_list.map(item => {
                                                return <Option key={item.id} value={item.id}>{item.alias}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="排序"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('sort_order', {
                                    initialValue: infndata.sort_order || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="自定义链接"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('url', {
                                    initialValue: infndata.url || '',
                                })(

                                    <Input placeholder="支持字母（英文小写），下划线（_），数字。且必须以字母开头！" />
                                )}
                            </FormItem>
                        </Col>     <Col span={24}>
                            <FormItem
                                label="SEO标题"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('meta_title', {
                                    initialValue: infndata.meta_title || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>     <Col span={24}>
                            <FormItem
                                label="SEO关键字"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('meta_keyword', {
                                    initialValue: infndata.meta_keyword || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="SEO描述"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('meta_description', {
                                    initialValue: infndata.meta_description || '',
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="广告图"
                                {...formItemLayout6}
                            >
                                {getFieldDecorator('advertising_image', {
                                    initialValue: infndata.advertising_image ? infndata.advertising_image : '',
                                })(
                                    <UploadImg uploadchange={this.uploadchange}></UploadImg>
                                )}
                            </FormItem>
                        </Col>

                    </Row>
                </Form>
            </ModalComp >
        )
    }
}
export default Form.create()(SaveCategoryPage)