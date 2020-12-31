import {
    Input,
    Switch,
} from 'antd';
import React from 'react';
import api from '@/fetch/api';
import BatOperation from '@/components/BatOperation';
export default {
    toolConfig: {
        "list": {
            action: "get_bottom_column_list",
        },
    },
};

export const TabApi = {
    list: 'get_bottom_column_list',
    remind: 'get_bottom_column_posts_list',
    template: 'get_bottom_column_list',
    grouping: 'get_bottom_column_posts_list',
}

export const tabConfig = [{
    id: "list",
    name: "邮件列表",
}, {
    id: "remind",
    name: "邮件提醒",
}, {
    id: "template",
    name: "邮件模板",
}, {
    id: "grouping",
    name: "收件人分组",
}];
export function _batProps(rowData, key) {
    return {
        config: [{
            title: '详情',
            onAuth: 'add',
            noCheck: true,
            onClick: () => this.toggleWin(key, rowData)
        }, {
            title: '删除',
            onAuth: 'add',
            noCheck: true,
            type:"danger",
            visible: key == 'grouping',
            method: api.del_bottom_column,
        }],
        batConfig: this.props.batConfig,
        rowData,
        paramData: {
            id: rowData.id
        }
    }
};

export function handelSave(key) {
    const Tabtable = {
        list: [{
                title: '任务名称',
                dataIndex: 'title',
            }, {
                title: '邮件标题',
                dataIndex: 'title_cn',
            },
            {
                title: '发送人数 / 阅读数（点击数）',
                dataIndex: 'title_cn',
            },
            {
                title: '发送状态',
                dataIndex: 'title_cn',
            },
            {
                title: '发送时间',
                dataIndex: 'title_cn',
            },
            {
                title: '操作',
                dataIndex: "id",
                width: 300,
                fixed: 'right',
                render: (text, record) => {
                    let data = _batProps.call(this,record, key)
                    return <BatOperation {
                        ...data
                    }
                    />
                }
            }
        ],
        remind: [{
                title: '提醒类型',
                dataIndex: 'title',
            }, {
                title: '邮件标题',
                dataIndex: 'title_cn',

            },
            {
                title: '备注',
                dataIndex: 'title_cn',
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                render: (text, record) => {
                    return <Switch defaultChecked = {
                        text == 1 ? true : false
                    }
                    onChange = {
                        (e) => this.onChange(e, record.id)
                    }
                    />
                }

            }, {
                title: '排序',
                dataIndex: 'sort_order',
                width: 180,
                render: (text, record) => {
                    let font = record.sort_order ? record.sort_order : ''
                    return <Input defaultValue = {
                        font
                    }
                    onBlur = {
                        (value) => this.onBlur(value, record.id, font)
                    } /> 
                }
            },
            {
                title: '操作',
                dataIndex: "id",
                width: 300,
                fixed: 'right',
                render: (text, record) => {
                    let data = _batProps.call(this,record, 'list')
                    return <BatOperation {
                        ...data
                    }
                    />
                }
            }
        ],
        grouping: [{
                title: '分组名称',
                dataIndex: 'title',
            }, {
                title: '邮箱数量',
                dataIndex: 'title_cn',

            },
            {
                title: '操作',
                dataIndex: "id",
                width: 300,
                fixed: 'right',
                render: (text, record) => {
                    let data = _batProps.call(this,record, key)
                    return <BatOperation {
                        ...data
                    }
                    />
                }
            }
        ],
    }


    return Tabtable[key]

}