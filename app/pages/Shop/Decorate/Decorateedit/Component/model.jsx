import React, { Component } from 'react';
import { ListContext } from '@/config/context';
import { DrawerComp } from '@/components/ModalComp2';

import {
    Row,
    Col,
    Form,
    Input,
    message,
    Collapse,
    Icon,
    Switch,
    Select,
    Button,
    Slider,
    Radio,
    Tooltip
} from 'antd';
import UploadImg from './uploadImg.jsx'
import { stylename, stylepx } from '../config/index'
import api from "@/fetch";
import Picker from './Picker.jsx'
const { Panel } = Collapse;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class Shipments extends Component {
    static defaultProps = {};
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
            fileList: [],
        }
    }
    componentDidMount = () => {
        const {
            rowData
        } = this.context
        this.setState({
            rowData
        })


    }
    // 保存
    beforeCallback = () => {
        this.props.form.validateFields((err, values) => {

            const {
                index
            } = this.context
            const {
                rowData
            } = this.state
            let param = JSON.parse(JSON.stringify(rowData))
            function keyfont(val, place) {
                if (place) {
                    val = val.replace(place, '')
                }
                return val.split("*")
            }
            for (var key in values) {
                if (typeof values[key] == 'boolean') {
                    values[key] = values[key] ? '1' : '0'
                }
                let keyArr = []

                if (key.indexOf('blocks') != -1) {
                    if (key.indexOf('style') != -1) {
                        keyArr = keyfont(key, 'blocksstyle')
                        let unit = ''
                        if (!stylepx.includes(keyArr[0])) {
                            unit = 'px'
                        }
                        param['blocks'][keyArr[2]]['settings'][keyArr[1]]['style'][keyArr[0]] = (values[key] || '') + unit;
                    } else {
                        keyArr = keyfont(key, 'blocks')
                        param['blocks'][keyArr[2]]['settings'][keyArr[1]]['setting_value'] = values[key] || ''
                    }

                }
                else if (key.indexOf('name_cn') != -1) {
                    param.name_cn = values[key]
                } else {
                    if (key.indexOf('style') != -1) {
                        keyArr = keyfont(key, 'style')
                        let unit = ''
                        if (!stylepx.includes(keyArr[0])) {
                            unit = 'px'
                        }
                        param['settings'][keyArr[1]]['style'][keyArr[0]] = (values[key] || '') + unit;
                    } else {
                        keyArr = keyfont(key)
                        param['settings'][keyArr[1]]['setting_value'] = values[key] || ''
                    }
                }
            }
            if (index == 'total') {
                api.order.edit_template_global_settings({ tpl_id: this.context.id, settings: param.settings }).then((res) => {
                    if (res) {
                        this.context.lodingstatus(param.settings, 'settingsdata')
                        message.success('保存成功')
                        window.frames["decorate"].loadCss()
                        this.context.toggleWin('visible')
                    }
                })
                return
            }


            this.context.navdata[index] = param
            this.context.customizegupdate({
                operate: 'UPDATE_SECTION',
                tpl_page_id: this.context.tpl_page_id,
                tpl_id: this.context.id,
                section: param,
                sections: this.context.navdata
            }, param.index)
            this.context.toggleWin('visible')
            this.context.iframeedit(param, index)
        });

        // callback(values);
    }
    // 选择图片
    uploadchange = (value) => {

        this.props.form.setFieldsValue({ ...value })
    }


    changecolor = (value, key) => {
        this.props.form.setFieldsValue({
            [key]: value,
        })
        this.setState({
            colorvalue: value
        })

    }
    fontchange = (e, id, style, unit = '') => {
        const { value } = e.target;
        document.getElementById(id).style[style] = value + unit;
    }

    onChange = e => {

    };
    // 生成 配置项
    formItme = (item, bolck = '', bolckindex = '') => {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            defaultColoe
        } = this.state
        let htmlArr = []
        if (item && item.length > 0) {
            function module(item) {
                let module = ''
                if (item.setting_type == 'TEXT') {
                    module = <Input></Input>
                } else if (item.setting_type == 'PICK_IMAGE') {
                    module = <UploadImg uploadchange={this.uploadchange}></UploadImg>
                } else if (item.setting_type == 'TEXTAREA') {
                    module = <TextArea></TextArea>
                } else if (item.setting_type == 'SELECT') {
                    module = <Select>
                        {
                            item.options.map((v) => {
                                return <Option value={v}>
                                    {v}
                                </Option>
                            })
                        }
                    </Select>

                } else if (item.setting_type == 'SWITCH' || item.setting_type == 'CHECKBOX') {
                    module = <Switch defaultChecked={item.setting_value == 1 ? true : false} />
                } else if (item.setting_type == 'STYLE') {
                    module = <div></div>
                } else if (item.setting_type == 'RANGE') {
                    let silider = item.options || []
                    module = <Slider min={silider[0] || 0} max={silider[1] || 100} />
                } else if (item.setting_type == 'PICK_COLOR') {
                    module = <Input style={{ width: '55%', verticalAlign: '8px' }} />
                } else if (item.setting_type == 'SELECT_CLASS') {
                    module = module = <Select>
                        {
                            item.options.map((v) => {
                                return <Option value={v.value}>
                                    <Tooltip  placement="right" title={
                                        <img style={{width:'800px'}} src={v.image}></img>
                                    }>
                                        <p style={{ marginBottom: '0' }}>{v.value}</p>
                                    </Tooltip>
                                </Option>
                            })
                        }
                    </Select>
                } else {
                    module = <Input></Input>
                }
                return module
            }

            item.map((item, index) => {
                if (item.style && item.style != []) {
                    for (var key in item.style) {
                        let inputType = ''
                        if (item.style[key].indexOf("px") != -1) {
                            inputType = 'number'
                            item.style[key] = item.style[key].replace('px', '')
                        }
                        const colorarr = ['border-color', 'color', 'background-color']
                        if (colorarr.indexOf(key) != -1) {
                            htmlArr.push(<FormItem label={stylename(key, item)}>
                                {getFieldDecorator(`${bolck}style${key}*${index}*${bolckindex}`, {
                                    initialValue: item.style[key] || '',
                                })(
                                    <Input style={{ width: '55%', verticalAlign: '8px' }} />
                                )} <Picker
                                    id={`${bolck}style${key}*${index}*${bolckindex}`}
                                    changecolor={this.changecolor}
                                    form={this.props.form}
                                    initial={item.style[key]}
                                ></Picker>

                            </FormItem>)
                        } else if (key == 'font-size') {
                            htmlArr.push(<FormItem label={stylename(key, item)}>
                                {getFieldDecorator(`${bolck}style${key}*${index}*${bolckindex}`, {
                                    initialValue: item.style[key],
                                })(
                                    <Input type="number" style={{ width: '55%', verticalAlign: '8px' }} onChange={(e) => this.fontchange(e, `${bolckindex}font`, 'fontSize', 'px')} />
                                )}<span id={`${bolckindex}font`} style={{ display: 'block' }} >测试文字</span>

                            </FormItem>)
                        } else if (key == 'font-weight') {
                            htmlArr.push(<FormItem label={stylename(key, item)}>
                                {getFieldDecorator(`${bolck}style${key}*${index}*${bolckindex}`, {
                                    initialValue: item.style[key],
                                })(
                                    <Input type="number" style={{ width: '55%', verticalAlign: '8px' }} onBlur={this.onBlur} onChange={(e) => this.fontchange(e, `${bolckindex}font`, 'fontWeight')} />
                                )}
                            </FormItem>)

                        } else if (!stylepx.includes(key)) {
                            htmlArr.push(<FormItem label={stylename(key, item)}>
                                {getFieldDecorator(`${bolck}style${key}*${index}*${bolckindex}`, {
                                    initialValue: item.style[key],
                                })(
                                    <Input type="number" />
                                )}
                            </FormItem>)
                        } else {

                            htmlArr.push(<FormItem label={stylename(key, item)}>
                                {getFieldDecorator(`${bolck}style${key}*${index}*${bolckindex}`, {
                                    initialValue: item.style[key],
                                })(
                                    <Input type={inputType} />
                                )}
                            </FormItem>)
                        }
                    }
                }
                if (item.setting_type != 'STYLE') {
                    htmlArr.push(<FormItem label={item.name_cn} >
                        {getFieldDecorator(`${bolck}${item.id}*${index}*${bolckindex}`, {
                            initialValue: item.setting_value || '',
                        })(
                            module.call(this, item)
                        )}
                        {
                            item.setting_type == 'PICK_COLOR' ? <Picker
                                id={`${bolck}${item.id}*${index}*${bolckindex}`}
                                changecolor={this.changecolor}
                                form={this.props.form}
                                initial={item.setting_value}
                            ></Picker>
                                : ''
                        }

                    </FormItem >)
                }
            })
        }




        return <div>
            {htmlArr.map((item) => {
                return item
            })}
        </div>

    }
    // 复制新增
    Addcopy = () => {
        const {
            navdata,
        } = this.context
        const {
            rowData
        } = this.state

        this.context.iframeadd(rowData)
        this.context.toggleWin('visible')
    }
    // 添加修改项bolcks
    addnav = () => {
        const {
            rowData
        } = this.state
        const addblock = rowData.blocks[0]
        // addblock.settings.map((item)=>{
        //     item.setting_value = ''
        // }) 

        rowData.blocks.push(addblock)
        this.setState({
            rowData
        })

    }



    render() {
        const {
            visible,
            page_type
        } = this.context
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: false,
            placement: "left",
            visible: visible,
            onCancel: () => this.context.toggleWin('visible'),
            width: 300,
            footer: false,
            form: this.props.form,
            ...this.context.batConfig,
        };
        const {
            getFieldDecorator
        } = this.props.form;
        let {
            rowData = {}
        } = this.state

        const pageshow = page_type == 'PRODUCT_THEME' || page_type == "INDEX"
        const pageshow_PHOT = pageshow && (rowData.layout != 'PHOTO_WALL' && rowData.layout != 'PHOTO_WALL_TWO')
        const layout = rowData.layout == 'BANNER'
        console.log(pageshow_PHOT, rowData, 'pageshow_PHOTpageshow_PHOTpageshow_PHOT')

        const genExtra = (index) => (
            (pageshow_PHOT || layout) ?
                <Icon
                    type="delete"
                    onClick={(event) => {
                        if (rowData.blocks.length == 1) {
                            message.error('数据不能为空')
                            return
                        }
                        rowData.blocks.splice(index, 1)
                        this.setState({
                            rowData
                        })
                        event.stopPropagation();
                    }}
                />
                : ''
        );
        return <DrawerComp {...modalProp} >
            <Form>
                <div style={{ paddingBottom: '135px' }}>
                    {
                        rowData.name_cn ? <FormItem label="组件名称">
                            {getFieldDecorator('name_cn', {
                                initialValue: rowData.name_cn,
                            })(
                                <Input disabled={!pageshow} ></Input>
                            )}
                        </FormItem> : ''
                    }

                    {
                        this.formItme(rowData.settings, '')

                    }
                    {
                        rowData.blocks && rowData.blocks.length > 0 ?
                            <div>
                                <Collapse>
                                    {
                                        rowData.blocks.map((item, index) => {
                                            return <Panel header={item.name_cn} key={index} extra={genExtra(index)}>
                                                {
                                                    this.formItme(item.settings, 'blocks', index)
                                                }
                                            </Panel>
                                        })
                                    }
                                </Collapse>
                                {
                                    (pageshow_PHOT || layout) ? <a className="addsort" onClick={() => this.addnav()}>
                                        <Icon type="plus-circle" />
                                    新增{rowData.blocks[0].name}
                                    </a> : ''
                                }

                            </div>
                            : ''
                    }






                </div>
                <div className="drawer-footer">
                    {
                        pageshow ? <Row style={{ margin: '10px 0' }}>
                            <Col span={12}>
                                <Button style={{ border: '1px solid #4AC8A4', color: '#4AC8A4', width: '100%' }} onClick={() => this.Addcopy()}> 复制新增 </Button>
                            </Col>
                            <Col span={12}>
                                <Button style={{ width: '100%', border: '1px solid #E5859B', color: '#E5859B' }} onClick={() => this.props.sortcolse()}> 移除 </Button>
                            </Col>
                        </Row> : ''
                    }

                    <Button style={{ width: '100%' }} type="primary" onClick={() => this.beforeCallback()}> 应用 </Button>
                </div>
            </Form>

        </DrawerComp >
    }
}


export default Form.create()(Shipments)