import React from 'react'

import {
  Input,
  Form,
  InputNumber,
  Select,
  DatePicker,
  Spin
} from 'antd';

const {
  MonthPicker,
  WeekPicker
} = DatePicker;

const Option = Select.Option;
const FormItem = Form.Item
import debounce from 'lodash.debounce';

const EditableContext = React.createContext();

import {
  post,
  get
} from '@/fetch/request.js';

const EditableRow = ({
  form,
  index,
  ...props
}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
//获取行组件
export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({
      editing
    }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e, value) => {
    const {
      record,
      handleSave,
      submitAfter,
      dataIndex
    } = this.props;
    if (e == "month") {
      this.toggleEdit();
    } else {
      debugger
      this.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        this.toggleEdit();
        const newRow = { ...record,
          ...values
        }
        if (!!this.state.remoteData) {
          if (newRow.spu) {
            const curSpu = this.state.remoteData.find(item => item.spu == newRow.spu)
            if (curSpu) {
              newRow.spu_thumb = curSpu.thumb
            }
          }
          if (newRow.sku) {
            const curItem = this.state.remoteData.find(item => item.sku == newRow.sku)
            if (curItem) {
              newRow.sku_thumb = curItem.thumb
              if (curItem.spu_model.spu) {
                newRow.spu = {
                  key: curItem.spu_model.id,
                  label: curItem.spu_model.spu
                }
                newRow.spu_thumb = curItem.spu_model.thumb
              }
            }
          }
        }
        handleSave(newRow);
        if (submitAfter && record[dataIndex] != values[dataIndex]) {
          submitAfter(values[dataIndex], newRow)
        }
      });
    }

  };
  //TODO 待定
  dateGet = (form, dataIndex, record) => {
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
      })(<DatePicker ref={node => (this.input = node)} onBlur={this.save} />)}
    </FormItem>
  }
  //TODO 待定
  monthGet = (form, dataIndex, record) => {
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
      })(<MonthPicker ref={node => (this.input = node)} onChange={() => this.save("month", value)} />)}
    </FormItem>
  }
  //TODO 待定
  weekGet = (form, dataIndex, record) => {
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
      })(<WeekPicker ref={node => (this.input = node)} onBlur={this.save} />)}
    </FormItem>
  }

  inputGet = (form, dataIndex, record, itemConf) => {
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
        ...itemConf
      })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
    </FormItem>
  }

  numberGet = (form, dataIndex, record, itemConf) => {
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
        initialValue: record[dataIndex],
        ...itemConf
      })(<InputNumber style={{ width: '100%' }} ref={node => (this.input = node)} onBlur={this.save} />)}
    </FormItem>
  }

  selectGet = (form, dataIndex, record, itemConf, data, remoteObj, formConf) => {
    const obj = {
      showSearch: true,
      optionFilterProp: "children",
      allowClear: true,
      ...remoteObj
    }
    return <FormItem style={{ margin: 0, flex: 1 }}>
      {form.getFieldDecorator(dataIndex, {
        initialValue:typeof record[dataIndex] == 'object' ? record[dataIndex] : record[dataIndex] + '' ,
        ...itemConf
      })(<Select  style={{ width: '90%',paddingLeft:'5px' }} {...obj} {...formConf} onBlur={this.save} ref={node => (this.input = node)}>
        {
          data.map(item => <Option key={item.value || item.id} value={(item.spu || item.sku || item.value || item.id) + ''}>{item.label || item.code || item.name || item.spu || item.sku}</Option>)
        }
      </Select>)}
    </FormItem>
  }

  remoteGet = (form, dataIndex, record, itemConf, data, ajaxConf, formConf) => {
    const {
      remoteData = []
    } = this.state;
    const remoteObj = {
      notFoundContent: this.state.fetching ? <Spin size="small" /> : null,
      filterOption: false,
      onSearch: (value) => this.getData(value, ajaxConf, record),
    }
    return this.selectGet(form, dataIndex, record, itemConf, remoteData, remoteObj, formConf)
  }

  getData(value, ajaxConf = {}, record) {
    //this.lastFetchId += 1;
    //const fetchId = this.lastFetchId;

    const {
      url,
      requestKey,
      otherParam = {}
    } = {
      url: "/home/member/getAllMemberListByName", //模糊搜索url
      requestKey: "name", // 模糊搜索值对应的参数名
      ...ajaxConf
    }

    if (record.platform) {
      otherParam.platform = record.platform
    }

    this.setState({
      fetching: true
    });

    get(url, {
      [requestKey]: value,
      ...otherParam
    }).then((data) => {
      // if (fetchId !== this.lastFetchId) {
      //   return;
      // }
      this.setState({
        remoteData: data.resultData.data instanceof Array ? data.resultData.data : data.resultData.data.list,
        fetching: false
      });
    });
  }

  renderCell = form => {
    this.form = form;
    const {
      children,
      dataIndex,
      record,
      title,
      type = 'input',
      addonAfter,
      addonBefore,
      itemConf,
      ajaxConf,
      formConf
    } = this.props;
    const {
      editing
    } = this.state;

    let _type = type,
      data = []
    if (type instanceof Object) {
      _type = type.name
      data = type.data
    }

    const arr = []
    if (addonBefore) {
      arr.push(addonBefore(record))
    }

    if (editing) {
      arr.push(this[_type + 'Get'](form, dataIndex, record, itemConf, data, ajaxConf, formConf))
    } else {
      arr.push(<div
        className="editable-cell-value-wrap"
        style={{ flex: 1 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>)
    }
    if (addonAfter) {
      arr.push(addonAfter(record))
    }
    return <div style={{ "display": "flex", alignItems: 'center' }}>{arr}</div>
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}