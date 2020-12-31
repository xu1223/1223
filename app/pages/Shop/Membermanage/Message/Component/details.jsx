import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { DrawerComp } from '@/components/ModalComp2';
import api from '@/fetch/api'
import { post } from '@/fetch/request'
import {
    Form,
} from 'antd';

class Shipments extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            details_data: {}
        }
    }
    //    关闭弹窗
    beforeCallback = (values, callback) => {
        this.context.toggleWin('details')
    }

    componentDidMount = () => {
        const {
            activeKey,
            rowData_id
        } = this.context
        let api_url = ''
        let param = {}
        if (activeKey == 'draft') {
            api_url = api.get_draft_message
            param['draft_id'] = rowData_id
        } else {
            api_url = api.get_message
            param['id'] = rowData_id
        }
        post(api_url, param).then(res => {
            if (res) {
                if (res.resultId == 200) {
                    this.setState({
                        details_data: res.resultData
                    })
                }
            }

        })
    }





    render() {
        const {
            details,
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            visible: details,
            onCancel: () => this.context.toggleWin('details'),
            method: '',
            form: this.props.form,
            ...this.context.batConfig,
        };
        const {
            details_data
        } = this.state


        return <DrawerComp {...modalProp} >
            <div style={{ paddingTop: '40px' }}>
                <p>To会员邮箱 : {details_data.from_email ? details_data.from_email : details_data.to_email}</p>
                <p>留言标题 : {details_data.title}</p>
                <p>留言时间 : {details_data.created_at}</p>
                <p>留言内容 : </p>
                <div dangerouslySetInnerHTML={{ __html: details_data.content }} >
                </div>
            </div>
        </DrawerComp>
    }
}


export default Form.create()(Shipments)