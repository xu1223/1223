import { post, get } from 'fetch/request'
import React from 'react'
import { notification, message, Modal } from 'antd'
import api from 'fetch/api'
import { addressArr } from '../../Config/'
function getTrueData(data) {
    const _value = typeof data == 'object' && !!data ? data.value : data
    return _value
}

function _formatData(values) {
    // const { initData = {} } = this.state; // 详情数据

    values.platform = values.platform ? values.platform.join(',') : ''
    values.store_id = values.store_id ? values.store_id.join(',') : ''
    const {  skuData = [] } = this.props
    return {
        ...values,
        detail: skuData.map(item => {
            Object.entries(item).map(_item => {
                const [key, value] = _item
                item[key] = getTrueData(value)
            })
            return item
        }), // sku信息
    }
}

function checkBefore(values, isAdd) {
    // debugger
    let msg = []
    const {  skuData = [] } = this.props
    if (values.from_storage_id == values.to_storage_id && values.from_storage_id && values.to_storage_id) {
        msg.push('调出仓库和调入仓库不能相同')
    } else if (!skuData.length) {
        msg.push('请先添加商品')
    } else {
        skuData.forEach((item) => {
            if (getTrueData(item.apply_num) <=0) {
                msg.push(`子SKU${item.sku}, 调拨需求数不能小于等于0`)
            }
        })
    }
    return msg
}


function getFormData(isAdd) {
    return new Promise((resolve, reject) => {
        const { form } = this.props
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const msg = checkBefore.call(this, values, isAdd)
                if (msg.length > 0) {
                    notification.error({
                        message: '系统提示',
                        description: msg.join('|'),
                    });
                    reject()
                }
                let formData = _formatData.call(this, values)
                resolve(formData)
            }
        })
    })
}


// 执行保存
export function handelSave(operate_type, callback) {
    const { initData = {} } = this.state; // 详情数据
    let isAdd = initData.id ? false : true; //判断是否新增
    getFormData.call(this, isAdd).then(values => {
        console.log(values, '提交数据')
        let method = api.editAllotApply
        let params = values
        if (isAdd) {
            method = api.addAllotApply;
        } else {
            params.id = initData.id
        }
        if (!!operate_type) {
            // 如果只存在的时候 为提交审核
            params.submit_audit = 1
        }
        this.setState({
            submitloading: true
        })
        post(method, params).then(res => {
            if (res) {
                if (callback) {
                    callback()
                } else {
                    message.success(res.resultMsg)
                    this.closePage()
                }
            } 
            this.setState({
                submitloading: false
            })
        })
    })
}
