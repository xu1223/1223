import React, {
    Component
} from 'react';
import {
    Skeleton,
    Row,
    Col,
    Upload,
    Modal,
    Icon,
} from 'antd';

import './index.less';
import { getJson, setItem,getItem } from '@/util'
import Part_time from 'static/img/part-time.png'
import New_work from 'static/img/new-worker.png'
import Leave_man from 'static/img/leave-man.png'
import Be_on from 'static/img/be-on-job.png'
import header_img from 'static/img/header_img.png'

import RestPwd from '@/layouts/ResetPwd/index'
import api from 'fetch/api'
import { post } from 'fetch/request'

export default class OrderEdit extends Component {
    static defaultProps = {};
    state = {
        previewVisible: false,
        previewImage: '',
        loading: true,
        visibleReset: false,

    }
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        if ( !getItem('MEMBER_TOKEN') ||  !getItem('ACCESS_TOKEN')) {
            this.props.router.push('login')
        }
        this.getUserMsg()
    }

    getUserMsg = () => {
        let rowdata = getJson('USE_INFO') || {}
        const fileList = [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: rowdata.member_avatar ? rowdata.member_avatar : header_img,
        }]
        this.setState({
            rowData: rowdata,
            loading: false,
            fileList
        })

    }

    getJobStatus = () => {
        const {
            rowData = {}
        } = this.state;
        let imgsrc = ''
        if (rowData.job_status == 1) {
            imgsrc = Leave_man
        } else if (rowData.job_status == 2) {
            imgsrc = New_work
        } else if (rowData.job_status == 3) {
            imgsrc = Part_time
        } else if (rowData.job_status == 4) {
            imgsrc = Be_on
        }
        return imgsrc
    }

    //图片上传
    previewCancel = () => {
        this.setState({ previewVisible: false });
    }
    handleCancel = e => {
        this.setState({
            visibleReset: false,
        });
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });


    showModal = () => {
        this.setState({
            visibleReset: true
        })
    }





    render() {
        const {
            previewVisible,
            previewImage,
            loading,
            fileList,
            visibleReset,
            rowData = {},
        } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">更换头像</div>
            </div>
        );
        let user_name = localStorage.getItem("user_name")
        let imgsrc = this.getJobStatus()
        return (
            <div className='content-main'>

                <div className="dercription">
                    <div className="description-tit">角色信息</div>
                    {
                        loading ? <Skeleton avatar paragraph={{ rows: 3 }} loading={true} /> :
                            <Row className="info">
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <Upload
                                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.previewCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </Col>
                                <Col span={4}>
                                    <p>商户号：{user_name}</p>
                                    <p>工号：{rowData.member_id}</p>
                                    {/* <p>电话：{rowData.mobile}</p> */}
                                </Col>
                                <Col span={4}>
                                    <p>姓名：{rowData.member_name}</p>
                                    {/* <p>所属用户组：Zhou Maomao</p> */}
                                    <p>密码：************* <span className="clickFont" onClick={() => this.showModal()}>重置</span></p>
                                </Col>
                                <Col span={4}>
                                    <img src={imgsrc} />
                                </Col>
                            </Row>
                    }
                </div>
                {
                    visibleReset ?
                        <RestPwd
                            visibleKey={visibleReset}
                            handleCancel={this.handleCancel.bind(this)}
                        /> : ''
                }

            </div>
        )
    }
}