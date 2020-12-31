import React, { Component } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Input,
    Select,
    Col,
    Checkbox,
    Switch,
    Icon,
    Radio,
    DatePicker,
    Button,
} from 'antd';
const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
import {
    formItemLayout2,
} from 'config/localStoreKey';
import method_a from './method_a'
import method_b from './method_b'
import { DrawerComp } from '@/components/ModalComp2';
import { ListContext } from '@/config/context'; //引入上下文
import api from 'fetch/api';



class employeeRights extends Component {
    static defaultProps = {

    };
    static contextType = ListContext; //导入上下文 this.context
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        rolesDataArr: this.context.rolesDataArr || []
    }

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        const {
            rowData = {},
        } = this.context
        this.setState({
            checkedList: rowData.country_ids.map(item => item + ""),
        })
    }

    ///需要处理 提交前数据的时候才要
    beforeCallback = (values, callback) => {

        const {
            rowData = {},
        } = this.context
        const {
            checkedList
        } = this.state;


        values.country_ids = checkedList.map(Number);
        values.geo_zone_id = rowData.id;
        callback(values);
    }




    onChangeCountry = (checkedList) => {

        this.setState({
            checkedList
        });
    }

    render() {
        const {
            rowData = {},
            countrys = []
        } = this.context
        const len = Object.keys(rowData).length == 0;
        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback: this.beforeCallback,
            title: <span>修改配送国家</span>,
            method: api.save_geo_zone,
            visible: this.context.statevisible,
            onCancel: () => this.context.toggleWin('statevisible'),
            form: this.props.form,
            ...this.context.batConfig
        }


        return (
            <DrawerComp
                {...modalProp}
            >
                <Form>
                    <Row span={24} type="flex" justify="start">
                        <Col span={24}>
                            <FormItem label="配送国家"
                                {...formItemLayout2}>
                                <div style={{ height: "500px", border: "1px solid #e9e9e9", padding: "20px", overflow: "auto" }}>

                                    <CheckboxGroup value={this.state.checkedList} onChange={this.onChangeCountry}>
                                        <Row>
                                            {
                                                countrys.map((item, index) => {
                                                    return (
                                                        <Col span={24}>
                                                            <Checkbox value={item.id + ""}>
                                                                {item.name_cn}-{item.name}-{item.iso_code_2}-{item.iso_code_3}
                                                            </Checkbox>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                    </CheckboxGroup>
                                </div>
                            </FormItem>
                        </Col>

                    </Row>
                </Form>

            </DrawerComp>
        )
    }
}

export default Form.create()(employeeRights)