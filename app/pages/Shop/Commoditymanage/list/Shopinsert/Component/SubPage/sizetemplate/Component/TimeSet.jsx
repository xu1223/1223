import React, { Component } from 'react';

import {
    Form,
    message,
} from 'antd';
import SizeGuide from '../../../sizeguide'
import {MyModal} from 'components'
import { post } from 'fetch/request';
import Base from 'util/base.js';
import { WinConfirms} from '@/components/Confirm/index.js';

const {
    ModalComp,
    Confirm
} = MyModal;


@Form.create()
export default class TimeSet extends Component {
    static defaultProps = {
      
    };
    state = {

    }
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){

    }
    //需要处理 提交前数据的时候才要
    beforeCallback = () => {
        const {
            api,
            initData
        } = this.props;
        let that = this;
        //从子组件中获取到修改好后的数据并进行处理
        let data = this.setStateSizeTable(this.sizeGuide.state.columns,this.sizeGuide.state.tableData)
        console.log(data,'setStateSizeTablesetStateSizeTable')
        WinConfirms({
            title:'是否确认修改？',
            content: '确定后不可撤销',
            icon:'1',
            onOk : ()=>{
                const obj = {}
                obj.template_id = initData.id;
                obj.name = initData.name;
                obj.account_id = Base.getItem("manager_id");
                obj.size_chart = JSON.stringify(data);
                post(api.save_size_template,obj).then(res=>{
                    if(parseInt(res.resultId) == 200){
                        message.success(res.resultMsg)
                        that.props.handleCancel()
                        // that.props.changeSearch();
                        that.props.accessToTheTemplate();
                    }else{
                        message.error(res.resultMsg);
                    }
                })
            }
        })
    }

    //获取 hxcart尺码表 的数据
    setStateSizeTable = (columns, dataSource) => {
        let dataSourceParms = [],
            columnsArry = [],
            valueArr = [];
        columns && columns.map(item => {
            let _dest = item.dataIndex

            if (_dest.indexOf("|") != -1) {
                _dest = _dest.split("|")[0];
            }
            valueArr.push(item.dataIndex);
            columnsArry.push(_dest)
        })
        dataSourceParms.push(columnsArry)
        dataSource.map((item, index) => {
            //delete item.key;
            const arr = [];
            valueArr.map(_item => {
                arr.push(item[_item] || '')
            })
            dataSourceParms.push(arr);
        })
        return dataSourceParms
    }


    render() {

        const {
            initData = {},
            isEdit,
            form 
        } = this.props;
        //TODO:  modal 参数 其中beforeCallback  和 tiptext 是可选的
        const modalProp = {
            beforeCallback:this.beforeCallback,
            title:isEdit ? "编辑模板" : "查看模板",
            onCancel: this.props.handleCancel,
            okText:'保存',
            width:1000,
            ...this.props,
        };
        !isEdit ? modalProp.footer = false : null;
        return (
            <ModalComp 
                {...modalProp}
            >
                <div style = {{marginLeft:20,marginRight:20,marginBottom:20}}>
                    <SizeGuide
                        ref = {node=>this.sizeGuide = node}
                        {...this.props}
                        form = {form}
                        initData = {initData}
                        isEditPager = {false}
                        isEditPagerEdit = {isEdit ? true : false}
                        setStateSizeTable={this.setStateSizeTable}
                    />
                </div>
            </ModalComp>
        )
    }
}