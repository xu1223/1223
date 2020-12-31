import React from 'react'
import {
    Row,
    Form,
    Modal,
    Icon,
    message
} from 'antd';
const { confirm } = Modal;
import {
    SortableContainer,
    SortableElement
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { ListContext } from '@/config/context';
import Editmodel from './model'
import Addmodel from './addmodel'
import { setItem, getJson } from '@/util'
import '../index.less'
const SortableItem = SortableElement(({
    item,
    _index,
    sortreset,
    sortedit,
    page_type,
}) => {
    console.log(page_type, 'page_typepage_typepage_type')
    return <p className="commer" >
        <span className="commer-title">{item.name_cn}</span>

        {
            ((page_type != 'HEADER' && item.layout == 'HEADER') || (page_type != 'FOOTER' && item.layout == 'FOOTER')) ? '' : <span>
                <a onClick={() => sortedit(item, _index)} style={{ marginRight: '10px', pointerEvents: 'initial' }}>编辑</a>
                <a style={{ color: '#f43c3c', pointerEvents: 'initial' }} onClick={() => sortreset(item, _index)}>重置</a>
            </span>
        }

    </p>
});
/**
 * @desc 拖拽列表
 */
const SortableList = SortableContainer(({
    items,
    sortreset,
    sortedit,
    page_type
}) => {
    return (
        <Row>
            {
                items.map((item, index) => {
                    return <SortableItem
                        index={index}
                        page_type={page_type}
                        key={`-${index}`}
                        _index={index}
                        sortreset={sortreset}
                        sortedit={sortedit}
                        item={item}
                    />
                }
                )}
        </Row>
    );
});
class Decorate extends React.Component {
    static contextType = ListContext;  //设置 上下文
    constructor(props, context) {
        super(props, context);
        this.state = {
        }
    }
    componentDidMount = () => {
    }
    //打开编辑
    sortedit = (item, index) => {
        this.context.toggleWin('visible', item, index)
        window.frames["decorate"].move(`-${item.index}`)
    }

    editsetting = () => {
        const {
            settingsdata
        } = this.context
        let param = {
            settings: settingsdata
        }
        this.context.toggleWin('visible', param, 'total')
    }
    // 重置
    sortreset = (item, index) => {
        let {
            navdata,
            customizegupdate,
            tpl_page_id,
            id,
        } = this.context
        let key = ''
        if (item.index) {
            key = 'index'
        } else {
            key = 'id'
        }
        let init_data = getJson('init_data')
        let {
            sortEnd
        } = this.props
        for (var i = 0; i < init_data.length; i++) {
            if (item[key] == init_data[i][key]) {
                navdata[index] = init_data[i]

            }
        }
        let section = navdata[index]
        confirm({
            content: '是否重置该模块',
            onOk() {
                sortEnd(navdata)
                customizegupdate({
                    operate: 'UPDATE_SECTION',
                    tpl_page_id: tpl_page_id,
                    tpl_id: id,
                    section: section,
                    sections: navdata
                }, section.index)
            },
            onCancel() {
            },
        });
    }
    // 删除模块
    sortcolse = () => {
        let {
            rowData,
            index,
            toggleWin,
            customizegupdate,
            tpl_page_id,
            id,

        } = this.context
        let {
            navdata,
            sortEnd
        } = this.props;
        let Arr = ['FOOTER', 'HEADER']
        if (Arr.indexOf(navdata[index].layout) != -1) {
            message.error('特殊模块不允许删除')
            return
        }
        confirm({
            content: '是否删除该模块',
            onOk() {
                toggleWin('visible')
                navdata.splice(index, 1)
                sortEnd(navdata)

                var child = window.frames['decorate'].document.getElementById(`-${rowData.index}`);
                child.parentNode.removeChild(child);
                customizegupdate({
                    operate: 'DELETE_SECTION',
                    tpl_page_id: tpl_page_id,
                    tpl_id: id,
                    section: {},
                    sections: navdata
                })
            },
            onCancel() {
            },
        });

    }

    /**
     * @method
     * @desc 结束拖拽
     * @param {string} oldIndex 拖动前的索引
     * @param {string} newIndex 拖动后的索引
     */
    onSortEnd = (e) => {
        let {
            oldIndex,
            newIndex
        } = e;
        let {
            navdata,
            sortEnd
        } = this.props;
        const {
            page_type
        } = this.context
        if ((page_type != 'PRODUCT_THEME' && page_type != "INDEX")) {

            return
        }
        let Arr = ['FOOTER', 'HEADER']
        if (Arr.indexOf(navdata[newIndex].layout) != -1 || Arr.indexOf(navdata[oldIndex].layout) != -1) {
            message.error('头部底部不允许修改位置')
            return
        }
        this.context.lodingstatus(true)
        let newnavdata = JSON.parse(JSON.stringify(navdata))

        let olddata = newnavdata[oldIndex]
        let newdata= newnavdata[newIndex]
        newnavdata[oldIndex] = newdata
        newnavdata[newIndex] = olddata
        
        this.context.customizegupdate({
            operate: 'UPDATE_SECTION',
            tpl_page_id: this.context.tpl_page_id,
            tpl_id: this.context.id,
            section: {},
            sections: newnavdata
        })
        window.frames["decorate"].sp(navdata[oldIndex].index, navdata[newIndex].index ,oldIndex, newIndex)
        window.frames["decorate"].move(`-${navdata[oldIndex].index}`)

        sortEnd(newnavdata)

    };

    //打开添加弹窗
    addnav = () => {
        this.context.toggleWin('addvisible')
    }
    render() {
        const {
        } = this.state
        const {
            changename,
            navdata = []
        } = this.props;
        const {
            page_type
        } = this.context

        return (
            <div className="sort-main" id="sort_main">
                <div className="sort-header">
                    <p>{changename}</p>
                </div>
                <div className={(page_type == 'PRODUCT_THEME' || page_type == "INDEX") ? 'sort-item' : "sort-item sort-none"}>
                    <SortableList
                        items={navdata}
                        sortreset={this.sortreset}
                        sortedit={this.sortedit}
                        page_type={page_type}
                        onSortEnd={(e) => this.onSortEnd(e)}
                        axis='xy'
                        distance="10"
                    />
                    {
                        (page_type == 'PRODUCT_THEME' || page_type == "INDEX") ? <a className="addsort" onClick={() => this.addnav()}>
                            <Icon type="plus-circle" />
                    新增模块
                    </a> : ''

                    }




                </div>
                <Icon type="setting" className="sort-setting" onClick={() => this.editsetting()} />
                {this.context.visible && <Editmodel sortcolse={this.sortcolse} />}
                {this.context.addvisible && <Addmodel />}
            </div>


        )
    }
}

export default Form.create()(Decorate)