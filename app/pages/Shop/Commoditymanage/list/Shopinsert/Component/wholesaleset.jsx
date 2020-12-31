import React, { Component } from "react";
import { ListContext } from "@/config/context";
import moment from "moment";
import {
  Card,
  Button,
  Row,
  Col,
  Table,
  Input,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import { EditTableRow } from "@/components/TableEditor";
const FormItem = Form.Item;
const { Option } = Select;
import { FormFieldsMesg, FormFieldsSettingsName } from "../Config/FormFields";
import {  WinTernaryOperator } from '@/components/Confirm/index.js';

/**
 * 批发设置
 */
class Wholesaleset extends Component {
  static contextType = ListContext; //设置 上下文
  constructor(props, context) {
    super(props, context);
    this.state = {
      getCustomersGroupPager: [],
      wholesaledatalist: [],
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;

    this.columns = [
      {
        title: "会员等级",
        dataIndex: "customer_group_id",
        width: 120,
        width: 200,
        key: 1,
        render: (text, row, index) => {
          return (
            <div>
              <FormItem>
                {getFieldDecorator(
                  FormFieldsSettingsName[`customer_group_id`] + index,
                  {
                    initialValue:  WinTernaryOperator(row,'customer_group_id'),
                    rules: [{ required: true, message: "必填项" }],
                  }
                )(
                  <Select style={{ width: 200 }}>
                    {row.get_customers_group_list &&
                      row.get_customers_group_list.map((v) => {
                        return (
                          <Option value={v.id} key={v.id}>
                            {v.name}
                          </Option>
                        );
                      })}
                  </Select>
                )}
              </FormItem>
              {
                row.id && <FormItem style={{display:'none'}}>
                {getFieldDecorator(
                  FormFieldsSettingsName[`id`] + index,
                  {
                    initialValue:  WinTernaryOperator(row,'id'),
                  }
                )(
                  <Input/>
                )}
              </FormItem>
              }
              {
                row.product_id && <FormItem style={{display:'none'}}>
                {getFieldDecorator(
                  FormFieldsSettingsName[`product_id`] + index,
                  {
                    initialValue:  WinTernaryOperator(row,'product_id'),
                  }
                )(
                  <Input/>
                )}
              </FormItem>
              }
            </div>
          );
        },
      },
      {
        title: "购买数量",
        ColSpan: 9,
        dataIndex: "purchase_number_min",
        width: 200,
        key: 2,
        render: (text, row, index) => {
          return (
            <div style={{display:'flex'}}>
              <FormItem>
                {getFieldDecorator(
                  FormFieldsSettingsName[`purchase_number_min`] + index,
                  {
                    initialValue: WinTernaryOperator(row,'purchase_number_min'),
                    rules: [{ required: true, message: "必填项" }],
                  }
                )(<Input prefix=">" style={{ width: "100px" }} />)}
              </FormItem>

              <span style={{ color: "#DCDCDC", margin: "0 10px" }}>——</span>
              <FormItem>
                {getFieldDecorator(
                  FormFieldsSettingsName[`purchase_number_max`] + index,
                  {
                    initialValue: WinTernaryOperator(row,'purchase_number_max'),
                    rules: [{ required: true, message: "必填项" }],
                  }
                )(<Input prefix="≤" style={{ width: "100px" }} />)}
              </FormItem>
            </div>
          );
        },
      },
      {
        title: "市场价【 ＄ 】",
        ColSpan: 9,
        dataIndex: "selling_price",
        width: 200,
        key: 3,
        render: (text, row , index) => {
          return (
            <FormItem>
              {getFieldDecorator(
                FormFieldsSettingsName[`selling_price`] + index,
                {
                  initialValue:  WinTernaryOperator(row,'selling_price'),
                  rules: [{ required: true, message: "必填项" }],
                }
              )(<Input prefix="≤" style={{ width: "100px" }} />)}
            </FormItem>
          );
        },
      },
      {
        title: "开始时间",
        ColSpan: 9,
        dataIndex: "date_start",
        width: 200,
        key: 4,
        render: (text, row , index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsSettingsName[`date_start`] + index, {
                initialValue:  row.date_start ?moment(row.date_start, 'YYYY/MM/DD') : '',
                rules: [{ required: true, message: "必填项" }],
              })(<DatePicker />)}
            </FormItem>
          );
        },
      },
      {
        title: "结束时间",
        ColSpan: 9,
        dataIndex: "date_end",
        width: 200,
        key: 5,
        render: (text, row , index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsSettingsName[`date_end`] + index, {
                initialValue: row.date_end ?moment(row.date_end, 'YYYY/MM/DD') : '',
                rules: [{ required: true, message: "必填项" }],
              })(<DatePicker placeholder="" />)}
            </FormItem>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        ColSpan: 0,
        width: 200,
        key: 11,
        render: (text, record, index) => {
          //TODO:
          return (
            <div className="operatingButton">
              <Popconfirm
                title="确定是否删除"
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.deleteShops(record, index)}
              >
                <Button type="danger">删除</Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }
  /**
   * 删除
   */
  deleteShops = (item, index) => {
    this.context.wholesaleDel(item, index);
  };
  addShops = () => {
    const { isSku, isCategoryIds, getCustomersGroupPager } = this.context;
    if (!isCategoryIds) {
        message.warning(FormFieldsMesg["category_ids"]);
        this.context.getCcategoryOptionValuefn(false);
        return false;
      } else if (!isSku) {
        message.warning(FormFieldsMesg["sku"]);
        this.context.isSkufn(false);
        return false;
      }
      if (isSku) {
        this.context.isSkufn(true);
      }
    let parms = {
        get_customers_group_list: getCustomersGroupPager,
        purchase_number_min: "",
        purchase_number_max: "",
        date_start: "",
        date_end: "",
      };
    this.context.wholesaledatacall(parms);
   
  };
  render() {
    const { getCustomersGroupPager } = this.context;
    this.columns2 = [
      {
        title: "会员等级",
        dataIndex: "customer_group_id",
        width: "10%",
        _type: {
          //类型 支持对象 和 字符串的形式
          name: "select",
          data: getCustomersGroupPager,
        },
        _itemConf: {
          rules: [{ required: true, message: "必填项" }],
        },
      },
      {
        title: "购买数量",
        width: "30%",
        dataIndex: "purchase_number",
        _type: {
          //类型 支持对象 和 字符串的形式
          name: "group",
        },
        _itemConf: {
          rules: [{ required: true, message: "必填项" }],
        },
      },
      {
        title: "市场价【 ＄ 】",
        width: "20%",
        dataIndex: "selling_price",
        _itemConf: {
          rules: [{ required: true, message: "必填项" }],
        },
      },
      {
        title: "开始时间",
        width: "15%",
        _type: "date",
        dataIndex: "date_start",
        _itemConf: {
          rules: [{ required: true, message: "必填项" }],
        },
      },
      {
        title: "结束时间",
        width: "15%",
        _type: "date",
        dataIndex: "date_end",
        _itemConf: {
          rules: [{ required: true, message: "必填项" }],
        },
      },
    ];
    const { wholesaledata } = this.context;
    const { wholesaledatalist } = this.state;
    const tableProps = {
      tableType: "expand",
      columns: this.columns,
      dataSource: wholesaledata,
    };

    const editTableRowAttr = {
      form: this.props.form,
      columns: this.columns2,
      force: this.state.force,
      noDel: false,
      rowselect: true,
      dataSource: this.state.dataSource || [],
      noAdd: true,
      ref: (table) => (this.tableEditor = table),
    };

    return (
      <div className="content-main-card">
        <Card className="dercription">
          <div className="action-bar">
            <Row type="flex" justify="start" align="middle" gutter={10}>
              <Col>
                <Button type="primary" onClick={this.addShops}>
                  新增
                </Button>
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Table {...tableProps} />
              {/* <EditTableRow {...editTableRowAttr} /> */}
            </Row>
          </div>
        </Card>
      </div>
    );
  }
}

export default Wholesaleset;
