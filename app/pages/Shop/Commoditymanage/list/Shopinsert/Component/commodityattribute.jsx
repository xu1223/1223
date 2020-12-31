import React, { Component } from "react";
import { ListContext } from "@/config/context";
import {
  Card,
  Button,
  Switch,
  Row,
  Col,
  Table,
  Input,
  InputNumber,
  Form,
  Popconfirm,
  message,
} from "antd";
import { post } from "fetch/request";
import api from "fetch/api";

import Asyncsku from "./asyncsku";
import { FormFieldsMesg, FormFieldsAttrName } from "../Config/FormFields";
import { WinTernaryOperator } from "@/components/Confirm/index.js";
const FormItem = Form.Item;
class Commodityattribute extends Component {
  static contextType = ListContext; //设置 上下文
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
    const { form } = this.props;
    const { getFieldDecorator } = form;

    this.columns = [
      {
        title: "颜色",
        dataIndex: "color",
        width: 120,
        width: 200,
        key: 1,
        render: (text, row, index) => {
          return (
            <div>
              {row.color}
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(FormFieldsAttrName[`color`] + index, {
                  initialValue: row.color || '',
                })(<Input type="hidden" value={row.color} />)}
              </FormItem>
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(
                  FormFieldsAttrName[`option_value_id`] + index,
                  {
                    initialValue: row.option_value_id || '',
                  }
                )(<Input type="hidden" value={row.option_value_id} />)}
              </FormItem>
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(FormFieldsAttrName[`id`] + index, {
                  initialValue: row.id || '',
                })(<Input type="hidden" value={row.id ? row.id : ""} />)}
              </FormItem>
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(FormFieldsAttrName[`option_id`] + index, {
                  initialValue: row.option_id || '',
                })(<Input type="hidden" value={row.option_id} />)}
              </FormItem>
            </div>
          );
        },
      },
      {
        title: "尺码",
        ColSpan: 9,
        dataIndex: "name",
        width: 200,
        key: 2,
        render: (text, row, index) => {
          return (
            <div>
              {row.option_value_name}
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(FormFieldsAttrName[`option_value_name`] + index, {
                  initialValue: row.option_value_name || '',
                })(<Input type="hidden" value={row.option_value_name} />)}
              </FormItem>
            </div>
          );
        },
      },
      {
        title: "子SKU",
        ColSpan: 9,
        dataIndex: "zsku",
        width: 200,
        key: 3,
        render: (text, row, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`zsku`] + index, {
                initialValue: row.zsku || '',
                rules: [{ required: true, message: "必填项" }],
              })(<Input />)}
            </FormItem>
          );
        },
      },
      {
        title: "实际售价【 ＄ 】",
        ColSpan: 9,
        dataIndex: "price",
        width: 200,
        key: 4,
        render: (text, row, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`price`] + index, {
                initialValue: row.price || '',
                rules: [{ required: true, message: "必填项" }],
              })(<Input />)}
            </FormItem>
          );
        },
      },
      {
        title: "市场价【 ＄ 】",
        ColSpan: 9,
        dataIndex: "show_price",
        width: 200,
        key: 5,
        render: (text, row, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`show_price`] + index, {
                initialValue: row.show_price || '',
                rules: [{ required: true, message: "必填项" }],
              })(<Input />)}
            </FormItem>
          );
        },
      },
      {
        title: "重量【 KG 】",
        ColSpan: 9,
        dataIndex: "weight",
        width: 200,
        key: 6,
        render: (text, row = {}, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`weight`] + index, {
                initialValue: row.weight || '',
                rules: [{ required: true, message: "必填项" }],
              })(<Input />)}
            </FormItem>
          );
        },
      },
      {
        title: "库存",
        ColSpan: 9,
        dataIndex: "quantity",
        width: 200,
        key: 7,
        render: (text, row = {}, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`quantity`] + index, {
                initialValue: row.quantity || '',
                rules: [{ required: true, message: "必填项" }],
              })(<Input />)}
            </FormItem>
          );
        },
      },
      {
        title: "排序",
        ColSpan: 9,
        dataIndex: "sort_order",
        width: 200,
        key: 8,
        render: (text, row = {}, index) => {
          return (
            <FormItem>
              {getFieldDecorator(FormFieldsAttrName[`sort_order`] + index, {
                initialValue: row.sort_order || '',
              })(<Input />)}
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
        render: (text, row, index) => {
          //TODO:
          return (
            <div className="operatingButton">
              <FormItem style={{ margin: '0' }}>
                {getFieldDecorator(FormFieldsAttrName[`status`] + index, {
                  initialValue: row.status == 1 ? true : false
                })(
                  <Switch
                    style={{ width: "68px", fontSize: "12px" }}
                    checkedChildren="上架"
                    unCheckedChildren="下架"
                    onChange={(val) => this.changeswitch(val, row)}
                    defaultChecked={row.status == 1 ? true : false}
                  />
                )}
              </FormItem>
              <Popconfirm title='确定是否删除'
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.deleAttribute(row, index)}>
                <Button type="danger" >删除</Button>
              </Popconfirm>
              {/* <Button onClick={() => this.deleAttribute(row, index)}>删除</Button> */}
            </div>
          );
        },
      },
    ];
  }
  commforceUpdate(_this) {
    _this.forceUpdate();

  }
  changeswitch = (val, row) => {
    console.log(row)
    if (row.status == 1) {
      row.status = 2
    } else {
      row.status = 1
    }
    console.log(row, '-----------')
  }
  deleAttribute = (item, index) => {
    this.context.dommodityAttribute.splice(index, 1)
    this.commforceUpdate(this);
  }
  setAttribute = () => {
    const { isSku, isCategoryIds } = this.context;
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
    this.context.toggleWin("issetAttributes", {});
  };
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
        name: record.name,
      }),
    };
    const { setAttrdata } = this.context;
    let dommodityAttribute = []
    if (this.context.dommodityAttribute) {
      dommodityAttribute = JSON.parse(JSON.stringify(this.context.dommodityAttribute))
    }
    let colorname = ''
    setAttrdata.map(item => {
      if (item.name == 'Color') {
        colorname = item.option_value_list[0] ? item.option_value_list[0].option_value_name : ''
      }
    })
    dommodityAttribute.map(item => {
      item['color'] = colorname
    })
    // rowSelection,
    const tableProps = {
      tableType: "expand",
      columns: this.columns,
      dataSource: dommodityAttribute,

      noAdd: true,
      ref: (table) => (this.tableEditor = table),
    };
    return (
      <div className="content-main-card">
        <Card className="dercription">
          <div className="action-bar">
            <Row type="flex" justify="start" align="middle" gutter={10}>
              <Col>
                <Button type="primary" onClick={this.setAttribute}>
                  设置属性
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => this.context.toggleWin("visibleAddress", {})}
                >
                  同步子SKU
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: "10px" }}>
              {setAttrdata &&
                setAttrdata.map((v, index) => {
                  return (
                    v.option_value_list ? <div
                      key={index}
                      className="clearfix setatr-select-header"
                      style={{ display: v.option_value_list.length == 0 ? 'none' : 'block' }}
                    >

                      <div className="setatr-select-type-name">{v.name}</div>
                      <div className="setatr-select-type">
                        <ul className="clearfix">
                          {v.option_value_list.map((n, k) => {
                            return (
                              <li
                                key={k}
                                style={{ border: "none", cursor: "default" }}
                              >
                                {n.option_value_name}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div> : ''
                  );
                })}
            </div>
            <Row style={{ marginTop: "10px" }}>
              <Table ref="butetable" {...tableProps} />
              {/* <EditTableRow {...tableProps} />   */}
              {/* <EditTableRow  {...tableProps}  filterMultiple={true} /> */}
            </Row>
          </div>
        </Card>
        {this.context.visibleAddress && <Asyncsku commforceUpdate={this.commforceUpdate} this={this} />}
      </div>
    );
  }
}
export default Commodityattribute;
