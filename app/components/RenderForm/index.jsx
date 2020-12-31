import React from 'react';
import {
    formItemLayout1,
    formItemLayout4,
    formItemLayout7
} from '../../pages/Publish/Config/index.jsx';
import {
    Icon,
    Form,
    Row,
    Col,
    Input,
    Modal,
    Button,
    Radio,
    Tooltip,
    InputNumber,
    Select,
    AutoComplete,
    Spin
} from 'antd';
const { Option: AOption } = AutoComplete;

const Option = Select.Option;
const FormItem = Form.Item;
import RemoteSelect from './remoteSelect';
import UeEditor from '../Ueditor/index.jsx';
/**
 * 渲染Form
 */
export default class RenderForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        // 如果是批量 则 从 props 中获取
    }

    renderInputNumber = () => {
        return <InputNumber style={{ width: '100%' }} />
    }

    renderInput = (attributeEnum, item) => {
        const {
            getFieldDecorator
        } = this.getData().form;
        const {
            unitChange
        } = this.getData();
        let AssSelect = attributeEnum ? <div>{getFieldDecorator(`changeAttrUnit.${item.title}`, {
            initialValue: JSON.parse(attributeEnum)[0] || '',
            rules: [{
                required: false,
                message: '必填项'
            }],
        })(<Select style={{ width: '60px' }} onChange={e => unitChange(e, item.title)}>{['1', '2', '3'].map(j => <Option key={j} value={j}>{j}</Option>)}</Select>)}</div> : null;
        return <Input style={{ width: '100%' }} addonAfter={AssSelect ? AssSelect : null} />
    }

    renderRemote = (obj = {}, attribute_id) => {
        const {
            platform,
            node_id,
            store_id
        } = this.getData();
        let requestParams = {};
        if (platform == 16) {
            requestParams = {
                url: 'salesManage/publish/getPlatformBrandsList',
                platform,
                store_id: store_id,
                requestKey: 'brand_name',
            }
        } else if (platform == 2) {
            requestParams = {
                url: 'salesManage/publish/aliExpress/lazyLoadAttributeOptions',
                platform,
                attribute_id,
                node_id: node_id,
                requestKey: 'keyword',
            }
        }
        return <RemoteSelect requestParams={requestParams} {...obj} platform={platform} />
    }

    renderUeEditor = (item) => {
        return <UeEditor
            id={item.attribute_name}
            initialFrameHeight={400}
        />
    }

    renderAuto = (config = {}) => {
        const {
            data = [],
            formConf = {}
        } = config
        const dataSource = data.map(item => item.label)
        return <AutoComplete
            dataSource={dataSource}
            style={{ width: '100%' }}
            filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            {...formConf}
        />
    }

    renderSelect = (config = {}, attributeEnum, item) => {
        const {
            getFieldDecorator
        } = this.getData().form;
        const {
            unitChange
        } = this.getData();
        let AssSelect = attributeEnum ? <div>{getFieldDecorator(`changeAttrUnit.${item.title}`, {
            initialValue: JSON.parse(attributeEnum)[0] || '',
            rules: [{
                required: false,
                message: '必填项'
            }],
        })(<Select style={{ width: '60px' }} onChange={e => unitChange(e, item.title)}>{JSON.parse(attributeEnum).map(j => <Option key={j} value={j}>{j}</Option>)}</Select>)}</div> : null;
        const {
            data = [],
            formConf = {}
        } = config
        return <Select
            showSearch
            optionFilterProp="children"
            style={{ width: "100%" }}
            addonAfter={AssSelect ? AssSelect : null}
            {...formConf}
        >
            {
                data.map((item, index) => {
                    return (
                        <Option key={item.value || item} value={item.value || item}>{item.label || item}</Option>
                    )
                })
            }
        </Select>
    }

    renderByType = (item) => {
        const {
            platform
        } = this.getData();
        const {
            attribute_type,
            options = [], //TODO
            lazy_load,
            attributeEnum,
            nameEnum,
            name,
            attribute_name,
            attribute_id,
        } = item;
        const data = options.map(item => {
            return {
                value: item.name || item.value || item,
                label: item.name || item.label || item,
            }
        })
        let _html;

        switch (attribute_type) {
            case 'DROP_DOWN':
            case 'CHECK_BOX':
            case 'MULTIPLE_COMBOX':
                let formConf = {};
                if ((platform == 2 || platform == 15) && attribute_type == 'CHECK_BOX') {
                    formConf = { labelInValue: true, mode: 'tags',showArrow:true }
                } else if (platform == 2 || platform == 15) {
                    formConf = { labelInValue: true }
                } else if (attribute_type == 'MULTIPLE_COMBOX') {
                    formConf = { mode: 'tags' ,showArrow:true}
                } else {
                    formConf = {}
                }
                _html = this.renderSelect({ data, formConf }); break;
            case 'TEXT_FILED':
                _html = this.renderInput(); break;
            case 'NUM':
                _html = this.renderInputNumber(); break;
            case 'COMBO_BOX':
                _html = this.renderAuto({ data }); break;
            case 'RICH_TEXT':
                _html = this.renderUeEditor(item); break;
            default:
                _html = this.renderInput()
        }

        if (item.hasOwnProperty('nameEnum')) {
            if (!nameEnum) {
                _html = this.renderInput(attributeEnum, item)
            } else {
                let formConf = attribute_type == 'MULTIPLE_COMBOX' ? { mode: 'tags' } : {}
                _html = this.renderSelect({ data: JSON.parse(nameEnum), formConf }, attributeEnum, item);
            }
        }
        if ((attribute_name == 'brand' && platform == 16) || (attribute_name == '品牌' && platform == 2)) {
            let formConf = platform == 2 ? { labelInValue: true } : {};
            _html = this.renderRemote({ data, formConf }, attribute_id);
        }
        return _html
    }

    getData() {
        return this.props.isBat ? this.props : {};
    }

    getFormData = () => {
        const {
            formData = [],
            otherData = {},
        } = this.getData();
        const { formDataKey } = this.props;
        if (formDataKey) {
            return otherData.categoryObj && otherData.categoryObj[formDataKey] ? otherData.categoryObj[formDataKey] : []
        } else {
            return formData
        }
    }

    // 获取form的初始值 数据
    getInitData = (attribute_name, attribute_label, _item = {}) => {
        const {
            platform,
            formData,
        } = this.getData();
        let value = '';
        if (formData) {
            const _dest = formData.find(item => item.attribute_name == attribute_name)
            const _destBox = formData.find(item => item.attribute_type == 'CHECK_BOX')
            let obj = {}, checkBox = [];
            if ((platform == 2 || platform == 15)) {
                if (_item.attribute_type == 'DROP_DOWN') {
                    obj.key = _dest && _dest.option_id
                    obj.label = _dest && _dest.option_name
                }
                if (_item.attribute_type == 'CHECK_BOX' && !!_destBox && _destBox.option_id != null) {
                    let optionId = _dest && _dest.option_id.split(','), optionName = _dest && _dest.option_name.split(',');
                    checkBox = optionId.map((item, index) => {
                        return {
                            key: item,
                            label: optionName[index] 
                        }
                    })
                }
            }

            if (!!_dest) {
                if (JSON.stringify(obj) != '{}') {
                    value = obj
                } else if (checkBox.length > 0) {
                    value = checkBox
                } else {
                    value = _dest.option_name
                }
            } else {
                value = attribute_label == 'Brand' ? 'No Brand' : ''
            }
        }
        if (_item.attribute_type == 'MULTIPLE_COMBOX') {
            if (value && value.constructor === String) {
                value = value.split(',')
            } else {
                value = value
            }
        }
        return value
    }

    renderFormData = () => {
        const {
            getFieldDecorator
        } = this.getData().form;
        const {
            dataIndex = 0
        } = this.getData()
        const _html = this.getFormData().map((item, index) => {
            const {
                attribute_name,
                attribute_id,
                attribute_label,
                option_id, //初始值 TODO
                option_name,//初始值 TODO
                is_mandatory, //是否必填
                required,
                ..._item
            } = item
            const isRichText = _item.attribute_type == 'RICH_TEXT' || _item.attribute_type == 'MULTIPLE_COMBOX'
            const formItemLayout = isRichText ? formItemLayout1 : formItemLayout7
            const initValue = this.getInitData(attribute_name, attribute_label, _item)
            // console.log('类目属性初始化11111111' ,option_name, initValue , item)
            return <Col span={isRichText ? 20 : 10} key={attribute_label || attribute_name}>
                <FormItem {...formItemLayout} label={attribute_label || attribute_name || item.title}>
                    {
                        getFieldDecorator(`category_attributeArr[${dataIndex}][${attribute_name || item.title}__${attribute_id}]`, {
                            initialValue: initValue || item.value,
                            rules: [{ required: is_mandatory || required, message: '必填项' }]
                        })(
                            this.renderByType({ attribute_name,attribute_id, ..._item })
                        )
                    }
                </FormItem>
            </Col>
        })
        return _html
    }

    render() {
        const antIcon = <img src='loading.gif' />;
        return <Row type='flex' gutter={10} className='categoryImg'>
            <Spin indicator={antIcon} delay={500} spinning={this.props.loadingAttr} >
                {
                    this.renderFormData()
                }
            </Spin>
        </Row>
    }
}