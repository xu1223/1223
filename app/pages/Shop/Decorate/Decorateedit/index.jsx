import React from 'react'
import {
    Button,
    Form,
    Select,
    Modal,
    Col,
    Row,
    message,
    Spin,
    Affix
} from 'antd';
const { confirm } = Modal;
const Option = Select.Option;
import { ListContext } from '@/config/context';
import Nav from './Component/nav';
import './index.less'
import { setItem, getJson } from '@/util'
import { iframeinit, htmlinit, htmlinitend } from './config/index'
import api from "@/fetch";
class Decorate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false,
            addvisible: false,
            changeselect: '',
            navdata: [],
            init_data: [],
            previewtext: '预览',
            previewshow: true,
        }
        this.id = ''
        this.draft_id = ''
        this.tpl_page_id = ''
    }
    componentDidMount = () => {
        const {
            routeParams
        } = this.props
        const {
            id,
            tpl_id
        } = routeParams
        this.id = tpl_id
        this.tpl_page_id = id
        setItem('init_data', [])
        this.customizegpages_list(tpl_id, id)
        this.customizetemplate(id, tpl_id, true)
        api.order.customizegsections({ tpl_id: tpl_id, tpl_page_id: id }).then((res) => {
            if (res) {
                this.setState({
                    addtemplate: res.resultData
                })
            }
        })
        api.order.get_template_global_settings({ tpl_id: tpl_id }).then((res) => {
            if (res) {
                this.setState({
                    settingsdata: res.resultData
                })
            }
        })



        this.setState({
            navheight: document.documentElement.clientHeight - 60,
        })


    }
    customizegpages_list = (tpl_id, id) => {
        let tpl_page_id = this.tpl_page_id
        api.order.customizegpages_list({ tpl_id: tpl_id, tpl_page_id }).then((res) => {
            if (res) {
                this.setState({
                    selecttemplate: res.resultData,

                })
            }
        })
    }

    customizetemplate(id, tpl_id, start) {
        api.order.customizetemplate({ tpl_page_id: id, tpl_id: tpl_id }).then((res) => {
            if (res) {
                this.setState({
                    navdata: res.resultData.sections,
                    changeselect: `${res.resultData.id}-${res.resultData.tpl_id}`,
                    tpl_page_id: res.resultData.id,
                    changename: res.resultData.name_cn,
                    page_type: res.resultData.page_type,
                    page_html: res.resultData.html,
                    is_mobile: res.resultData.is_mobile,
                }, () => {
                    if (!start) {
                        this.iframonload()
                    }
                    this.setState({
                        footer_id: `-${res.resultData.sections.length - 1}`
                    })
                })

                if (res.resultData.sections.length == 0) {
                    this.setState({
                        loading: false
                    })
                }
            }
        })
    }

    /**
     *  控制修改内容
     *
     * @param {*} value
     */
    handleChange(value) {
        const {
            selecttemplate
        } = this.state
        let changename = ''
        let ids = value.split('-')
        let that = this
        confirm({
            content: '确定切换模块，离开后未保存选项将不会保存',
            onOk() {
                for (var i = 0; i < selecttemplate.length; i++) {
                    if (selecttemplate[i].id == ids[0]) {
                        changename = selecttemplate[i].name_cn
                        break;
                    }
                }
                that.setState({
                    changeselect: value,
                    tpl_id: ids[1],
                    tpl_page_id: ids[0],
                    changename,
                    loading: true,
                })
                api.order.customizegsections({ tpl_id: ids[1], tpl_page_id: ids[0] }).then((res) => {
                    if (res) {
                        that.setState({
                            addtemplate: res.resultData
                        })
                    }
                })
                that.customizegpages_list(ids[1], ids[0])
                that.customizetemplate(ids[0], ids[1])
            },
            onCancel() {
            },
        });


    }
    // 提交保存
    save() {
        if (!this.draft_id) {
            message.error('请修改模板在保存')
            return
        }
        let param = {
            tpl_page_id: this.state.tpl_page_id,
            draft_id: this.draft_id,
            tpl_id: this.id
        }
        let that = this
        confirm({
            content: '是否保存该模板',
            onOk() {
                api.order.customizegsave({
                    ...param
                }).then((res) => {
                    if (res) {
                        that.draft_id = ''
                        message.success('保存成功')
                    }
                })
            },
            onCancel() {
            },
        });
    }
    //预览
    preview = () => {
        const {
            previewtext,
            previewshow
        } = this.state
        this.setState({
            previewtext: previewtext == '预览' ? '退出预览' : '预览',
            previewshow: !previewshow
        })

    }


    // 初始化iframehtml
    iframonload = () => {
        let {
            navdata = [],
            page_type,
            page_html = ''
        } = this.state
        let jsArr = '', strhtml = '';

        if (page_type == 'PRODUCT_THEME' || page_type == "INDEX") {
            navdata.map((item, index) => {
                item['index'] = index
                if (item.html) {
                    let str = htmlinit(item.html)
                    if (str[1]) {
                        jsArr += str[1]
                    }
                    strhtml += `<div id="-${index}" class="h-edit-item">${str[0]}</div>`;
                }
            })


        } else {
            if (page_html) {
                if (page_type == 'HEADER') {
                    strhtml = `<div id="-${0}" class="h-edit-item d-h-item ">${page_html}</div>`;
                } else {
                    strhtml = `<div id="-${0}" class="h-edit-item ">${page_html}</div>`;
                }


            }
        }
        if (strhtml) {
            iframeinit.call(this, {
                strhtml,
                jsArr
            })
        }
        setItem('init_data', navdata)
        this.setState({
            navdata,
        })
    }
    // 添加模板内容
    iframeadd = (data) => {
        let {
            navdata = [],
            changeselect,
            tpl_page_id,
        } = this.state
        let init_data = getJson('init_data')
        data['index'] = init_data.length
        // navdata.push(data)
        // init_data.push(data)

        navdata.splice(navdata.length - 1, 0, data)
        init_data.splice(init_data.length - 1, 0, data)
        setItem('init_data', init_data)
        this.customizegupdate({
            operate: 'ADD_SECTION',
            tpl_page_id: tpl_page_id,
            tpl_id: this.id,
            section: data,
            sections: navdata
        })
        this.setState({ navdata, }, () => {
            let id = init_data.length - 1
            let str = htmlinit(data.html)
            let html = data.html
            if (str && str[0]) {
                html = str[0]
            }
            let strhtml = `<div id="-${id}" class="h-edit-item">${html}</div>`;
            iframeinit.call(this, {
                strhtml,
                jsArr: str ? (str[1] || '') : '',
                status: false,
                parent_id: id
            })
        })
    }
    // 更新模板内容 
    iframeedit = (data, index) => {
        let {
            navdata = [],
            changeselect,
            page_type,
            page_html
        } = this.state
        if (page_type == 'PRODUCT_THEME' || page_type == "INDEX") {
            navdata[index] = data
            this.setState(
                { navdata },
                () => {
                })
        } else {
            this.lodingstatus(true)
            setTimeout(() => {
                window.frames["decorate"].loadJs()
                this.lodingstatus(false)
            }, 2000)

        }
    }

    //发布
    Publish = () => {
        // window.frames["decorate"].canvas()
        let that = this
        let id = this.id
        confirm({
            content: '是否发布该模板',
            onOk() {
                api.order.customizepublish({ tpl_id: id }).then((res) => {
                    message.success('发布成功')
                    that.props.goBack();
                })
            },
            onCancel() {
            },
        });
    }
    // 退出
    quit = () => {
        let that = this
        confirm({
            content: '是否退出,未保存修改将会清除',
            onOk() {
                that.props.goBack();
            },
            onCancel() {
            },
        });
    }
    sortEnd = (data) => {
        this.setState(
            { navdata: data },
            () => {
                this.lodingstatus(false)
            })
    }
    toggleWin = (key = 'visible', rowData, index) => {
        let otherConfig = {
            rowData: rowData,
            index: index
        }
        this.setState({
            [key]: !this.state[key],
            otherConfig
        })
    }
    lodingstatus = (val, key = 'loading') => {
        this.setState({
            [key]: val
        })
    }

    customizegupdate = (value, index) => {
        const {
            page_type
        } = this.state
        let indextype = page_type != 'PRODUCT_THEME' && page_type != "INDEX"
        let param = {
            ...value
        }
        if (this.draft_id) {
            param['draft_id'] = this.draft_id
        }
        if (indextype) {
            index = 0
        }
        api.order.customizegupdate({ ...param }).then((res) => {
            if (res) {
                this.draft_id = res.resultData.draft_id
                if (res.resultData.html) {
                    let str = htmlinit(res.resultData.html, indextype)
                    let strhtml = `${str[0]}`;
                    iframeinit.call(this, {
                        id: `-${index}`,
                        strhtml,
                        jsArr: str[1] || '',
                    })
                }
            }
        })
    }

    render() {
        const {
            init_data = [],
            changeselect,
            navdata = [],
            navheight,
            visible,
            addvisible,
            previewtext,
            previewshow,
            addtemplate = [],
            selecttemplate = [],
            changename,
            loading = true,
            tpl_page_id,
            tpl_id,
            page_type,
            settingsdata,
            is_mobile = 0
        } = this.state
        const {
        } = this.props.form;
        const contextProps = {
            settingsdata,
            init_data,
            navdata,
            changeselect,
            toggleWin: this.toggleWin,
            visible,
            addvisible,
            addtemplate,
            iframeadd: this.iframeadd,
            iframeedit: this.iframeedit,
            id: this.id,
            draft_id: this.draft_id,
            customizegupdate: this.customizegupdate,
            ...this.state.otherConfig,
            tpl_page_id,
            tpl_id,
            page_type,
            lodingstatus: this.lodingstatus
        };
        const htmlurl = is_mobile == 0 ? '/Decorate/index.html' : '/Decorate/index-mobile.html'
        return (
            <div className="decorate-main" >
                <div className="header-tool">
                    <p>模板编辑</p>
                    <div>
                        <Button type="primary" onClick={() => this.save()}>保存</Button>
                        <Button type="primary" onClick={() => this.Publish()}>发布</Button>
                        <Button type="primary" type="danger" onClick={()=>this.quit()}>退出</Button>

                    </div>
                </div>
                <a id="iframonload" onClick={() => this.iframonload()}></a>
                <ListContext.Provider value={contextProps}>
                    <div className="decorate-conce"   >

                        <div className="d-c-l-main">
                            <Affix offsetTop={60}>
                                <Spin spinning={loading}>
                                    {
                                        previewshow ?
                                            <div className="d-c-le" style={{ height: navheight }} >
                                                <Nav changename={changename} sortEnd={this.sortEnd} navdata={navdata} ></Nav>
                                            </div>
                                            : ''
                                    }
                                </Spin>
                            </Affix>
                        </div>

                        <div className="d-c-r-main">
                            <div className="nav-main">
                                <span>请选择您要编辑的页面: &nbsp;</span>
                                <Select value={changeselect}
                                    onChange={(e) => this.handleChange(e)} style={{ width: '100px', marginRight: '10px' }}>
                                    {
                                        selecttemplate.map((item) => {
                                            return <Option value={`${item.id}-${item.tpl_id}`}>{item.name_cn}</Option>
                                        })
                                    }
                                </Select>


                            </div>
                            <div className="d-c-ri" id="iframe">
                                <Spin spinning={loading} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {
                                        navdata.length > 0 ? <iframe name="decorate" src={htmlurl} style={{ width: is_mobile == 0 ? 'null' : '375px' }}></iframe> : ''
                                    }
                                </Spin>
                            </div>
                        </div>
                    </div>
                </ListContext.Provider>

            </div>

        )
    }
}

export default Form.create()(Decorate)