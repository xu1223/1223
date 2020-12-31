import React, { Component } from 'react';
import api from '@/fetch';
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import './index.less'
import {
    Row,
    Col,
    Form,
    Input,
    Radio,
    Button,
    Tooltip,
    Select
} from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
import Ueditor from 'components/Ueditor/index_pub';
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
        if (rowData.id) {
            values.id = rowData.id
        }
        api.order.save_bottom_column({ ...values }).then((res) => {
            if (res) {
                this.props.changeSearch()
                this.context.toggleWin('list');
            }
        })
    }

    componentDidMount() {
        const { rowData = {} } = this.context

    }
    variatechange = () => {
        UE.getEditor("wapcontainer1").execCommand('inserthtml', '<span>测试数据</span>');
        this.setState({
            variateshow: false
        })
    }
    onVisibleChange = (val) => {
        this.setState({
            variateshow: val
        })
    }

    templateChange = (val) => {
        this.setState({
            templateshow: val
        })
    }
    // 关闭弹窗
    onCancel = () => {
        this.context.toggleWin('list');
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            variateshow,
            templateshow
        } = this.state
        const {
            rowData = {},
            activeKey,
            collection_pager = []
        } = this.context;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '分类详情',
            method: api.save_message_sign,
            visible: this.context.list,
            onCancel: this.onCancel,
            form: this.props.form,
            width: '90%',
            ...this.context.batConfig,
        };

        return (
            <ModalComp {...modalProp}>
                <Form className="bulletbox-form">
                    <div className='collapse-style' style={{ padding: '20px' }}>
                        <Row style={{ marginTop: '16px' }}>
                            {
                                activeKey == 'list' ? <div>
                                    <Col span={24}>
                                        <FormItem label="任务名称" {...formItemLayout4} >
                                            {getFieldDecorator('title', {
                                                initialValue: rowData.title ? rowData.title : '',
                                                rules: [{ required: true, message: '请输入任务名称" ' }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="邮件标题" {...formItemLayout4} >
                                            {getFieldDecorator('title_cn', {
                                                initialValue: rowData.title_cn ? rowData.title_cn : '',
                                                rules: [{ required: true, message: '请输入邮件标题" ' }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="收件人" {...formItemLayout4} >
                                            {getFieldDecorator('title_cn', {
                                                initialValue: rowData.title_cn ? rowData.title_cn : '',
                                                rules: [{ required: true, message: '请输入收件人" ' }],
                                            })(
                                                <Input />
                                            )}
                                        </FormItem>
                                    </Col>
                                </div>
                                    : <div>
                                        <Col span={24}>
                                            <FormItem label="提醒类型" {...formItemLayout4} >
                                                {getFieldDecorator('title', {
                                                    initialValue: rowData.title ? rowData.title : '',
                                                    rules: [{ required: true, message: '请输入任务名称" ' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="收件人" {...formItemLayout4} >
                                                {getFieldDecorator('title_cn', {
                                                    initialValue: rowData.title_cn ? rowData.title_cn : '',
                                                    rules: [{ required: true, message: '请输入邮件标题" ' }],
                                                })(
                                                    <Input />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="备注" {...formItemLayout4} >
                                                {getFieldDecorator('title_cn', {
                                                    initialValue: rowData.title_cn ? rowData.title_cn : '',
                                                    rules: [{ required: true, message: '请输入收件人" ' }],
                                                })(
                                                    <TextArea />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>
                            }


                            <Col span={24}>
                                <FormItem label="模板" {...formItemLayout4} >
                                    <Tooltip
                                        overlayClassName="templatetooltip"

                                        title={
                                            <div>

                                            </div>
                                        } trigger="click" onVisibleChange={this.templateChange} visible={templateshow}>
                                        <Button>选择模板</Button>
                                    </Tooltip>
                                </FormItem>
                            </Col>
                            <Col span={16}>
                                <FormItem label="内容" {...formItemLayout4} >
                                    <div>
                                        <Select
                                            mode="multiple"
                                            placeholder="添加邮件商品"
                                        >
                                            {
                                                collection_pager.map((item) => {
                                                    return <Option value={item.id} key={item.id} >{item.name}</Option>
                                                })
                                            }
                                        </Select>
                                        {
                                            activeKey == 'remind' ? <Tooltip title={
                                                <div className="variate-main">
                                                    <p onClick={this.variatechange}>订单ID</p>
                                                    <p onClick={this.variatechange}>客户名称</p>
                                                    <p onClick={this.variatechange}>客户地址</p>
                                                    <p onClick={this.variatechange}>物流方式</p>
                                                    <p onClick={this.variatechange}>物流跟踪号</p>
                                                    <p onClick={this.variatechange}>产品名称</p>
                                                    <p onClick={this.variatechange}>客服名字</p>
                                                </div>
                                            } trigger="click" onVisibleChange={this.onVisibleChange} visible={variateshow}>
                                                <a>+系统变量</a>
                                            </Tooltip> : ''
                                        }
                                    </div>


                                </FormItem>

                            </Col>
                            <Ueditor id='wapcontainer1'
                                richText={rowData.title_cn ? rowData.title_cn : ''} />

                        </Row>
                    </div>
                </Form>
            </ModalComp>
        )
    }
}

export default Form.create()(add)