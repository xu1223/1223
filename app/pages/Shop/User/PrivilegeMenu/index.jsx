import React, {
    Component
} from 'react';
import {
    Icon,
    message,
    Card,
    Table,
    Input,
} from 'antd';
import SearchWrap from './Component/search';
import ToolWrap from './Component/tool';
import BatOperation from '@/components/BatOperation'
import pageConfig from './Config/index';
import DataOper from '@/advanced/dataOper2';
import api from 'fetch/api';
import {
    post,
    get
} from 'fetch/request';
import {
    ListContext
} from '@/config/context';

@DataOper(pageConfig)

export default class privilegeMenuPage extends Component {
    static defaultProps = {};

    state = {

    }

    constructor(props, context) {
        super(props, context);
        this.maxRemarksLen = 50;
        this.minTitleLen = 0;
        this.state = {
            inpValu: '',
            switchButtonAll: false,
            expandedRowsKeys: [],
            keys: [],
            visible: false,
        }
        this.indexList = [];

        this._batProps = (record)=> {
            let obj = {
                config : [{
                    title:'编辑',
                    noAuth:'edit',
                    noCheck:true,
                    size:'small',
                    ghost:true,
                    onClick:() => this.toggleWin('visible',{rowData:record})
                
                },{
                    title:'删除',
                    noAuth:'delete',
                    method:api.menu_del,
                    size:'small',
                    ghost:true,
                    params:{ids:record.id},
                    type:'danger',
                }],
                batConfig:this.props.batConfig,
                rowData:record
            } 
            return obj
        }
    
        this.columns = [{
            dataIndex: "className",
            title: "权限",
            width: 200,
            render: (text, record, index) => {
                return <span>{text}</span>
            }
        }, {
            dataIndex: "code",
            title: "权限编码",
            width: 100,
        }, {
            dataIndex: "level",
            title: "类型",
            width: 60,
            render: (text, record, index) => {
                return <span>{text == 1 ? '模块' : (text == 2 ? '菜单' : '操作')}</span>
            }
        }, {
            dataIndex: "index",
            title: "路由",
            width: 100,
        }, {
            dataIndex: "sort_order",
            title: "排序",
            width: 100,
            render: (text, record, index) => {
                return <Input defaultValue={text} onChange={this.handelChange.bind(this)} onPressEnter={() => this.onPressEnterInput(record)} style={{ width: 80 }} />
            }
        }, {
            dataIndex: "memo",
            title: "权限备注",
            width: 200,
            render: (text, record, index) => {
                return <div style={{ display: 'flex', alignItems: 'center' }}>
                     <Icon style={{ marginRight: '10px' }} type="edit" onClick={() => { this.toggleWin('visibleg',{rowData:record}) }} />
                </div>
            }
        }, {
            dataIndex: "key",
            title: "操作",
            width: 200,
            render: (text, record, index) => {
                return <BatOperation {...this._batProps(record)}/>
            }
        }]
    }

    


    componentDidMount() {
        this.getMenusList()
    }

    formatProductCate = (res) => {
        const arr = []
        res.map(item => {
            const obj = {
                value: item.id,
                className: item.name,
                title: item.name,
                level: item.level,
                id: item.id,
                key: item.id,
                code: item.code,
                expanded: item.expanded,
                parents: item.parents,
                index: item.index,
                memo: item.memo,
                sort_order: item.sort_order,
            }
            if (item.children && item.children.length > 0) {
                obj.children = this.formatProductCate(item.children)
            }
            arr.push(obj)
        })
        return arr;
    }

    formatProductCate1 = (res) => {
        const Barr = []
        res.map(item => {
            const obj = {
                label: item.name,
                value: item.id,
                code: item.code,
            }
            if (item.children && item.children.length > 0) {
                obj.children = this.formatProductCate1(item.children)
            }
            Barr.push(obj)
        })
        return Barr;
    }

    getMenusList = (value) => {
        post(api.get_menus, {
            pagesize: 10000,
            ...value
        }).then(res => {
            const getMenusList = this.formatProductCate(res.resultData.data.list);
            const PcategoryMenusList = this.formatProductCate1(res.resultData.data.list);
            this.setState({
                getMenusList,
                PcategoryMenusList,
            })
        })
    }


    handelChange(e) {
        this.setState({
            inpValu: e.target.value
        })
    }

    onPressEnterInput = (record) => {
        const {
            inpValu
        } = this.state;
        let params = {
            id: record.id,
            sort_order: inpValu,
        };
        post(api.menu_edit, { ...params
        }).then(res => {
            if (res.resultId == 1) {
                message.success(res.resultMsg);
                this.getMenusList();
            } else {
                message.error(res.resultMsg);
            }
        })
    }

    handleOnExpand = (expanded, record) => {
        const {
            keys
        } = this.state;
        if (expanded) {
            keys.push(record.id);
        } else {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] === record.id) {
                    if (i) {
                        keys.splice(i, 1)
                    } else {
                        keys.splice(0, 1)
                    }
                }
                if (record.children) {
                    for (let y = 0; y < record.children.length; y++) {
                        if (keys[i] === record.children[y].id) {
                            delete keys[i];
                        }
                    }
                }
            }
        }
        this.setState({
            expandedRowsKeys: Array.from(new Set(keys)),
            isRender: !this.state.isRender
        })
    }

    // 共享 tool 和index 
    toggleWin = (key = 'visible', otherConfig) => {
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })
    }

    render() {
        const {
            getMenusList,
            expandedRowsKeys,
            PcategoryMenusList
        } = this.state;

        //TODO： 工具栏的定义
        const toolProps = {
            ...this.props.toolConfig,
        }

        const contextProps = {
            visible: this.state.visible,
            visibleg: this.state.visibleg,
            ...this.state.otherConfig,
            toggleWin: this.toggleWin,
            getMenusList: this.getMenusList,
            PcategoryMenusList,
            batConfig: this.props.batConfig,
            changeSearch:this.props.changeSearch
        }

        return (
            <div className='userStyle'>
                <ListContext.Provider value={contextProps}>
                    <SearchWrap
                        getMenusList={this.getMenusList}
                    />
                    <Card className="content-main">
                        <ToolWrap
                            {...toolProps} />
                        <div className="content-table">
                            <Table
                                columns={this.columns}
                                dataSource={getMenusList}
                                expandedRowKeys={expandedRowsKeys}
                                onExpand={this.handleOnExpand}
                                rowKey="id"
                                pagination={false}
                            />
                        </div>
                    </Card>
                </ListContext.Provider>
            </div>
        )
    }
}