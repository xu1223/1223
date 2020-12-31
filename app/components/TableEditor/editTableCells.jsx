import React from 'react'

import { Table, Button, Popconfirm, Icon} from 'antd';
import './index.less'

import {
    EditableCell,
    EditableFormRow
} from './editTableCell.jsx'

export default class EditableTable extends React.Component {
    constructor(props) {
      super(props);

      this.defaultData = {}
      let percent = 0
      props.columns.map(item=>{
        this.defaultData[item.dataIndex] = item.initValue || ''
        percent += parseInt(item.width) 
      })
      this.state = {
        dataSource: this.getDataOfKey(props.dataSource),
        count: props.dataSource.length,
      };

      if(props.noDel) {
        this.columns = props.columns
      } else {
        this.columns = props.columns.concat({
          title: '操作',
          dataIndex: 'operation',
          width:(100 - percent) + '%',
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record.key)}>
                <Icon type="delete" theme="filled" style={{color:"#F12036",fontSize:16}} />
              </Popconfirm>
            ) : null,
        })
      }
     
    }

    getDataOfKey = (data) =>{
        const arr = []
        data.forEach((item, index)=>{
            item.key = !item.id ? index : item.id
            arr.push(item) 
        })
        return arr
    }


    setData = (data) =>{
      this.setState({
        dataSource:this.getDataOfKey(data),
        count:data.length
      })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const {type,dataSource} = nextProps;
      console.log(dataSource,this)
        // type可能由props驱动，也可能由state驱动，这样判断会导致state驱动的type被回滚
        if (type !== prevState.type) {
            return {
                type,
                dataSource:dataSource,
                count:dataSource.length
            };
        }
        // 否则，对于state不进行任何操作
        return null;
    }
  
    handleDelete = key => {
      const dataSource = [...this.state.dataSource];
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };
  
    handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        ...this.defaultData,
        key: count,
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      });
    };
  
    handleSave = row => {
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      console.log(newData)
      this.setState({ dataSource: newData });
    };

    // 更新第一行数据
    syncFirstData = (dataIndex) =>{
      const {
        dataSource = []
      } = this.state
      let setValue
      dataSource.forEach((item, index)=>{
        if(index == 0) {
          setValue = item[dataIndex]
        } else {
          item[dataIndex] = setValue
        }
      })
      this.setState({
        dataSource
      })
    }

    render() {
      const { dataSource } = this.state;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
      const columns = this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        //获取同步按钮
        const title = col.needSync ? <div>{col.title}<Icon type="sync" title="同步" onClick={()=>this.syncFirstData(col.dataIndex)} className="edit-sync"/></div> : col.title;
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            type:col.type,
            title,
            itemConf:col.itemConf,
            submitAfter:col.submitAfter,
            addonBefore:col.addonBefore,
            addonAfter:col.addonAfter,
            handleSave: this.handleSave,
            ajaxConf:col.ajaxConf,
            formConf:col.formConf
          }),
          title
        };
      });
      return (
        <div>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination = {false}
          />
          {
            !this.props.noAdd && <Button onClick={this.handleAdd} size='large' icon="plus" type="dashed" block style={{ marginTop: 10 }}>
              新增
            </Button>
          }
          
        </div>
      );
    }
  }
