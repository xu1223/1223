import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Select } from 'antd';
const Option = Select.Option
const FormItem = Form.Item;
import './index.less'

const EditableContext = React.createContext();

// 获取行编辑的元素
class EditableCell extends React.Component {
    getFormElem = () => {
        const {
            type = 'input',
            data = []
        } = this.props;
        if (type == 'number') {
            return <InputNumber />
        } else if (type == "select") {
            return <Select>
                {data.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
        } else {
            return <Input />;
        }
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            itemConf = {},
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <FormItem style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            initialValue: record[dataIndex],
                            ...itemConf
                        })(this.getFormElem())}
                    </FormItem>
                ) : (
                        children
                    )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

@Form.create()
export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.getDataOfKey(props.dataSource),
            editingKey: ''
        };

        let percent = 0
        props.columns.map(item => {
            percent += parseInt(item.width)
        })

        this.columns = props.columns.concat({
            title: '操作',
            dataIndex: 'operation',
            width: (100 - percent) + '%',
            render: (text, record) => {
                const { editingKey } = this.state;
                const editable = this.isEditing(record);
                return editable ? (
                    <span>
                        <EditableContext.Consumer>
                            {form => (
                                <a
                                    onClick={() => this.save(form, record.key)}
                                    style={{ marginRight: 8 }}
                                >
                                    保存
                  </a>
                            )}
                        </EditableContext.Consumer>
                        <Popconfirm title="确认取消?" onConfirm={() => this.cancel(record.key)}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                        <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                            编辑
            </a>
                    );
            },
        })
    }


    setData = (data) => {
        this.setState({
            dataSource: this.getDataOfKey(data)
        })
    }

    getDataOfKey = (data) => {
        const arr = []
        data.forEach((item, index) => {
            item.key = !item.id ? index : item.id
            arr.push(item)
        })
        return arr
    }

    isEditing = record => record.key === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const newData = [...this.state.dataSource];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
            } else {
                newData.push(row);
            }
            this.setState({
                dataSource: newData,
                editingKey: ''
            })
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    render() {
        const components = {
            body: {
                cell: EditableCell,
            },
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    type: col.type,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <EditableContext.Provider value={this.props.form}>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.dataSource}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                />
            </EditableContext.Provider>
        );
    }
}
