import React from 'react'
import {
    Button,
    Form,
    Select,
    Modal,
    Col,
    Row,
    Input,
    message,
    Upload,
    Spin,
    Icon
} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;
import { formItemLayout1 } from 'config/localStoreKey';
import './index.less'
import { basicdata } from './config/index'
import api from "@/fetch";
import UploadImg from './Component/uploadImg.jsx'
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        }
    }
    componentDidMount = () => {
        api.order.get_setting_list({ type: 1 }).then((res) => {
            if (res) {
                console.log(res, 'settingsetting')
                this.setState({
                    rowData: res.resultData.setting.site
                })
            }
        })
    }
    save = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const {
                rowData = {},
            } = this.state
            for (var key in values) {
                if (key.indexOf('#') != -1) {
                    let arr = key.split("#")
                    if (values[key]) {
                        rowData.SNS[arr[0]][arr[1]] = values[key]
                    }
                } else {
                    rowData[key] = values[key]
                }
            }
            api.order.save_setting({ setting: JSON.stringify(rowData), type: 1 }).then((res) => {
                if (res) {
                    message.success('保存成功')
                }
            })
        })
    }
    uploadchange = (value) => {
        this.props.form.setFieldsValue({ ...value })
    }
    formchange = (item) => {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            rowData = {},
            fileList = []
        } = this.state
        let html = <Input />
        if (item.type == 'textArea') {
            html = <TextArea rows={4}></TextArea>
        } else if (item.type == 'IMG') {
            html = <UploadImg uploadchange={this.uploadchange}></UploadImg>
        }




        return <Col span={item.span || 7}>
            <FormItem label={item.name}  >
                {getFieldDecorator(item.key, {
                    initialValue: rowData[item.key] ? rowData[item.key] : '',
                    rules: [{ required: item.rules, message: `请输入${item.name}` }],
                })(
                    html
                )}
            </FormItem>
        </Col>

    }
    // 删除sns
    snsclose = (index) => {
        const {
            rowData = {},
        } = this.state
        let that =this
        confirm({
            title: '确定是否删除该数据?',
            content: '',
            onOk() {
                rowData.SNS.splice(index, 1)
                that.setState({
                    rowData
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    snsadd = () => {
        const {
            rowData = {},
        } = this.state
        rowData.SNS.push({
            title: '',
            url: '',
            image: ''
        })
        this.setState({
            rowData
        })
    }


    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            rowData = {},
        } = this.state

        return (
            <div className="Basic-main">
                <div className="header-tool">
                    <p>基本设置</p>
                </div>
                <Form className="bulletbox-form">
                    <Row gutter={16} className="basic-item">
                        <p>基础信息</p>
                        {
                            basicdata.basics.map((item) => {
                                return this.formchange(item)
                            })
                        }
                    </Row>
                    <Row gutter={16} className="basic-item">
                        <p>Meta设置</p>
                        {
                            basicdata.meta.map((item) => {
                                return this.formchange(item)
                            })
                        }
                    </Row>
                    <div className="basic-item">
                        <p>SNS</p>
                        {
                            rowData.SNS ? rowData.SNS.map((item, index) => {
                                return <div className="sns-item">
                                    <FormItem label={'SNS'} {...formItemLayout1}  >
                                        {getFieldDecorator(`${index}#title`, {
                                            initialValue: item.title ? item.title : '',
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem label={'URL'}   {...formItemLayout1} >
                                        {getFieldDecorator(`${index}#url`, {
                                            initialValue: item.url ? item.url : '',
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>
                                    <FormItem label={'图标'}  {...formItemLayout1}  >
                                        {getFieldDecorator(`${index}#image`, {
                                            initialValue: item.image ? item.image : '',
                                        })(
                                            <UploadImg uploadchange={this.uploadchange}></UploadImg>
                                        )}
                                    </FormItem>
                                    <Icon type="close-circle" onClick={() => this.snsclose(index)} />
                                </div>
                            })
                                : ''
                        }

                        <Icon type="plus-square" className="snsadd" onClick={() => this.snsadd()} />
                    </div>
                    <div className="shop-footer-btn">
                        <Button type="primary" onClick={() => this.save()}>保存</Button>

                    </div>
                </Form>
            </div>

        )
    }
}

export default Form.create()(Decorate)