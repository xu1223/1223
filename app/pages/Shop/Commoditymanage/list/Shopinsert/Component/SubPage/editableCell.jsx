import {
    Table,
    Input,
    Icon,
    Button,
    Popconfirm,
    From,
  } from 'antd';
  import React, {
    Component
  } from 'react';
  import FormItem from 'antd/lib/form/FormItem';
  export default class EditableCell extends React.Component {
    state = {
      value: this.props.value,
      editable: false,
    }
    handleChange = (e) => {
      const value = e.target.value;
      this.setState({ value });
    }
    check = () => {
      this.setState({ editable: false });
      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    }
    edit = () => {
      this.setState({ editable: true });
    }
    validForm = (rule, value, callback) => {
      const {
          field
      } = rule;
      if (value.indexOf(this.validCode) == -1) {
          callback("只能含有数字、字母和下划线")
      } else {
          callback();
      }
  }
    render() {
      const { value, editable } = this.state;
      return (
        <div className="editable-cell">
          {
            editable ?
              <div className="editable-cell-input-wrapper">
                <Input
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                />
                <Icon
                  type="check"
                  className="editable-cell-icon-check"
                  style={{fontSize: 18, color: '#08c',top:6}}
                  onClick={this.check}
                />
              </div>
              :
              <div className="editable-cell-text-wrapper">
                {value || ' '}
                <Icon
                  type="edit"
                  className="editable-cell-icon"
                  style={{fontSize: 18, color: '#08c',top:9}}
                  onClick={this.edit}
                />
              </div>
          }
        </div>
      );
    }
  }