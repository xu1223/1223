import React, { Component } from 'react'
import { ListContext } from '@/config/context';
import { formItemLayout2 } from '@/config/localStoreKey'
import {
    Row,
    Col,
    Icon,
    Skeleton,
    Form,
    Input,
    Select,
    Card,
} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
import {  WinTernaryOperator } from '@/components/Confirm/index.js';
export default class Seosettings extends Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            checkAll: false
        }
    }
    render() {
        const {
            form
        } = this.props;
        const {formFieldsName,formFields,_parms} = this.context
        const {
            getFieldDecorator,
        } = form;
        return (
            <>
                <div className='content-main-card'>
                    <Card className='dercription' title={<span><Icon type="file-text" theme="filled" /> SEO设置</span>}>
                        <Skeleton loading={false} paragraph={{ rows: 10 }}>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label='自定义链接:'>
                                        {getFieldDecorator(formFieldsName['url'], {
                                            initialValue: WinTernaryOperator(_parms,'url'),
                                            
                                        })(
                                            <Input width="700px" placeholder="支持字母（英文小写），下划线（_），数字。且必须以字母开头"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label='SEO标题:'>
                                        {getFieldDecorator(formFieldsName['meta_title'], {
                                            initialValue:  WinTernaryOperator(_parms,'meta_title'),
                                            
                                        })(
                                            <Input width="700px" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label='SEO关键字:'>
                                        {getFieldDecorator(formFieldsName['meta_keyword'], {
                                            initialValue: WinTernaryOperator(_parms,'meta_keyword'),
                                           
                                        })(
                                            <Input width="700px" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={16} >
                                    <FormItem {...formItemLayout2} label='SEO描述:'>
                                        {getFieldDecorator(formFieldsName['meta_description'], {
                                            initialValue: WinTernaryOperator(_parms,'meta_description'),
                                           
                                        })(
                                            <TextArea rows={4} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Skeleton>
                    </Card>
                </div>
            </>
        )
    }
}