import React, { Component } from 'react';
import {
    Row,
    Col,
    Icon,
    Skeleton,
    Form,
    Input,
    Radio,
    Select,
    Card,
    Tooltip,
    Divider,
    Spin,
    Dropdown,
    Menu,
    Button,
    Modal,
    TreeSelect,
    message
} from 'antd';
const { confirm } = Modal
import { detaOperConfig } from '../../Config/index'
import { handelSave } from './dd'
import { post } from '@/fetch/request'
import api from '@/fetch/api'

function handleRightTool(actionType, id) {
    const obj = detaOperConfig.find(item => item.id == actionType)
    confirm({
        title: '确认转至' + obj.name,
        onOk: () => {
            post(api.order_switch_to, { ids: id, type: obj.value }).then(res => {
                if (res) {
                    message.success('操作成功')
                    this.closePage()
                }
            })
        }
    })

}

const stattable = {
    20: {
        1: 30,
        2: 15
    },
    30: {
        1: 40,
        2: 25
    }
}

// 详情页审核
function checkOrderDeta(type) {
    const {
        initData,
        initData: {
            check_status,
            id
        },
    } = this.state;

    handelSave.call(this, false, () => {
        // 保存成功后 在执行审核
        const _checkStatus = stattable[check_status][type]
        if (check_status == 30) {
            this.toggleWin('visibleCheck', { type: _checkStatus, initData })
        } else {
            confirm({
                title: `审核${type == '1' ? '' : '不'}通过`,
                content: `${type == '1' ? '' : '确认后不可撤销'}`,
                onOk: () => {
                    post(api.checkAllotApply, { ids: id, check_status: _checkStatus }).then(res => {
                        if (res) {
                            message.success('操作成功')
                            this.closePage()
                        }
                    })
                }
            })
        }
    })
}

// 渲染操作栏
export function renderTool(form) {
    const {
        initData = {},
        submitloading = false
    } = this.state;
    const { type } = this.props.params
    const {
        status
    } = initData
    const getTool = []
    detaOperConfig.forEach(item => {
        if (status < parseInt(item.id) * 10) {
            getTool.push(<Menu.Item key={item.id}>{item.name}</Menu.Item>)
        }
    })

    const beforeCheck = (initData.id && [10, 25, 15, 20].includes(parseInt(initData.check_status)) || !initData.id) && type != 'look'
    const check = (initData.id && [20,30].includes(parseInt(initData.check_status))) && type != 'look'
    // console.log(type != 'look',"type != 'look'")
    const arr = [
        // 在线 并且 阿里巴巴的订单状态 不是已推送的时候显示
        beforeCheck && <Col><Button type='primary' size='large' onClick={() => handelSave.call(this)} loading={submitloading}>保存</Button></Col>,
        beforeCheck && initData.check_status != 20 && <Col><Button type='primary' size='large' onClick={() => handelSave.call(this, true)} loading={submitloading}>提交审核</Button></Col>,
        check && <Col><Button type='primary' size='large' onClick={() => checkOrderDeta.call(this, 1)} loading={submitloading}>审核通过</Button></Col>,
        check && <Col><Button type='primary' size='large' onClick={() => checkOrderDeta.call(this, 2)} loading={submitloading}>审核不通过</Button></Col>,
        initData.id && status >= 40 && status < 70 && <Col>
            <Dropdown overlay={<Menu onClick={({ key }) => handleRightTool.call(this, key, initData.id)}>{getTool}</Menu>} placement="topLeft">
                <Button type="primary" size='large'>转至 <Icon type="down" /></Button>
            </Dropdown>
        </Col>,
        <Col><Button type='danger' size='large' onClick={this.closePage}>关闭</Button></Col>
    ]

    return <div className="RightToolWrap" >
        <Row gutter="30" type="flex" justify="end">
            {arr}
        </Row>
    </div>
}