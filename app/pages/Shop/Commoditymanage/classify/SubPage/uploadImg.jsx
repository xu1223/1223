import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import {
    Upload,
    Icon,
    Modal
} from 'antd';

var data = true
class uploadImg extends Component {

    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    static getDerivedStateFromProps(nextProps) {
        console.log(nextProps, 'nextPropsnextPropsnextProps')
        if ('data-__meta' in nextProps) {
            if (nextProps['data-__meta'].initialValue && data) {
                data = false
                return {
                    fileList: [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: nextProps['data-__meta'].initialValue,
                    }]
                }
            }
            return null;

        }
        return null;
    }
    constructor(props, context) {
        super(props, context);
        this.state = {
            fileList: [],
        }
    }

    componentDidMount = () => {
    }
    // static getDerivedStateFromProps(nextProps) {
    //     const {
    //         'data-__meta': { }
    //     } = this.props
    //     if (data-__meta) {
    //         if (data-__meta.initialValue) {
    //             this.setState({
    //                 fileList: []
    //             })
    //         }

    //     }
    // }
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
        console.log(fileList, 'fileListfileList')

        this.setState({ fileList })
        let param = {}
        fileList.map((item) => {
            param[this.props.id] =item.response ? item.response.resultData  : ''
        })
        if (fileList.length == 0) {
            param[this.props.id] = ''
        }
        this.props.uploadchange(param)
    }
    handleCancel = () => {
        this.setState({
            previewVisible: !this.state.previewVisible
        })
    }



    render() {
        let {
            previewImage = '',
            fileList = [],
            previewVisible
        } = this.state
        if (fileList.length == 0) {

        }
        const header = {
            'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return <div>
            <Upload
                action={process.env['APP_HOST_URL_API_ADMIN'] + '/api/admin/category_image_upload'}
                listType="picture-card"
                headers={header}
                fileList={fileList}
                data={
                    {
                        category_name: 'category'
                    }
                }
                onPreview={this.handlePreview}
                onChange={this.handleChange}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    }
}


export default uploadImg