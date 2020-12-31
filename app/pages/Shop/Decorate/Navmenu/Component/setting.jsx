import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';

import {
    Row,
    Col,
    Form,
    Input,
    Radio,
    Select,
    TreeSelect
} from 'antd';
const { TreeNode } = TreeSelect;
import UploadImg from './uploadImg.jsx'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }
    //提交数据
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.context
        let apiname = 'save_menu'
        if (rowData.id) {
            values.id = rowData.id
            apiname = 'edit_menu'

        }
        api.order[apiname]({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('Setting');
            }
        })
        // callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context

    }
    uploadchange = (value) => {

        this.props.form.setFieldsValue({ ...value })
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('Setting');
    }
    onChange = (value) => {
        this.setState({
            formshow: false,
            menutype: value
        }, () => {
            setTimeout(() => {
                this.setState({
                    formshow: true
                })
            }, 1)
        })

    }
    formchange = (value, v, e) => {
        console.log(value, v, e, 3333)
        let data = {}
        if (e) {
            data = e.triggerNode.props.item
        } else {
            data = v.props.item
        }
        let keyarr = {
            'name': '',
            'name_cn': '',
            'url': '',
            'meta_title': '',
            'meta_keyword': '',
            'meta_description': '',
        }
        for (var key in keyarr) {
            keyarr[key] = data[key]
        }
        this.props.form.setFieldsValue({
            ...keyarr
        })
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            rowData = {},
            menutree = [],
            categoryspager = [],
            productlist = []
        } = this.context;

        const {
            formshow = true,
            menutype = rowData.menu_type ? rowData.menu_type : 2
        } = this.state
        let menustop = menutype == 1 ? false : true


        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '导航菜单',
            method: api.save_message_sign,
            visible: this.context.Setting,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '16px' }}>
                            <Col span={24}>
                                <FormItem label="导航类型" {...formItemLayout4} >
                                    {getFieldDecorator('menu_type', {
                                        initialValue: rowData.menu_type ? rowData.menu_type : 2,
                                        rules: [{ required: true, message: '请选择导航类型" ' }],
                                    })(
                                        <Select onChange={this.onChange}>
                                            <Option value={1}>自定义导航</Option>
                                            <Option value={2}>商品分类</Option>
                                            <Option value={3}>商品专题</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="上级导航" {...formItemLayout4} >
                                    {getFieldDecorator('pid', {
                                        initialValue: rowData.pid ? rowData.pid : 0,
                                        rules: [{ required: true, message: '请选择上级导航" ' }],
                                    })(
                                        <Select>
                                            {
                                                menutree.map((item) => {
                                                    return <Option value={item.id}>{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                menutype == 2 ? <Col span={24}>
                                    <FormItem label="选择分类" {...formItemLayout4} >
                                        {getFieldDecorator('category_id', {
                                            initialValue: rowData.category_id ? rowData.category_id : '',
                                            rules: [{ required: true, message: '请选择分类" ' }],
                                        })(
                                            <TreeSelect
                                                showSearch
                                                style={{ width: '100%' }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                placeholder="Please select"
                                                allowClear
                                                treeDefaultExpandAll
                                                treeNodeFilterProp="title"
                                                onChange={this.formchange}
                                            >
                                                {
                                                    categoryspager.map((item) => {
                                                        return <TreeNode item={item} value={item.id} title={item.name} key={item.id} >
                                                            {
                                                                (item.children && item.children.length != 0) ?
                                                                    item.children.map((i) => {
                                                                        return <TreeNode item={i} value={i.id} title={i.name} key={i.id} />
                                                                    })
                                                                    : ''
                                                            }
                                                        </TreeNode>
                                                    })
                                                }

                                            </TreeSelect>



                                        )}
                                    </FormItem>
                                </Col> : ''
                            }
                            {
                                menutype == 3 ? <Col span={24}>
                                    <FormItem label="选择专题" {...formItemLayout4} >
                                        {getFieldDecorator('template_page_id', {
                                            initialValue: rowData.template_page_id ? rowData.template_page_id : '',
                                            rules: [{ required: true, message: '请选择专题" ' }],
                                        })(
                                            <Select onChange={this.formchange}>
                                                {
                                                    productlist.map((item) => {
                                                        return <Option value={item.id} item={item}>{item.name}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> : ''
                            }




                            {
                                formshow ? <div>
                                    <Col span={24}>
                                        <FormItem label="名称" {...formItemLayout4} >
                                            {getFieldDecorator('name', {
                                                initialValue: rowData.name ? rowData.name : '',
                                                rules: [{ required: true, message: '请输入名称" ' }],
                                            })(
                                                <Input disabled={menustop} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="中文别名" {...formItemLayout4} >
                                            {getFieldDecorator('name_cn', {
                                                initialValue: rowData.name_cn ? rowData.name_cn : '',
                                                // rules: [{ required: true, message: '请输入中文别名" ' }],
                                            })(
                                                <Input disabled={menustop} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="导航链接" {...formItemLayout4} >
                                            {getFieldDecorator('url', {
                                                initialValue: rowData.url ? rowData.url : '',
                                                rules: [{ required: true, message: '请输入导航链接" ' }],
                                            })(
                                                <Input disabled={menustop} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="SEO标题" {...formItemLayout4} >
                                            {getFieldDecorator('meta_title', {
                                                initialValue: rowData.meta_title ? rowData.meta_title : '',
                                            })(
                                                <Input disabled={menustop} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="SEO关键字" {...formItemLayout4} >
                                            {getFieldDecorator('meta_keyword', {
                                                initialValue: rowData.meta_keyword ? rowData.meta_keyword : '',
                                            })(
                                                <Input disabled={menustop} />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="SEO描述" {...formItemLayout4} >
                                            {getFieldDecorator('meta_description', {
                                                initialValue: rowData.meta_description ? rowData.meta_description : '',
                                            })(
                                                <TextArea disabled={menustop}></TextArea>
                                            )}
                                        </FormItem>
                                    </Col>
                                </div>
                                    : ''
                            }




                            <Col span={24}>
                                <FormItem label="图片上传" {...formItemLayout4} >
                                    {getFieldDecorator('image', {
                                        initialValue: rowData.image ? rowData.image : '',
                                    })(
                                        <UploadImg uploadchange={this.uploadchange}></UploadImg>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="是否突出" {...formItemLayout4} >
                                    {getFieldDecorator('is_highlight', {
                                        initialValue: rowData.is_highlight ? rowData.is_highlight : 0,
                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="展示位置" {...formItemLayout4} >
                                    {getFieldDecorator('show_system', {
                                        initialValue: rowData.show_system ? rowData.show_system : 1,

                                    })(
                                        <Radio.Group>
                                            <Radio value={1}>PC，Mobile </Radio>
                                            <Radio value={2}>PC</Radio>
                                            <Radio value={3}>Mobile</Radio>
                                        </Radio.Group>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="状态" {...formItemLayout4} >
                                    {getFieldDecorator('is_active', {
                                        initialValue: rowData.is_active ? rowData.is_active + '' : '1',

                                    })(
                                        <Radio.Group>
                                            <Radio value="1">启用</Radio>
                                            <Radio value="0">禁用</Radio>
                                        </Radio.Group>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="排序" {...formItemLayout4} >
                                    {getFieldDecorator('sort_order', {
                                        initialValue: rowData.sort_order ? rowData.sort_order : '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)