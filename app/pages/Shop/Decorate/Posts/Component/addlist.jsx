import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import Ueditor from 'components/Ueditor/index_pub';
import {
    Form,
    Row,
    Col,
    Input,
    message,
    Switch,
    Select,
    Card,
    Affix,
    Button,
    Radio
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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
        const {
            isLink
        } = this.state
        if (rowData.id) {
            values.id = rowData.id
        }
        values.status = values.status ? 1 : 0;
        values.column_id = rowData.parent_id != 0 ? values.parent_id : "";
        values.is_link = isLink != undefined ? isLink : "2";
        values['is_column'] = 0
        if (rowData.is_column != 1 && values.is_link != 1) {
            let _description = window.UE.getEditor('description').getContent();
            values.description = _description != '<p>加载中...</p>' ? _description : rowData.description;
        }
        console.log(values, 'valuesvaluesvalues')
        api.order.save_bottom_column({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('Addlist');
            }
        })

        // callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context
        if (rowData.id) {
            this.getBottomColumn();
        }
        this.getBottomColumnList();

    }
    getBottomColumn = () => {
        const { rowData = {} } = this.context
        api.order.get_bottom_column({ id: rowData.id, is_column: rowData.is_column }).then(res => {
            this.setState({
                initData: res.resultData,
            })
        })
    }
    getBottomColumnList = () => {
        api.order.get_bottom_column_list().then(res => {
            const resData = res.resultData;
            const Rarr = [];
            resData.map(item => {
                const obj = {
                    label: item.title,
                    value: item.id + `-${item.is_column}`,
                    is_column: item.is_column,
                }
                Rarr.push(obj);
            })
            this.setState({
                PcategoryDataList: Rarr
            })
        })
    }


    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('Addlist');
    }


    handleChange = (value) => {
        const { initData = {} } = this.state;
        value != 0 ? initData.is_column = 0 : initData.is_column = 1;
        initData.column_id = value
        this.setState({
            initData: initData,
        })
    }

    handleChangeRadio = (val) => {
        this.setState({ isLink: val.target.value });
    }
    validForm = (rule, value, callback) => {
        const { rowData = {} } = this.context
        let _value = {
            url: value,
            id: rowData.id ? rowData.id : '',
            type: 2
        }
        api.order.check_seo_url_unique({ ..._value }).then((res) => {
            if (res) {
                callback()
            }
        })

    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;


        const {
            rowData = {},
        } = this.context;
        const { initData = {}, description } = this.state;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '分类详情',
            method: api.save_message_sign,
            visible: this.context.Addlist,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
            width: 1200
        };
        const isNav = initData.link != "" && initData.link != undefined;
        const {
            PcategoryDataList = [],
            isLink = isNav ? 1 : 2
        } = this.state;

        return (
            <ModalComp {...modalProp}>
                <Form style={{ padding: '15px' }}>
                    <Row>
                        <Col span={24}>
                            <FormItem
                                label="上级分类"
                                {...formItemLayout4}
                            >
                                {getFieldDecorator('parent_id', {
                                    initialValue: initData.column_id ? initData.column_id + `-1` : '',
                                    rules: [{ required: true, message: '请选择分类' }],
                                })(
                                    <Select onChange={(value) => this.handleChange(value)}>
                                        {
                                            PcategoryDataList.map(item => {
                                                return (<Option key={item.value}>{item.label}</Option>)
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="文章名称"
                                {...formItemLayout4}
                            >
                                {getFieldDecorator("title", {
                                    initialValue: initData.title || initData.name || '',
                                    rules: [{ required: true, max: 50, message: '请输入不超过16个字符的名称' }],
                                })(
                                    <Input placeholder='最多可输入16个字符' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem
                                label="中文别名"
                                {...formItemLayout4}
                            >
                                {getFieldDecorator('title_cn', {
                                    initialValue: initData.title_cn || initData.name_cn || '',
                                    rules: [{ required: false, message: '必填项' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...formItemLayout4} label="排序">
                                {getFieldDecorator('sort_order', {
                                    initialValue: initData.sort_order || '',
                                })(<Input />)}
                            </FormItem>
                        </Col>
                        {
                            <Col span={24}>
                                <FormItem label="导航类型"
                                    {...formItemLayout4}>
                                    {getFieldDecorator("navigationType", {
                                        initialValue: isLink != 1 ? '2' : '1',
                                    })(
                                        <RadioGroup onChange={(value) => this.handleChangeRadio(value)}>
                                            <Radio value="2">自定义内容</Radio>
                                            <Radio value="1">外部URL</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        }

                        {
                            isLink != 2 ? null : <Col span={24}>
                                <FormItem
                                    label="自定义链接"
                                    {...formItemLayout4}
                                >
                                    {getFieldDecorator('url', {
                                        initialValue: initData.url || '',
                                        rules: [{ required: false, message: '必填项' }, { validator: this.validForm }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            isLink != 2 ? null : <Col span={24}>
                                <FormItem
                                    label="SEO标题"
                                    {...formItemLayout4}
                                >
                                    {getFieldDecorator('meta_title', {
                                        initialValue: initData.meta_title || '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            isLink != 2 ? null : <Col span={24}>
                                <FormItem
                                    label="SEO关键字"
                                    {...formItemLayout4}
                                >
                                    {getFieldDecorator('meta_keyword', {
                                        initialValue: initData.meta_keyword || '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            isLink != 2 ? null : <Col span={24}>

                                <FormItem label="SEO描述"
                                    {...formItemLayout4}>
                                    {getFieldDecorator('meta_description', {
                                        initialValue: initData.meta_description || '',
                                    })(
                                        <TextArea rows={4} />
                                    )}

                                </FormItem>
                            </Col>
                        }
                        {
                            isLink != 2 ? '' : <Col span={24} className="description-rich">
                                <FormItem label="详情"
                                    {...formItemLayout4}>
                                    {getFieldDecorator("description", {
                                        initialValue: initData.description || '',
                                        rules: [{ required: false, message: '必填项' }],
                                    })(
                                        <Ueditor id='description' richText={initData.description} />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        {
                            isLink != 1 ? null : <Col span={24}>
                                <FormItem
                                    label="外部链接"
                                    {...formItemLayout4}
                                >
                                    {getFieldDecorator('link', {
                                        initialValue: initData.link || '',
                                        rules: [{ required: false, message: '必填项' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        }
                        <Col span={24}>
                            <FormItem label="状态"
                                {...formItemLayout4}>
                                {getFieldDecorator("status", {
                                    valuePropName: 'checked',
                                    initialValue: initData.status != 0 ? true : false,
                                })(
                                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)