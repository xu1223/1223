import React, { Component } from "react";
import { Row, Col, Button, Table, Popover, Icon } from "antd";
import EditableCell from "./SubPage/editableCell";
import EditColumns from "./SubPage/editColumns";
import SizeTemplate from "./SubPage/sizetemplate/index";
import SaveSize from "./SubPage/savesize";
import api from "fetch/api";
class Sizeguide extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      editColVisible: true,
      curColumnsName: "",
      isEdit: false,
      sizeTemVisible: false,
      saveSizeVisible: false,
      columns: [],
      tableData: [],
      editColVisible: false,
    };
  }

  componentDidMount() {
    const { initData , sizeChartTable } = this.props;
    console.log(this.props,'initDatainitDatainitData')
    if (initData.id && initData.size_chart.length) {
      const { size_chart = [] } = initData;
      // const [headerData, ...dataSourceCol] = !!size_chart && typeof size_chart == "string" ? JSON.parse(size_chart) : [];
      const [headerData, ...dataSourceCol] = !!sizeChartTable
        ? sizeChartTable
        : !!size_chart
        ? size_chart
        : [];
      if (!!size_chart) {
        this.setStateDataSource(headerData, ...dataSourceCol);
      }
    } else {
      this.setState({
        columns: [
          {
            title: this.renderTitle("Size"),
            dataIndex: "Size",
            width: 100,
            render: (text, record, index) =>
              this.renderColumns(text, record, "Size"),
          },
        ],
      });
    }
  }

  //从模板列表页传来的模板数据
  changeSizeModal = (obj) => {
    const [headerData, ...dataSourceCol] = !!obj ? obj.size_chart : [];
    this.setStateDataSource(headerData, ...dataSourceCol);
  };
  //获取 hxcart尺码表 的数据
  setStateSizeTable = (columns, dataSource) => {
    let dataSourceParms = [],
      columnsArry = [],
      valueArr = [];
    columns &&
      columns.map((item) => {
        let _dest = item.dataIndex;

        if (_dest.indexOf("|") != -1) {
          _dest = _dest.split("|")[0];
        }
        valueArr.push(item.dataIndex);
        columnsArry.push(_dest);
      });
    dataSourceParms.push(columnsArry);

    dataSource.map((item, index) => {
      //delete item.key;
      const arr = [];
      valueArr.map((_item) => {
        arr.push(item[_item] || "");
      });
      dataSourceParms.push(arr);
    });
    return dataSourceParms;
  };
  //设置表格数据功能
  setStateDataSource = (headerData = [], ...dataSourceCol) => {
    const { setStateSizeTable } = this.props;
    const dataSourceList = [...dataSourceCol];
    let columns = [],
      columnsArr = [],
      tableData = [];
    headerData.map((item, index) => {
      let title = item;
      if (!!columnsArr.includes(title)) {
        title += "|" + index;
      }
      columns.push({
        title: this.renderTitle(title),
        dataIndex: title,
        width: 100,
        render: (text, record, index) =>
          this.renderColumns(text, record, title),
      });
      columnsArr.push(title);
    });
    dataSourceList.map((item, i) => {
      const itemObj = {};
      item.map((_item, index) => {
        itemObj[columnsArr[index]] = _item;
      });
      itemObj.key = this.getUnicodeKey() + i;
      tableData.push(itemObj);
    });

    const obj = {
      tableData,
    };

    if (columns.length > 0) obj.columns = columns;
    this.setState({
      ...obj,
    });
    let size_chart = setStateSizeTable(obj.columns, obj.tableData);
    // console.log(size_chart, "size_chart");
    this.props.sizeChartBind(size_chart);
  };
  //添加列 【验证完成】
  addThHandle = (title, isTool, mytext) => {
    let { columns } = this.state;
    let column = {
      title: this.renderTitle(mytext),
      dataIndex: mytext,
      width: 100,
      render: (text, record, index) => this.renderColumns(text, record, mytext),
    };

    let index = columns.length;
    //获取当前title的索引
    if (isTool != "isTool") {
      index = columns.findIndex((item) => {
        return item.dataIndex == title;
      });

      const nextCol = [];
      columns.map((item, _index) => {
        nextCol.push(item);
        if (_index == index) nextCol.push(column);
      });
      columns = nextCol;
    } else {
      columns.splice(index + 1, 0, column);
    }
    this.setState(
      {
        columns: columns,
      },
      () => {
        // console.log(this.state.columns);
      }
    );
  };
  //删除列
  delThHandle = (title) => {
    const { columns, tableData } = this.state;
    let index = columns.findIndex((item) => {
      return item.dataIndex == title;
    });
    columns.splice(index, 1);
    this.setState({
      columns,
    });
    let size_chart = this.props.setStateSizeTable(columns, tableData);
    this.props.sizeChartBind(size_chart);
  };
  //删除行
  delTdHandle = (record, e) => {
    let { tableData, columns } = this.state;
    tableData = tableData.filter((item) => {
      return item.key !== record.key;
    });
    this.setState({
      tableData,
    });
    let size_chart = this.props.setStateSizeTable(columns, tableData);
    this.props.sizeChartBind(size_chart);
  };
  //添加列
  onCellChange = (record, text, dataIndex) => {
    let { tableData, columns } = this.state;
    const index = tableData.findIndex((item) => item.key == record.key); //找到位置
    tableData[index][dataIndex] = text; //进行修改
    //修改表格数据
    this.setState({
      tableData,
    });
    let size_chart = this.props.setStateSizeTable(columns, tableData);
    this.props.sizeChartBind(size_chart);
  };
  resetColDataSource = (prev, title) => {
    console.log(prev, title,555555)
    const {
        tableData,
        columns
    } = this.state;
    const obj = { title: this.renderTitle(title), dataIndex: title, width: 100, render: (text, record, index) => this.renderColumns(text, record, title) }
    const index = columns.findIndex(item => item.dataIndex == prev);
    tableData.map(item => {
        item[title] = item[prev];
        delete item[prev];
    })
    columns.splice(index, 1, obj)
    let size_chart = this.props.setStateSizeTable(columns, tableData);
    this.props.sizeChartBind(size_chart);
    
    this.setState({
        columns,
        tableData
    });
}
  renderColumns = (text, record, dataIndex) => {
    const content = (
      <div className="fix-div">
        <Button type="primary" onClick={(e) => this.addTdHandle(record)}>
          添加行
        </Button>
        <Button type="danger" onClick={(e) => this.delTdHandle(record)}>
          删除行
        </Button>
      </div>
    );
    return (
      <Popover content={content} placement="topRight" trigger="hover">
        <a>
          <EditableCell
            value={text}
            onChange={(value) => this.onCellChange(record, value, dataIndex)}
          />
        </a>
      </Popover>
    );
  };
  handleCancel = () => {
    this.setState({
      importVisible: false,
      copyVisible: false,
      editColVisible: false,
      sizeTemVisible: false,
      saveSizeVisible: false,
    });
  };
  renderTitle = (title) => {
    const content = (
      <div className="fix-div">
        <Button
          type="primary"
          onClick={() =>
            this.setState({
              editColVisible: true,
              curColumnsName: title,
              isEdit: false,
            })
          }
        >
          添加列
        </Button>
        <Button type="danger" onClick={(e) => this.delThHandle(title)}>
          删除列
        </Button>
      </div>
    );
    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={() =>
            this.setState({
              editColVisible: true,
              curColumnsName: title,
              isEdit: true,
            })
          }
          style={{ textAlign: "left",paddingLeft:'30px' }}
        >
          {title}
        </div>
        <Popover content={content} trigger="hover">
          <Icon
            type="bars"
            style={{
              fontSize: 24,
              left: 0,
              top: 0,
              color: "#08c",
              position: "absolute",
            }}
          />
        </Popover>
      </div>
    );
  };

  //获取唯一值
  getUnicodeKey = () => {
    return new Date().getTime();
  };
  //添加行
  addTdHandle = (record) => {
    const { tableData } = this.state;
    // const { key } = record;
    // let key = record.key
    const data = {
      key: this.getUnicodeKey(),
    };
    // const index = tableData.findIndex((item) => key);
    // if (key) {
    //   console.log("key1");
    //     // tableData.splice(index + 1, 0, data);
    // } else {
    tableData.push(data);
    // }
    this.setState({
      tableData,
    });
  };
  render() {
    const butAttr = {
      type: "primary",
      size: "small",
      className: "button-style-blue button-style-small",
      style: {
        margin: "0 6px",
      },
    };
    const { setStateSizeTable, isEditPager, isEditPagerEdit } = this.props;
    const { tableData = [], columns = [] } = this.state;
    let _copyData = setStateSizeTable(columns, tableData);
    return (
      <div className="restTabStyle" style={{ marginTop: "10px" }}>
        <Row type="flex" justify="space-between" align="middle">
          <Col>
            <div style={{ marginBottom: "10px" }}>
              {isEditPager || isEditPagerEdit ? (
                <>
                  <Button {...butAttr} onClick={(e) => this.addTdHandle()}>
                    添加行
                  </Button>
                  <Button
                    {...butAttr}
                    onClick={() =>
                      this.setState({
                        editColVisible: true,
                        curColumnsName: "",
                        isEdit: false,
                      })
                    }
                  >
                    添加列
                  </Button>
                </>
              ) : null}
              {isEditPager ? (
                <>
                  <Button
                    {...butAttr}
                    onClick={() => this.setState({ sizeTemVisible: true })}
                  >
                    获取模板
                  </Button>
                  <Button
                    {...butAttr}
                    onClick={() => this.setState({ saveSizeVisible: true })}
                  >
                    保存为模板
                  </Button>
                </>
              ) : null}
            </div>
          </Col>
        </Row>
        <div className="sizeTable">
          <Table
            columns={columns}
            rowKey="key"
            bordered
            pagination={false}
            dataSource={tableData}
            onRowContextMenu={(e, index, event) => {
              console.log(e, index, event);
            }}
          />
        </div>
        {/* 新增列 */}
        {this.state.editColVisible ? (
          <EditColumns
            visible={this.state.editColVisible}
            handleCancel={this.handleCancel}
            addThHandle={this.addThHandle}
            columns={this.state.columns}
            curColumnsName={this.state.curColumnsName}
            resetColDataSource={this.resetColDataSource}
            isEdit={this.state.isEdit}
          />
        ) : null}
        {/* 尺码模板列表 */}
        {this.state.sizeTemVisible ? (
          <SizeTemplate
            visible={this.state.sizeTemVisible}
            handleCancel={this.handleCancel}
            changeSizeModal={this.changeSizeModal}
            {...this.props}
          />
        ) : null}
        {/* 保存模板 */}
        {this.state.saveSizeVisible ? (
          <SaveSize
            api={api}
            saveSizeData={_copyData}
            visible={this.state.saveSizeVisible}
            handleCancel={this.handleCancel}
          />
        ) : null}
      </div>
    );
  }
}
export default Sizeguide;
