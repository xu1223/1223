import React from 'react';
import {
    stringify
} from 'qs';
import {
    Upload,
    message,
    Modal,
    Icon,
    Button,
    Tooltip,
    Steps,
    Col
} from 'antd';
const { Step } = Steps;
import reqwest from 'reqwest';
import {
    is,
    fromJS
} from 'immutable';

import { getToken } from '@/util/index'
import { wrapAuth } from '@/util/unit';
const AuthButton = wrapAuth(Button)

export default class UpAndDown extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            current: 0,
            fileList: [],
            uploading: false,
            resultData: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }

    isShow(value) {
        const {
            current,
        } = this.state;
        const obj = {
            visible: value,
            fileList: []
        }
        if (current == 1) {
            obj.current = 0
        }
        this.setState(obj)
    }

    createMarkup(str) {
        return {
            __html: str
        };
    }

    getUrl = (initUrl, params) => {
        const { accessToken } = getToken()
        const pathArr = initUrl.split('/'); //如果第一个元素 为空字符串 则含有 / 否则没有
        const rootName = !pathArr[0] ? pathArr[1] : pathArr[0];
        const baseUrl = process.env['APP_HOST_URL_' + rootName.toUpperCase()];
        let hostUrl = initUrl
        if (params)
            hostUrl += '&' + stringify(params);
        if (__DEV__) {
            hostUrl = baseUrl + hostUrl
        }

        hostUrl = process.env['APP_HOST_URL_API_ADMIN'] + initUrl;
        return hostUrl
    }

    handleUpload = () => {
        const {
            upLoadUrl, //上传URL
            uploadParamas,// 上传的参数
            name, // 上传文件name对应的名字参数,默认'file'
            dealUploadData,
            setInfoData,
            params,
            paramsType,
            countryId
        } = this.props;
        const { fileList } = this.state;
        const { accessToken } = getToken()
        // 获取URL
        const hostUrl = this.getUrl(upLoadUrl, uploadParamas)

        const formData = new FormData();
        fileList.forEach(file => {
            formData.append(name || 'file', file);
        });
        formData.append('access_token', accessToken);
        this.setState({
            uploading: true,
            hostUrl,
        });
        reqwest({
            url: hostUrl,
            method: 'post',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            processData: false,
            data: formData,
            success: (info) => {
                // 此处返回的json或者对象
                if (typeof (info) == "string") {
                    info = JSON.parse(info);
                }
                const { resultId, resultData, resultMsg } = info

                if (resultId == 200) {
                    message.success('导入成功！')
                    this.isShow(false)
                    this.props.filedata(resultData)
                    this.setState({
                        fileList: [],
                        uploading: false,
                        current: 1,
                        infoData: info,
                        resultData
                    });

                    // if (dealUploadData) {
                    //     dealUploadData(resultData.data, params, paramsType, countryId);
                    // } else if (setInfoData) {
                    //     setInfoData(info, uploadParamas)
                    // } else {
                    //     location.reload();
                    // }
                } else {
                    message.info(resultMsg);
                    this.setState({
                        uploading: false,
                    })
                }
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };

    render() {
        const {
            visible,
            current,
            uploading,
            fileList,
            resultData,
            infoData,
        } = this.state;

        const {
            upLoadUrl, //上传URL
            title, //标题
            upLoadFile, //上传文件 目前.xlsx,.xls,.csv，或者后端导入模板接口路径
            noFile, // 是否有下载文本  默认不传 显示
            showImportBtn = true,//是否显示
            params,
            auth
        } = this.props;

        const hostUrl = this.getUrl(upLoadFile, params)
        const props = {
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [file],
                }));
                return false;
            },
            onRemove: () => {
                this.setState({
                    fileList: []
                })
            },
            fileList
        };
        let loadurl = ''
        if (upLoadFile.indexOf("api") != -1) {
            loadurl = process.env['APP_HOST_URL_API_ADMIN'] + '/' + upLoadFile + '?access_token=' + localStorage.getItem('ACCESS_TOKEN')

        } else {
            loadurl = upLoadFile
        }
        return (
            <div style={{ display: 'inline-block' }}>
                {
                    visible &&
                    <Modal
                        visible={visible}
                        title={title}
                        width='592px'
                        onCancel={() => this.isShow(false)}
                        footer={current == 1 ? null :
                            [<Button key="back" onClick={() => this.isShow(false)}>取消</Button>,
                            <Button key="submit" type="primary" onClick={this.handleUpload} disabled={fileList.length === 0} loading={uploading}>{uploading ? '上传中' : '确定'}</Button>]}
                    >
                        <div className='importContent'>
                            <Steps current={current}>
                                <Step title="选择文件" />
                                <Step title="导入结果" />
                            </Steps>
                            {
                                current == 0 ?
                                    <div className='importBox'>
                                        <p className='importFile'>
                                            <span>导入文件：</span>
                                            <Upload {...props}>
                                                <Icon type="folder-add" />
                                            </Upload>
                                        </p>
                                        <p>
                                            <span>导入模板：</span>
                                            {
                                                !noFile && <a href={loadurl} download>下载模板</a>
                                            }
                                        </p>
                                    </div> : null
                            }
                            {
                                current == 1 ?
                                    <div className='importBox'>
                                        <div className='importBoxTitle'>

                                            {

                                                resultData != null ?
                                                    resultData.data && resultData.data.result ? resultData.data.result : resultData.resultMsg && resultData.resultMsg
                                                    :
                                                    infoData.resultMsg
                                            }

                                        </div>
                                        <div className='importBoxContent'>
                                            {
                                                resultData && resultData.data && resultData.data.detail && resultData.data.detail.length > 0 ? resultData.data.detail.map(item => {
                                                    return <div className='importBoxTitle'>
                                                        <Tooltip title={item.msg}>
                                                            <span className='importNameData'>{item.msg}</span>
                                                        </Tooltip>
                                                        <span className='importErr'>{item.state == 1 ? '导入成功' : '导入失败'}</span>
                                                    </div>
                                                }) : <div className='importBoxTitle'>
                                                        <span className='importNameData'>{resultData ? resultData.resultMsg : '数据导入成功'}</span>
                                                    </div>
                                            }
                                        </div>
                                    </div> : null
                            }
                        </div>
                    </Modal>
                }
                {
                    upLoadUrl ? (
                        showImportBtn ?
                            <Col style={{ marginRight: 10 }}>
                                {!auth ? <Button type="primary" onClick={() => this.isShow(true)}
                                >{title}
                                </Button> : <AuthButton auth={auth} type="primary" onClick={() => this.isShow(true)}
                                >{title}
                                    </AuthButton>}
                            </Col> : null
                    ) : null
                }
            </div>
        )
    }
}
