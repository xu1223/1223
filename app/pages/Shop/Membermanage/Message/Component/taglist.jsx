import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import BatOperation from '@/components/BatOperation';
import { DrawerComp } from '@/components/ModalComp2';
import api from '@/fetch/api'
import { post } from '@/fetch/request'
import {
    Row,
    Col,
    Form,
    Input,
    Checkbox,
    message
} from 'antd';
const { Search } = Input;
const FormItem = Form.Item

class Shipments extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            tabsearch: [],
            addshow: false,
            addvalue: ''
        }
    }

    beforeCallback = (values, callback) => {
        const {
            activeKey,
            type,
            batConfig
        } = this.context
        if (values['tag_ids'].length == 0) {
            message.error('请至少选择一个')
            return false
        }
        if (activeKey == 'draft') {
            values['is_draft'] = 1
        }
        if (type == 'add') {
            values['operate'] = 'bind'
        } else {
            values['operate'] = 'unbind'
        }
        values['id'] = batConfig.listSelData.toString()
        values['tag_ids'] = values['tag_ids'].toString()

        callback(values);

    }

    // 搜索
    issearch = (value) => {
        const {
            Checkboxdata
        } = this.props
        let tabsearch = [],
            tab_list = Checkboxdata,
            list_length = tab_list.length;
        for (let i = 0; i < list_length; i++) {
            let name = tab_list[i].name;
            if (name.toString().indexOf(value) != -1) {
                tabsearch.push(tab_list[i]);
            }
        }
        this.setState({
            tabsearch: tabsearch
        })
    }

    // 新增
    addtag = () => {
        this.setState({
            addshow: true
        })
    }
    // 关闭新增界面
    addclose = () => {
        this.setState({
            addshow: false
        })
    }

    // 取消所有
    alltag = () => {
        const {
            batConfig,
            activeKey,
        } = this.context
        let ids = batConfig.listSelData.toString()
        let is_draft = 0
        if (activeKey == 'draft') {  //判断是否为草稿箱
            is_draft = 1
        }
        post(api.save_tag_to_message, {
            operate: 'unbind_all',
            ids: ids,
            is_draft: is_draft
        }).then(res => {
            if (res.resultId == 200) {
                this.props.changeSearch()

                this.context.toggleWin('tagshow')
            }
        })
    }
    // 保存新增标签
    addsubmit = () => {
        post(api.save_message_tag, { tag_name: this.state.addvalue }).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    if (this.state.tabsearch.length != 0) {  //判断是否为空
                        this.state.tabsearch.push({
                            id: res.resultData.id,
                            name: res.resultData.name
                        })
                    }
                    this.props.Checkboxdata.push({
                        id: res.resultData.id,
                        name: res.resultData.name
                    })
                    this.setState({
                        addshow: false
                    })
                }
            }
        })
    }
    // 删除标签
    deletedtag = () => {
        let tag_ids = this.props.form.getFieldValue('tag_ids')
       
        post(api.del_message_tag, {
            tag_ids: tag_ids.toString()
        }).then(res => {
            if (res.resultId == 200) {
                this.props.tablist()
            }
        })
    }
    // 获取选中值
    onChange = (value, item) => {
        item['check'] = value.target.checked ? 1 : 2
    }
    // 获取新增的值1
    addchange = (val) => { 
        this.setState({
            addvalue: val.target.value
        })
    }

    render() {
        const {
            tagshow,
            type,
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: tagshow,
            onCancel: () => this.context.toggleWin('tagshow'),
            method: api.save_tag_to_message,
            form: this.props.form,
            ...this.context.batConfig,
        };
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            tabsearch,
            addshow
        } = this.state
        const {
            Checkboxdata
        } = this.props
        const _batProps = {
            config: [{
                title: '新增',
                onAuth: 'add',
                noCheck: true,
                visible: type == 'add',
                onClick: () => this.addtag()
            }, {
                title: '删除',
                onAuth: 'delect',
                noCheck: true,
                visible: type == 'add',
                onClick: () => this.deletedtag()
            }, {
                title: '取消所有',
                onAuth: 'delect',
                noCheck: true,
                visible: type == 'colse',
                onClick: () => this.alltag()
            }],

            unicode: 'draft_ids|id',
            batConfig: this.context.batConfig,
        };

        return <DrawerComp {...modalProp} >
            <Search
                placeholder="输入标签名搜索"
                onSearch={value => this.issearch(value)}
                style={{ width: '100%', margin: '20px 0' }}
            />
            <BatOperation {..._batProps} />
            <Form>
                {
                    addshow ? <div className="addtab">
                        <Input placeholder="" onChange={(val) => this.addchange(val)} /> <i onClick={this.addsubmit} className=" iconfont order-ico-wanchengbuzhou"></i><i onClick={this.addclose} className=" iconfont order-ico-zuofei"></i>
                    </div>
                        : ''
                }
                <FormItem label=""  >
                    {getFieldDecorator('tag_ids', {
                    })(
                        <Checkbox.Group style={{ width: '100%' }}>
                            <Row>
                                {
                                    (tabsearch.length == 0 ? Checkboxdata : tabsearch).map(item => {
                                        return <Col span={4}>
                                            <Checkbox value={item.id} onChange={(val) => this.onChange(val, item)} checked={item.check == 1 ? true : false} style={{ marginTop: '20px' }}>
                                                {item.name}
                                            </Checkbox>
                                        </Col>
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
                    )}
                </FormItem>

            </Form>
        </DrawerComp>
    }
}


export default Form.create()(Shipments)