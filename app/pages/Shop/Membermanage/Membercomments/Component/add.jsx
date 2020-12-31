import React, { Component } from 'react';
import api from '@/fetch/api';
import { post } from '@/fetch/request'
import { ModalComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context';
import { formItemLayout4 } from 'config/localStoreKey';
import Addshop from './addshop/index'
import delect from '../../../../../../public/img/dingding.png'
import '../index';
import moment from 'moment'
import {
    Row,
    Col,
    Form,
    Input,
    DatePicker,
    Switch,
    message,
    Icon,
    Rate,
    Select,
    Upload,
} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option
import { getToken } from '@/util/index'
class add extends Component {
    static defaultProps = {};
    static contextType = ListContext;
    constructor(props, context) {
        super(props, context);
        this.state = {
            fileList: [],
            addshop: false,
            shop: {}
        }
    }
    //处理数据
    beforeCallback = (values, callback) => {
        const { rowData = {} } = this.context
        const {
            fileList
        } = this.state
        let images = []
        if (rowData.id) {
            values.id = rowData.id
        }
        values.review_time = moment(values.review_time).format('YYYY-MM-DD hh:mm:ss')
        values.status = values.status ? 1 : 0

        if (fileList) {
            fileList.map(item => {
                images.push(item.response.resultData)
            })
        }
        values.images = JSON.stringify(images)
        callback(values);
    }

    componentDidMount() {
        const { rowData = {} } = this.context
    }

    //关闭弹窗
    onCancel = () => {
        this.context.toggleWin('visible');
    }
    //添加商品弹窗不支持context需要用传值进行控制
    toggleWin = () => {
        this.setState({
            addshop: !this.state.addshop
        })
    }

    //获取选中的商品数据
    setSelectRowsadd = (param) => {
        this.setState({
            shop: param
        })
    }

    //清空商品数据
    delect = () =>{
        this.setState({
            shop: ''
        })
    }

    //获取上传图片值
    handlePreview = async file => {
        if (!file.url && !file.preview) {  //判断图片数据存在
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    handleChange = ({ fileList }) => {  //获取上传图片数据
        this.setState({ fileList })
    }
    

    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
        } = this.props
        const {
            fileList,
            shop = {}
        } = this.state
        const {
            rowData = {},
        } = this.context;

        const span = 24;

        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: '新增评论',
            method: api.save_review,
            visible: this.context.visible,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
        };
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { accessToken } = getToken()
        const header = {
            'Authorization': `Bearer ${accessToken}`
        }
        return (
            <div>
                <ModalComp {...modalProp}>
                    <Form className="bulletbox-form">
                        <div className='collapse-style' style={{ padding: '20px' }}>
                            <Row style={{ marginTop: '16px' }}>
                                <Col span={span}>
                                    <FormItem label="商品" {...formItemLayout4} >
                                        {
                                            shop.sku ?
                                                <div className="meber-shop-main">
                                                    <div className="le">
                                                        <img src={shop.image}></img>
                                                    </div>
                                                    <div className="ri">
                                                        <p className="title">{shop.name}</p>
                                                        {
                                                            shop.categories ? <p className="title">
                                                                {shop.categories.parent_category_name} {
                                                                    shop.categories.parent_category_name ? <span>></span> : ''
                                                                }
                                                                {shop.categories.child_category_name}
                                                            </p> : ''
                                                        }
                                                        <p className="r-conter">
                                                            <span>
                                                                SPU: {shop.spu}
                                                            </span>
                                                            <span>
                                                                SKU: {shop.sku}
                                                            </span>
                                                        </p>
                                                        <div className="ri-bottom">
                                                            <p>{shop.price} <span>USD</span></p>
                                                            <img onClick={this.delect} src={delect}></img>
                                                        </div>


                                                    </div>

                                                </div> :
                                                <a onClick={this.toggleWin}>添加商品</a>
                                        }
                                    </FormItem>


                                    <FormItem label="" {...formItemLayout4} style={{ display: 'none' }} >
                                        {getFieldDecorator('sku', {
                                            initialValue: shop.sku || '2',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={span}>
                                    <FormItem label="会员名称" {...formItemLayout4} >
                                        {getFieldDecorator('email', {
                                            initialValue: rowData.email || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Input />
                                        )}
                                    </FormItem>

                                </Col>
                                <Col span={24}>
                                    <FormItem label="评论日期 " {...formItemLayout4} >
                                        {getFieldDecorator('review_time', {
                                            initialValue: rowData.review_time || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <DatePicker showTime format={'YYYY-MM-DD hh:mm:ss'} onChange={this.onChange} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="评论内容" {...formItemLayout4} >
                                        {getFieldDecorator('description', {
                                            initialValue: rowData.description || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <TextArea />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="评分" {...formItemLayout4} >
                                        {getFieldDecorator('rating', {
                                            initialValue: rowData.rating || '',
                                            rules: [{ required: true, message: '必填项' }],
                                        })(
                                            <Rate />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="添加图片" {...formItemLayout4} >
                                        {getFieldDecorator('images', {
                                            initialValue: rowData.images || '',
                                        })(
                                            <Upload
                                                action={process.env['APP_HOST_URL_API_ADMIN'] + '/api/admin/review_image_upload'}
                                                listType="picture-card"
                                                headers={header}
                                                fileList={fileList}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                            >
                                                {fileList.length >= 8 ? null : uploadButton}
                                            </Upload>

                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="状态" {...formItemLayout4} >
                                        {getFieldDecorator('status', {
                                            initialValue: true,
                                        })(
                                            <Switch defaultChecked></Switch>
                                        )}
                                    </FormItem>

                                </Col>



                            </Row>
                        </div>
                    </Form>

                </ModalComp >
                {
                    this.state.addshop && <Addshop
                        toggleWin={this.toggleWin}
                        setSelectRowsadd={this.setSelectRowsadd}
                    />
                }
            </div>




        )
    }
}

export default Form.create()(add)