import React, { Component } from 'react';
import {
    Row,
    Col,
    Icon,
    Skeleton,
    Form,
    Input,
    Radio,
    Select,
    Card,
    Tooltip,
    Divider,
    Spin,
    Dropdown,
    Menu,
    Button,
    Modal,
    TreeSelect,
    message
} from 'antd';
import { ModalComp } from '@/components/ModalComp2';
const FormItem = Form.Item;
const Option = Select.Option
const { confirm } = Modal
import { detaOperConfig } from '../../Config/index'
import { handelSave } from './dd'
import { get } from '@/fetch/request'
import api from '@/fetch/api'
import menberifo from '../../../../../../../public/img/menberifo.png'



function beforeCallback (values, callback)  {
    const { rowData = {} } = this.context
    if (rowData.id) {
        values.id = rowData.id
    }
    callback(values);
}
function savecustomer (param){
    get(api.save_customer, param).then(res => {
        if (res) {
            
        }
    })
}
function changeSearch (data,type,id){
    console.log(data,type,id,'data,type,id')
    if(type == 1){
       
    }else if(type == 2){
       let param =  {
          customer_id:id,
          customer_group_id:type
       }
       savecustomer(param)
    }else if(type == 3){
        let param =  {
            customer_id:id,
            manager_id:type
         }
         savecustomer(param)
    }else if(type == 4){
       
    }else if(type == 5){

    }
    
}
export function renderTool(form,selectdata) {
 
      const modalProp = {
        beforeCallback:this.beforeCallback,
        title: '设置密码',
        method: api.save_customer,
        visible: this.context.visible,
        onCancel: this.onCancel,
        form: this.props.form,
        ...this.context.batConfig,
    };

    return <div className="RightToolWrap" >
        <Row>
            <Col span={16}>
               <div className="Memberoverview">
                   <div className="title">
                         会员概况
                   </div>
                   <div className="cont">
                        <div className="item">
                            <div className="top">
                                 <p>订单总额</p>
                                 <img src={menberifo}></img>
                            </div>
                            <div className="bottom">
                                <p><span>{data.order_total_price}</span></p>
                                <p>下单总数 {data.order_total_count} </p>
                            </div>
                        </div>
                        <div className="item">
                            <div className="top">
                                 <p>平均订单金额</p>
                                 <img src={menberifo}></img>
                            </div>
                            <div className="bottom">
                                <p><span>{data.avg_order_price}</span></p>
                            </div>
                        </div>
                        <div className="item itemfont">
                               <p><span>注册时间 ：</span>{data.created_at}</p>
                               <p><span>最近登录时间 ：</span>{data.logined_at}</p>
                               <p><span>最近加购时间 ：</span>{data.lately_add_cart_time}</p>
                               <p><span>最近下单时间 ：</span>{data.lately_add_order_time}</p>
                        </div>
                   </div>
               </div>
            </Col>
            <Col span={8}>
                <div className="Memberinfo">
                        <p className="top">{data.email} <img style={{width: '30px'}} src={data.country_flag}></img></p>
                        <Form  {...layout}    >
                          <Col span={12}>
                                <Form.Item label="渠道来源" >
                                    <span>
                                      { data.sources_channel ? data.sources_channel.name : '' }
                                    </span>
                                   
                                </Form.Item>
                          </Col>
                          <Col span={12}>
                              <p className="edit" onClick={() => changeSearch.call(this, 1 ,4,data.id)} >设置</p>
                          </Col>
                        <Col span={24}>
                                <Col span={12}>
                                <Form.Item name="price" label="电子订阅" >
                                    {
                                        data.newsletter == 0 || data.newsletter == 1  ?   <Select disabled	 defaultValue={data.newsletter}  onChange={(value) => changeSearch.call(this, value,1,data.id)} showSearch optionFilterProp='children' >
                                                {
                                                    subscription.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                                }
                                   </Select>  :''
                                    }
                                  
                                </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item label="会员等级" >
                                    {
                                        data.customer_group_id ?  <Select  onChange={(value) => changeSearch.call(this, value,2,data.id)}   defaultValue={data.customer_group_id} showSearch optionFilterProp='children' >
                                        {
                                            storagegroup.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                        }
                                       </Select>  :''
                                    }
                                </Form.Item>
                                </Col>
                        </Col>
                        <Col span={12}>
                                <Form.Item label="专属客服" >
                                     {
                                        data.manager_id ?       <Select defaultValue={data.manager_id} onChange={(value) => changeSearch.call(this, value,3,data.id)}  showSearch optionFilterProp='children' >
                                        {
                                            storagemanager.map(item => <Option name={item.name} value={item.id}>{item.name}</Option>)
                                        }
                                       </Select>  :''
                                    }
                             
                                </Form.Item>
                         </Col>
                         <Col span={20}>
                                <Form.Item label="默认地址" >
                                     {
                                       data.addresses ?    data.addresses.map(item=>{
                                           if( item.default == 1 ){
                                               return(
                                                   item.address_1 ? item.address_1 : item.address_2
                                               )
                                           }
                                        })
                                        : 
                                        ''
                                     }
                             
                                </Form.Item>
                         </Col>
                         <Col span={4}>
                              <p className="edit" onClick={() => changeSearch.call(this,1 ,5,data.id)} >设置</p>
                         </Col>
                        </Form>
                </div>
            </Col>
        </Row>
    </div>
}