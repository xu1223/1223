import React, { Component } from "react";

import { Icon, message, Button } from "antd";

import SearchWrap from "./SubPage/Search";
import TablesComp from "components/TableComp";
import TimeSet from "./component/TimeSet";
import pageConfig from "./Config/index.js";
import DataOper from "advanced/dataOper2";
import { MyModal } from "components";
import api from "fetch/api";
import { post } from "fetch/request";
const { ModalComp } = MyModal;
import { WinConfirms} from '@/components/Confirm/index.js';

@DataOper({ ...pageConfig })
export default class SizeTemplate extends Component {
  static defaultProps = {};
  componentDidMount() {
    //请求ajax 数据
    this.props.changeSearch();
    this.accessToTheTemplate()
  }
  /**
   * 获取模板数据
   */
  accessToTheTemplate= ()=>{
    post(api.get_size_template_pager).then((res) => {
        const { code, data } = res;
        if (res.resultId == 200) {
          this.setState({
            dataSource: res.resultData.data,
            loading: false,
          });
        }
      });
   }
  constructor(props, context) {
    super(props, context);
    this.state = {
      sortedInfo: {}, //排序用到的对象
      dataSource: [],
      loading: true,
      editVisible: false,
      initData: {},
      isEdit: false,
    };
    const styleIcon = {
      fontSize: 20,
      marginLeft: 10,
    };

    this.columns = [
      {
        title: "序号",
        dataIndex: "id",
        width: 80,
      },
      {
        title: "模板标题",
        dataIndex: "name",
        width: 100,
      },
      {
        title: "编辑者",
        dataIndex: "manager_name",
        width: 100,
      },
      {
        title: "保存时间",
        dataIndex: "created_at",
        width: 120,
      },
      {
        title: "操作",
        dataIndex: "key",
        width: 120,
        render: (text, record, index) => {
          return (
            <div>
              <Icon
                type="eye"
                style={styleIcon}
                onClick={() =>
                  this.setState({
                    editVisible: true,
                    initData: record,
                    isEdit: false,
                  })
                }
              />
              <Icon
                type="edit"
                style={styleIcon}
                onClick={() =>
                  this.setState({
                    editVisible: true,
                    initData: record,
                    isEdit: true,
                  })
                }
              />
              <Icon
                type="delete"
                style={styleIcon}
                onClick={() => this.delect(record)}
              />
            </div>
          );
        },
      },
    ];
  }

  // 删除
  delect = (record) => {
    const that = this;
    WinConfirms({
      title: "操作提示",
      content: "是否确认删除？",
      icon:'123',
      onOk() {
        post(api.del_size_template, { template_id: record.id }).then((res) => {
          message.success("操作成功");
          that.props.changeSearch();
          this.accessToTheTemplate();
        });
      },
    });
  };

  //提交尺码模板
  addSizeModal = () => {
    const { selectedRows } = this.props;
    if (selectedRows.length != 1) {
      message.error("请勾选一个尺码模板进行操作");
    } else {
      this.props.changeSizeModal(selectedRows[0]);
      this.props.handleCancel();
    }
  };

  handleCancel = () => {
    this.setState({
      editVisible: false,
    });
  };

  render() {
    //搜索定义参数 TODO:  这里根据实际情况对其增加属性
    const searchProps = {
      ...this.props.searchConfig,
    };

    //表格定义参数 TODO： 这里只需要改 this.columns
    const tableProps = {
      columns: this.columns,
      ...this.props.tableConfig,
      dataSource: this.state.dataSource,
      loading: this.state.loading,
    };
    const modalProp = {
      title: "获取模板",
      winType: 3,
      ...this.props,
      onCancel: this.props.handleCancel,
      okText: "提交",
      onOk: this.addSizeModal,
    };
    return (
      <ModalComp {...modalProp}>
        <div className="restTabStyle ">
          {/* <SearchWrap {...searchProps} /> */}
          <div className="main-content">
            <TablesComp {...tableProps} />
          </div>
        </div>
        {this.state.editVisible ? (
          <TimeSet
            visible={this.state.editVisible}
            handleCancel={this.handleCancel}
            initData={this.state.initData}
            isEdit={this.state.isEdit}
            api={api}
            accessToTheTemplate = {this.accessToTheTemplate}
            {...this.props}
          />
        ) : null}
      </ModalComp>
    );
  }
}
