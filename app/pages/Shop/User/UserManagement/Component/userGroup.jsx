import React, { Component } from 'react';

import {
    Form,
    Row,
    Input,
    Col,
    Checkbox,
    Icon,
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
import {
    formItemLayout2,
} from 'config/localStoreKey';

import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context' //引入上下文

import api from 'fetch/api';

class UserGroup extends Component {
    static defaultProps = {};

    state = {
        rolesDataArr: this.context.rolesDataArr,
        groupsDataArr: this.context.groupsDataArr,
    }

    static contextType = ListContext; //导入上下文 this.context

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {}


    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {
        //这边对于 单个  和 多个可以进行操作
        if (!!values.role_ids) {
            values.role_ids = values.role_ids.join(',')
        }
        if (!!values.group_ids) {
            values.group_ids = values.group_ids.join(',')
        }
        const _values = {
            ids: this.context.batConfig.selectedRows.map(item => item.id).join(','),
            ...values
        }
        callback(_values);
    }


    SearchValue = (value) => {
        let {
            groupsDataArr,
        } = this.state;
        let len = groupsDataArr.length,
            SearchValue = value.split(';');
        if (!!value) {
            for (let j = 0; j < SearchValue.length; j++) {
                for (let i = 0; i < len; i++) {
                    if (groupsDataArr[i].name.indexOf(SearchValue[j]) != -1) {
                        groupsDataArr[i].state = true
                    } else {
                        groupsDataArr[i].state = false
                    }
                }
            }
            this.setState({
                groupsDataArr
            })

        }
        if (value == '') {
            groupsDataArr.map(item => {
                item.state = true
            })
            this.setState({
                groupsDataArr
            })
        }
    }
    SearchValue2 = (value) => {
        let {
            rolesDataArr,
        } = this.state;
        let len = rolesDataArr.length,
            SearchValue = value.split(';');
        if (!!value) {
            for (let j = 0; j < SearchValue.length; j++) {
                for (let i = 0; i < len; i++) {
                    if (rolesDataArr[i].name.indexOf(SearchValue[j]) != -1) {
                        rolesDataArr[i].state = true
                    } else {
                        rolesDataArr[i].state = false
                    }
                }
            }
            this.setState({
                rolesDataArr
            })
        }
        if (value == '') {
            rolesDataArr.map(item => {
                item.state = true
            })
            this.setState({
                rolesDataArr
            })
        }
    }

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            groupsDataArr = [],
            rolesDataArr = []
        } = this.state;
        const {
            settingType
        } = this.context
        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title:  <span><Icon type={ settingType == 'group' ? 'build' : 'setting'} style={{ color: '#798994', marginRight: 10 }} />{settingType == 'group' ? '用户组调整' : '设置权限'}</span>, 
            method: api.user_manager_batch,
            visible: this.context.visibleg,
            onCancel: () => this.context.toggleWin('visibleg'),
            form: this.props.form,
            ...this.context.batConfig
        }

        return (
            <DrawerComp
                {...modalProp}
            >
                <Form className="bulletbox-form">
                    {
                        settingType == 'group' ?
                            <FormItem label="" colon={false} {...formItemLayout2} >
                                <div className='bulletbox-search'>
                                    <Search
                                        placeholder="输入用户组搜索搜索"
                                        onSearch={this.SearchValue}
                                        style={{ width: '60%' }}
                                    />
                                </div>
                                {getFieldDecorator('group_ids', {
                                })(
                                    <Checkbox.Group className='bulletbox-content' >
                                        <Row>
                                            {
                                                groupsDataArr.length > 0 ?
                                                    groupsDataArr.map(item => {
                                                        return <Col span={6} style={{ display: (item.state == true && item.status == 1) ? 'block' : 'none' }}>
                                                            <Checkbox value={item.id}>{item.name}</Checkbox>
                                                        </Col>
                                                    }) :
                                                    <span>暂无数据</span>
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                )}
                            </FormItem> : null
                    }
                    {
                        !settingType ?
                            <FormItem label="" colon={false} {...formItemLayout2} >
                                <div className='bulletbox-search'>
                                    <Search
                                        placeholder="输入角色名称搜索搜索"
                                        onSearch={this.SearchValue2}
                                        style={{ width: '60%' }}
                                    />
                                    <span className='bulletbox-tip'>如无合适权限，请先创建角色</span>
                                </div>
                                {getFieldDecorator('role_ids', {
                                })(
                                    <Checkbox.Group className='bulletbox-content' >
                                        <Row>
                                            {
                                                rolesDataArr.length > 0 ?
                                                    rolesDataArr.map(item => {
                                                        return <Col span={6} style={{ display: (item.state == true && item.status == 1) ? 'block' : 'none' }}>
                                                            <Checkbox value={item.id}>{item.name}</Checkbox>
                                                        </Col>
                                                    }) :
                                                    <span>暂无数据</span>
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                )}
                            </FormItem> : null
                    }
                </Form>
            </DrawerComp>
        )
    }
}
export default Form.create()(UserGroup)