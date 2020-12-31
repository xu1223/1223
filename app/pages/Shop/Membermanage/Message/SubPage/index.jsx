import React, {
    Component
} from 'react';
import {
    Form, Input, Checkbox, Button, Select, message
} from 'antd';
import { ListContext } from '@/config/context'
import { formItemLayout6 } from 'config/localStoreKey'
import { post, get } from 'fetch/request'
import api from 'fetch/api'
import Ueditor from 'components/Ueditor/index_pub';
import './index.less'
const { Option } = Select;
const FormItem = Form.Item
class orderEdit extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            rowData: {},
            text: '',
            customer_list: [],
            emailid: [],
            emaildata: []
        }
        const { type, id } = props.params
        this.operType = type
        this.id = id == '0' ? parseInt(id) : id
    }

    componentDidMount() {

        if (this.operType == 'edit') {  //判断是否是编辑  编辑进行回显
            post(api.get_message, {
                id: this.id
            }).then(res => {
                if (res.resultId == 200) {
                    let data = res.resultData
                    const text = `<p>
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br/>
                 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<br/>
                 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </p>
                <p>
                    ------------ Last message ------------
                </p>
                <div style="font-size: 12px;background:#efefef;padding:8px;">
                    <div style="padding:10px">
                        <strong>From ： </strong> (${data.from_email})
                    </div>
                    <div style="padding:10px">
                        <strong>Time ：</strong> ${data.created_at}
                    </div>
                    <div style="padding:10px">
                        <strong>Title ：</strong>${data.title}
                    </div>
                </div>
                <div>
                    <br/>
                </div>
                <div style="padding:10px">
                    ${data.content}
                </div>
                
                Last message
                <p>
                ------------ Last message ------------
               </p>

                `
                let to_email = []
                if(res.resultData.to_emails && res.resultData.to_emails.length >0){
                    res.resultData.to_emails.map((item)=>{
                        to_email.push(item.email)
                    })
                    
                }
                    this.setState({
                        emailid: res.resultData.from_email ? res.resultData.from_email : to_email,
                        text: text,
                        rowData: res.resultData,
                        emaildata: [{
                            "customer_id": res.resultData.customer_id,
                            "email": res.resultData.from_email
                        }]
                    })

                }
            })
        } else if (this.operType == 'check') {
            post(api.get_draft_message, {
                draft_id: this.id
            }).then(res => {
                if (res.resultId == 200) {
                    let emailid = []
                    res.resultData.to_emails.map(item => {
                        this.state.emaildata.push({
                            customer_id: item.customer_id,
                            email: item.email
                        })
                        emailid.push(
                            item.email
                        )
                    })
                    this.setState({
                        emailid: emailid,
                        rowData: res.resultData,
                        text: res.resultData.content
                    })

                }
            })


        }

    }

    // 提交前处理数据源
    handleSubmit = (value) => {
        value.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values,)
            if (!err) {
                let param = {
                    title: values.title,
                    to_email: JSON.stringify(this.state.emaildata),
                    send_email: values.send_email ? 1 : 0
                }
                if (this.operType == 'check') {
                    param['draft_id'] = this.id
                } else {
                    param['message_id'] = this.id == 0 ? '' : this.id
                }
                param['content'] = UE.getEditor("wapcontainer1")
                    ? UE.getEditor("wapcontainer1").getContent()
                    : ""
                param['content'] = param['content']
                post(api.save_message, param).then(res => {
                    if (res) {
                        if (res.resultId) {
                            message.success(res.resultMsg)
                            this.closePage()
                        }
                    }
                })

            }
        })
    }

    // 存入草稿箱
    drafts = (value) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let param = {
                    title: values.title,
                    to_email: JSON.stringify(this.state.emaildata),
                    send_email: values.send_email ? 1 : 0
                }
                if (this.operType == 'check') {
                    param['draft_id'] = this.id
                }
                param['content'] = UE.getEditor("wapcontainer1")
                    ? UE.getEditor("wapcontainer1").getContent()
                    : ""
                param['content'] = param['content']
                post(api.save_message_draft, param).then(res => {
                    if (res) {
                        if (res.resultId) {
                            message.success(res.resultMsg)
                            this.closePage()
                        }
                    }
                })

            }
        })
    }
    // 关闭弹窗
    shopclose = () => {
        this.props.router.goBack();
    }
    // 通过输入值搜索邮箱
    handleChange = (value) => {
        if (value.length > 5) {
            post(api.get_customer_list, {
                email: value
            }).then(res => {
                this.setState({
                    customer_list: res.resultData
                })
            })
        }

    }

    // 获取选中邮箱
    onChange = (val, value) => {
        let param = []

        val.map((item, index) => {
            this.state.emaildata.map(v => {
                if (item == v.email) {  //判断邮箱值是否重复
                    param.push(v)
                    delete value[index]
                }
            })
        })
        value.map(item => {
            param.push({
                customer_id: item.props.value,
                email: item.props.children
            })
        })
        this.setState({
            emaildata: param
        })

    }
    // 回到列表页
    closePage = () => {
        this.props.router.goBack();
    }

    render() {
        const {
            rowData,
            emailid,
            text,
            customer_list
        } = this.state;
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <div className='main'>
                <Form
                    onSubmit={this.handleSubmit}
                >

                    <FormItem label="会员邮箱"   {...formItemLayout6}>
                        {getFieldDecorator('to_email', {
                            initialValue: emailid ? emailid : [],
                            rules: [{ required: true, message: '请输入会员邮箱，最少输入5位' }],
                        })(
                            <Select
                                mode="multiple"
                                placeholder="请输入会员邮箱，最少输入5位"
                                onSearch={this.handleChange}
                                onChange={this.onChange}
                                style={{ width: '100%' }}
                            >
                                {
                                    customer_list.map(item => {
                                        return <Option key={item.id} value={item.id}>{item.email}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="主题"   {...formItemLayout6}>
                        {getFieldDecorator('title', {
                            initialValue: rowData.title ? rowData.title : '',
                            rules: [{ required: true, message: '请输入主题' }],
                        })(
                            <Input></Input>
                        )}
                    </FormItem>
                    <FormItem label="内容"   {...formItemLayout6}>
                        {getFieldDecorator('tag_ids', {
                        })(
                            <div>
                                <Ueditor initialFrameHeight={300} id='wapcontainer1' richText={text} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem label=""   {...formItemLayout6}>
                        {getFieldDecorator('send_email', {
                        })(
                            <Checkbox value="1" >是否同时发送邮件</Checkbox>
                        )}
                    </FormItem>
                    <div className="shop-footer-btn">
                        <div>
                            <Button type="primary" htmlType="submit" className="saveForm">
                                发送
                            </Button>
                            <Button type="primary" onClick={this.drafts} className="saveForm">
                                存草稿箱
                              </Button>
                            <Button htmlType="button" onClick={() => this.shopclose()} className="close">
                                关闭
                             </Button>
                        </div>
                    </div>
                </Form>

            </div>
        )
    }
}

export default Form.create()(orderEdit)
