import React, { Component } from 'react';

import {
    Form,
    Select,
    Modal,
    Spin
} from 'antd';
const { confirm } = Modal;
const FormItem = Form.Item;
const Option = Select.Option;
import { formItemLayout2 } from 'config/localStoreKey'
import api from 'fetch/index'
import { ListContext } from '@/config/context';
import { ModalComp } from '@/components/ModalComp2';
import '../index.less'
class Add extends Component {
    static defaultProps = {

    };

    state = {
        categoryStr: [],
    }
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
    }

    //    保存
    beforeCallback = (values, callback) => {
        this.context.iframeadd(JSON.parse(values.key))
        this.onCancel()
        // callback(param);
    }

    // 关闭
    onCancel = () => {
        this.props.form.resetFields();  //清除之前选择项，避免回显问题
        this.context.toggleWin('addvisible', {});
    }
    additem = (id) => {
        const {
            tpl_page_id,
            tpl_id,
        } = this.context
        let param = {
            section_id: id,
            tpl_id,
            tpl_page_id
        }
        let that = this
        confirm({
            content: '是否添加该模板',
            onOk() {
                that.setState({
                    loading:true
                })
                api.order.get_template_section_detail({
                    ...param
                }).then((res) => {
                    if (res) {
                        that.context.iframeadd(res.resultData)
                        that.onCancel()
                    }
                })
            },
            onCancel() {
            },
        });
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;

        const {
            rowData = {},
            addtemplate = [],
        } = this.context;

        const modalProp = {
            wrapClassName: 'shop-Modal',
            beforeCallback: this.beforeCallback,
            closable: false,
            title: false,
            footer: false,
            visible: this.context.addvisible,
            onCancel: this.onCancel,
            form: this.props.form,
            width: 1000,
            ...this.context.batConfig,
        }
        const{
            loading = false
        } = this.state
        return (

            <ModalComp
                {...modalProp}
            >
                <Spin spinning={loading}>
                    <div className="decora-add-main">
                        {
                            addtemplate.map((item) => {
                                if (item.blocks.length == 0) {
                                    return <div className="decora-add-item" onClick={() => this.additem(item.id)}>
                                        <img src={item.image}></img>
                                        <p>{item.name}</p>
                                    </div>
                                } else {
                                    return item.blocks.map((v) => {
                                        return <div className="decora-add-item" onClick={() => this.additem(v.id)}>
                                            <img src={v.image}></img>
                                            <p>{v.name}</p>
                                        </div>
                                    })

                                }

                            })
                        }
                    </div>
                </Spin>
            </ModalComp>

        )
    }
}
export default Form.create()(Add)










