import React, { Component } from 'react';
import api from 'fetch/api'
import { post } from '@/fetch/request';
import { ListContext } from '@/config/context';
import { DrawerComp } from '@/components/ModalComp2';
import { formItemLayout1 } from 'config/localStoreKey';
import skuimg from '../../../../../../public/img/sku.png'
import zskuimg from '../../../../../../public/img/zsku.png'
import {
    Row,
    Col,
    Form,
    Input,
    message,
    Select,
    Icon,
    Collapse,
    TreeSelect,
    Tabs,
    Checkbox
} from 'antd';
import '../index'
const FormItem = Form.Item;
const Option = Select.Option;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
class Editmodal extends Component {
    static defaultProps = {};
    static contextType = ListContext;

    constructor(props, context) {
        super(props, context);
        this.tableEditor = React.createRef();
        this.state = {
            allStoreList: [],
            filterStoreList: [],
            fbacountryList: [],
            categoryDataTree: [],
            SearchList: [],
            weight_type: 1,
            price_type: 1,
            sort_order_top: 0,
        }
    }

    componentDidMount() {
    
        post(api.get_search_list).then(res => {
            this.setState({
                SearchList: res.resultData,
            })

        })
    }

    


    beforeCallback = (values, callback) => {
        const { batConfig } = this.context;
        const {
            weight_type,
            price_type,
            sort_order_top
        } = this.state
        let param = {
            weight_type: weight_type,
            price_type: price_type,
            sort_order_top: sort_order_top,
        }
        param['product_id'] = batConfig.listSelData.join(',')
        for (let key in values) {
            if (values[key]) {
                param[key] = values[key]
            }
        }

        console.log(param, this.context)
        callback(param);
    }

    onCreate = (res) => {
        if (res != undefined) {
            message.success(res.resultMsg);
            this.onCancel();
            this.context.changeSearch();
        }
    }

    onCancel = () => {
        this.setState({
            panelList: [],
        });
        this.props.form.resetFields();
        this.context.toggleWin('editshow', {});
    }
    callback = (key) => { //判断标重编辑的模式
        this.setState({
            weight_type: key
        })
    }
    callback1 = (key) => { //判断价格编辑的模式
        this.setState({
            price_type: key
        })
    }
    ChangeCheckbox = (value) => {  //获取是否最大排序

        this.setState({
            sort_order_top: value.target.checked ? 1 : 0
        })
    }
    treeFn = (arr) => {   //获取分类下拉列表
        return arr.map((item) => {
            return <TreeNode value={item.id} title={item.name} key={item.id} >
                {
                    (item.children && item.children.length > 0) ? this.treeFn(item.children) : null

                }
            </TreeNode>
        });
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form;
        const {
            categroyList,
        } = this.context;
        const span = 20;
        const modalProp = {
            beforeCallback: this.beforeCallback,
            afterCallback: (res) => this.onCreate(res),
            title: <div><Icon type="edit" style={{ marginRight: '10px' }} />批量编辑</div>,
            method: api.batch_edit_product_detail,
            visible: this.context.editshow,
            onCancel: this.onCancel,
            form: this.props.form,
            ...this.context.batConfig,
            width: 860,
            ids: 'product_id'
        };
        let treenode = this.treeFn(categroyList)
        const baseInfo = (
            <Row type='flex' justify='space-between' align='middle'>
                <Col span={span}>
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1', '2', '3', '4', '5', '6', '7']}

                    >
                        <Panel header="标重编辑：" key="1" className={'editpanel'}>
                            <div className={'panel-item'}>
                                <Tabs defaultActiveKey="1" onChange={this.callback}>
                                    <TabPane tab="直接修改" key="1">
                                        <div className={'panel-item-mian'}>
                                            <div>
                                                <FormItem label={'重量 [ KG ] ='} >
                                                    {getFieldDecorator("weight", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="公式修改" key="2">
                                        <div className={'panel-item-mian'}>
                                            <div className={'panel-item-flex'}>
                                                <FormItem label={'重量 (KG) = 原重量'} >
                                                    {getFieldDecorator("weight_calcu_type", {
                                                        initialValue: '1',
                                                    })(
                                                        <Select>
                                                            <Option value="1">+</Option>
                                                            <Option value="2">-</Option>
                                                            <Option value="3">×</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                                <FormItem>
                                                    {getFieldDecorator("weight", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>


                            </div>
                        </Panel>
                        <Panel header="价格编辑：" key="2" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <Tabs defaultActiveKey="1" onChange={this.callback1}>
                                    <TabPane tab="直接修改" key="1">
                                        <div className={'panel-item-mian'}>
                                            <div>
                                                <img src={skuimg}></img>
                                            </div>
                                            <div>
                                                <FormItem label={'市场价 ='} >
                                                    {getFieldDecorator("price", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                                <FormItem label={'实际售价 ='} >
                                                    {getFieldDecorator("show_price", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        <div className={'panel-item-mian'}>
                                            <div>
                                                <img src={zskuimg}></img>
                                            </div>
                                            <div>
                                                <FormItem label={'市场价 ='} >
                                                    {getFieldDecorator("zsku_price", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                                <FormItem label={'实际售价 ='} >
                                                    {getFieldDecorator("zsku_show_price", {
                                                        initialValue: '',
                                                    })(
                                                        <Input style={{ width: '168px', marginLeft: 10 }} />
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="公式修改" key="2">
                                        <div className={'panel-item-mian'}>
                                            <div>
                                                <img src={skuimg}></img>
                                            </div>
                                            <div>
                                                <div className={'panel-item-flex'}>
                                                    <FormItem label={'市场价 =   市场价'} >
                                                        {getFieldDecorator("price_calcu_type", {
                                                            initialValue: '1',
                                                        })(
                                                            <Select>
                                                                <Option value="1">+</Option>
                                                                <Option value="2">-</Option>
                                                                <Option value="3">×</Option>
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator("price", {
                                                            initialValue: '',
                                                        })(
                                                            <Input style={{ width: '168px', marginLeft: 10 }} />
                                                        )}
                                                    </FormItem>
                                                </div>
                                                <div className={'panel-item-flex'}>
                                                    <FormItem label={'市场价 =   市场价'}  >
                                                        {getFieldDecorator("show_price_calcu_type", {
                                                            initialValue: '1',
                                                        })(
                                                            <Select>
                                                                <Option value="1">+</Option>
                                                                <Option value="2">-</Option>
                                                                <Option value="3">×</Option>
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator("show_price", {
                                                            initialValue: '',
                                                        })(
                                                            <Input style={{ width: '168px', marginLeft: 10 }} />
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={'panel-item-mian'}>
                                            <div>
                                                <img src={zskuimg}></img>
                                            </div>
                                            <div>
                                                <div className={'panel-item-flex'}>
                                                    <FormItem label={'市场价 =   市场价'} >
                                                        {getFieldDecorator("zsku_price_calcu_type", {
                                                            initialValue: '1',
                                                        })(
                                                            <Select>
                                                                <Option value="1">+</Option>
                                                                <Option value="2">-</Option>
                                                                <Option value="3">×</Option>
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator("zsku_price", {
                                                            initialValue: '',
                                                        })(
                                                            <Input style={{ width: '168px', marginLeft: 10 }} />
                                                        )}
                                                    </FormItem>
                                                </div>
                                                <div className={'panel-item-flex'}>
                                                    <FormItem label={'市场价 =   市场价'}  >
                                                        {getFieldDecorator("zsku_show_price_calcu_type", {
                                                            initialValue: '1',
                                                        })(
                                                            <Select>
                                                                <Option value="1">+</Option>
                                                                <Option value="2">-</Option>
                                                                <Option value="3">×</Option>
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                    <FormItem>
                                                        {getFieldDecorator("zsku_show_price", {
                                                            initialValue: '',
                                                        })(
                                                            <Input style={{ width: '168px', marginLeft: 10 }} />
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Panel>
                        <Panel header="分类设置 ：" key="3" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <FormItem label='选择分类' {...formItemLayout1}>
                                    {getFieldDecorator('category_id', {
                                        initialValue: '',
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{ width: '100%' }}
                                            value={this.state.value}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="Please select"
                                            allowClear
                                            treeDefaultExpandAll
                                            onChange={this.onChange}
                                        >
                                            {
                                                treenode
                                            }

                                        </TreeSelect>

                                    )}
                                </FormItem>
                            </div>
                        </Panel>
                        <Panel header="商品标签 ：" key="4" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <FormItem label='选择标签' {...formItemLayout1}>
                                    {getFieldDecorator('search_ids', {
                                        initialValue: [],
                                    })(
                                        <Select style={{ width: '100%' }} placeholder="Tags Mode">
                                            {this.context.get_search_list.map(item => {
                                                return <Option key={item.id} value={item.id}>{item.keyword}</Option>
                                            })}
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                        </Panel>
                        <Panel header="排序编辑  ：" key="5" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <FormItem label='输入排序值' {...formItemLayout1}>
                                    {getFieldDecorator('sort_order', {
                                        initialValue: '',
                                    })(
                                        <Input></Input>

                                    )}
                                </FormItem>
                                <Checkbox onChange={this.ChangeCheckbox}>是否最大排序</Checkbox>
                            </div>
                        </Panel>
                        <Panel header="SEO设置   ：" key="6" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <FormItem label='SEO标题' {...formItemLayout1}>
                                    {getFieldDecorator('seo_title', {
                                        initialValue: '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label='SEO关键字' {...formItemLayout1}>
                                    {getFieldDecorator('seo_keyword', {
                                        initialValue: '',
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label='SEO描述' {...formItemLayout1}>
                                    {getFieldDecorator('seo_description', {
                                        initialValue: '',
                                    })(
                                        <TextArea />
                                    )}
                                </FormItem>
                            </div>
                        </Panel>
                        <Panel header="指定尺码下架 ：" key="7" className={'editpanel'} >
                            <div className={'panel-item'}>
                                <FormItem label='商品尺码 :' {...formItemLayout1}>
                                    {getFieldDecorator('option_value_names', {
                                        initialValue: '',
                                    })(
                                        <TextArea placeholder="输入尺码，多个尺码用英文,号隔开" />
                                    )}
                                </FormItem>
                            </div>
                        </Panel>
                    </Collapse>,

                </Col>
            </Row>
        );

        return (
            <DrawerComp {...modalProp}>
                <Form className="bulletbox-form">
                    {baseInfo}
                </Form>
            </DrawerComp >
        )
    }
}

export default Form.create()(Editmodal)