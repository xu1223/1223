import React, {
    Component
} from 'react';

import {
    Form,
    Card,
    Row,
    Col,
    Input,

} from 'antd';
const FormItem = Form.Item;
import { formItemLayout, formItemLayout2,formItemLayout3} from 'config/localStoreKey';

import api from 'fetch/api'
import { post } from 'fetch/request'



export default class method_b extends Component {
    static defaultProps = {};
    state = {

    }


    constructor(props, context) {
        super(props, context);
        //TODO：
    }
    componentDidMount(){
        const {
            params
        } = this.props;
        console.log(params,'params')
        var arr_wp = [];
        if(params != undefined && params.memo!= undefined && JSON.stringify(params.memo) != "{}" && params.memo.method_id == '"method_b"'){
            arr_wp = params.memo.weight_price_table;
            // console.log('params.memo',params.memo)
            this.arr_wp = arr_wp;
            this.set_zone_weight(arr_wp)
        }else{
            post(api.get_geo_zone_weight_price_table).then(res => {
                arr_wp = res.resultData;
                this.arr_wp = arr_wp;
                this.set_zone_weight(arr_wp)
            })
        }
   }

   set_zone_weight = (arr_wp)=>{
    console.log(arr_wp,22222)
    const zone_weight1 = [],zone_weight2 = [],zone_weight3 = [],zone_weight4 = [];
    Object.entries(arr_wp).map((item,index)=>{
        const [key,value] = item;
        const _mode = index % 4;
        switch (_mode) {
            case 0:
            zone_weight1.push(value)
                break;
            case 1:
            zone_weight2.push(value)
                break;
            case 2:
            zone_weight3.push(value)
                break;
            case 3:
            zone_weight4.push(value)
                break;
            default:
                break;
        }
        
    })
    this.setState({
        zone_weight1,
        zone_weight2,
        zone_weight3,
        zone_weight4
    })
   }
    
        
    

    zone_weight = (arr,type) => {
        const {
            getFieldDecorator
        } = this.props;
        var dest = [];
        Object.entries(arr).map((item,index)=>{
            let label = item[1].weight_min +"-"+ item[1].weight_max;
            dest.push(<FormItem 
                {...formItemLayout3}
                label = {label}
                >
                {getFieldDecorator(
                    `zone_weight${type}[${index}]`
                    , {
                     initialValue: item[1].weight_price ?  item[1].weight_price : '',
                    rules: [{ required: false, message: '必填项' }],
                })(
                    <Input type = "number"/>
                )}
            </FormItem>)
        })

        return dest;
    }
   
    render() {

        const {
            zone_weight1=[],
            zone_weight2=[],
            zone_weight3=[],
            zone_weight4=[]
        } = this.state;

        const {
            params,
            getFieldDecorator
        } = this.props;
        
        
        return (
            <FormItem label="配送公式"
                {...formItemLayout2}>
                {getFieldDecorator("label", {
                    initialValue: params.pay_name || '',
                    rules: [{ required: false, message: '必填项' }],
                })(
                    <Card title="重量对应价格 (重量单位:KG , 货币单位:USD)">
                        <Row gutter={16}>
                            <Col span={6}>
                                <Card title="重量区间-价格" bordered={true}>
                                {
                                    this.zone_weight(zone_weight1,1)
                                }
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card title="重量区间-价格" bordered={true}>
                                {
                                    this.zone_weight(zone_weight2,2)
                                }
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card title="重量区间-价格" bordered={true}>
                                {
                                    this.zone_weight(zone_weight3,3)
                                }
                                </Card>
                            </Col>
                            <Col span = {6}>
                                <Card title="重量区间-价格" bordered={true}>
                                {
                                    this.zone_weight(zone_weight4,4)
                                }
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                )}
            </FormItem>
        )
    }


}