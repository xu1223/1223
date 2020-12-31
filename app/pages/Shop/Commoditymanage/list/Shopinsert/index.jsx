import React, { Component } from "react";
import { ListContext } from "@/config/context";
import { TabsConfig } from "./Config";
import Basicdata from "./Component/basicdata";
import Commodityattribute from "./Component/commodityattribute";
import Commodityimages from "./Component/commodityimages";
import Seosettings from "./Component/seosettings";
import Asyncsku from "./Component/asyncsku";
import Wholesaleset from "./Component/wholesaleset";
import Merchandiseassociated from "./Component/merchandiseassociated";
import Addthegoods from "./Component/addthegoods/index";
import Setattrconfirm from "./Component/Setattrconfirm";
import moment from "moment";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchComp2 from '@/components/SearchComp2';
import { shopAddImgAsync, shopdeleImgAsync } from '@/reduxsaga/saga/shopinfo';
import {
  WinMessage,
  WinObjeArr,
  WinArrSlice,
  WinArrVal,
  WinParmsObj,
} from "@/components/Confirm/index.js";
import { post } from "fetch/request";
import api from "fetch/api";
import { Icon, Button, Form, Skeleton, Tabs, message } from "antd";
import {
  FormFields,
  FormFieldsName,
  FormFieldsMesg,
  FormFieldsAttrName,
  FormFieldsArrName,
  FormFieldsSettingsName,
  _ComAttrSpecKey,
} from "./Config/FormFields";
import "./index.less";
const TabPane = Tabs.TabPane;
class Shopinsert extends Component {
  static propTypes = {
    shopAddImgAsync: PropTypes.func,
    shopdeleImgAsync: PropTypes.func
  }
  constructor(props, context) {
    super(props, context);

    this.state = {
      visibleAddress: false,
      activeKey: props.activeKey || TabsConfig[0].status,
      _parms: {}, //编辑得到的数据
      id: "",
      reviewStatus: "",
      issize: '',
      statusList: [],
      QcInfoDate: [],
      visibleQuality: false,
      editId: "",
      activeCode: "",
      visible: false,
      reviewStatusCode: "0",
      tortData: [],
      contendData: [],
      pretrial: false,
      loading: true,
      saveDisable: false,
      visibleSkuSetting: false,
      visibleAddShops: false, //添加商品弹窗
      setAttrdata: [

      ], //设置属性数据
      dommodityAttribute: [], //商品属性
      issetAttributes: false, //设置属性弹窗
      wholesaledata: [], //批发设置数据
      crossSellProducts: [], //商品关联数据
      categroyList: [], //分类数据
      addShopdataSource: [], //添加商品分类数据
      formFields: FormFields, //表单数据
      formFieldsName: FormFieldsName, //表单数据字段
      getTreeCategorySimple: [], //商品分类树形简单结构
      getCategorySearchData: [], //商品标签数据
      getCustomersGroupPager: [], //批量设置会员等级数据
      imagesArr: [], //上传图片
      isSku: false, //为空
      isCategoryIds: false, //为空
      _category_id: "",
      _sku: "",
      product_option_value: '', //尺码表格
      sizeChart: [],
      rowData: [],
      sizeChartTable: [],
      isEditPager: '',
      isEditPagerEdit: '',
      newRelatesPro: {},
      shoptype: false
    };
    this.issize = {}
  }
  componentDidMount() {
    post(api.get_search_list).then(res => {
      this.setState({
        getCategorySearchData: res.resultData
      })
    })
    post(api.get_products_pager)
      .then((res) => {
        res.resultData.forEach((v) => {
          v["key"] = v.id;
        });
        this.setState({
          addShopdataSource: [...res.resultData],
        });
      })
      .catch((e) => {
        console.log(e);
      });

    post(api.get_tree_category_simple).then((res) => {
      let { code, data } = res;
      this.setState({
        getTreeCategorySimple: res.resultData,
      });
    });
    /**
     * 会员等级接口
     */
    post(api.get_customers_group_pager).then((res) => {
      const { code, data } = res;
      this.setState({
        getCustomersGroupPager: res.resultData,
      });
    });
    this.getProductInfo();
  }
  /**
   * 编辑是请求数据
   */
  getProductInfo = () => {
    this.props.shopdeleImgAsync([])     //清除图片数据
    if (this.props.params) {
      let { id } = this.props.params;  //获取id
      if (id != 0) {
        this.setState({
          id: parseInt(id),
          editId: parseInt(id),
          shoptype: true
        });

        post(api.get_product, { product_id: id }).then((res) => {
          if (res) {
            const { resultData: data } = res
            const newRelatesPro = res.resultData;
            if (data.categories) {
              this.setState({
                isSku: true,
                isCategoryIds: true,
                _category_id: data.categories.child_category_id,
                _sku: data.sku,
                newRelatesPro
              });
            }
            //处理属性数据
            if (data.product_option_values) {
              let _parmsSize = {
                name: 'Size',
                option_id: '1',
                option_value_list: []
              };
              let _parmsColor = {
                name: 'Color',
                option_id: '1',
                option_value_list: []
              };
              let imagAttArr = [];
              if (data.product_option_values.Size) {
                _parmsSize = {
                  name: 'Size',
                  option_value_list: data.product_option_values.Size
                }
              }
              if (data.product_option_values.Color) {
                _parmsColor = {
                  name: 'Color',
                  option_value_list: data.product_option_values.Color
                }
              }
              imagAttArr.push(_parmsSize, _parmsColor)   //不可修改位置 在编辑属性值时要求size为前

              this.setState({
                setAttrdata: imagAttArr,
              });
            }
            // data.product_option_value
            let _product_option_value = data.product_option_values
              ? data.product_option_values
                ? data.product_option_values.Size
                : []
              : [];
            this.props.shopAddImgAsync(data.images)  //处理图片数据   
            this.setState({
              _parms: data,
              imagesArr: data.images,
              dommodityAttribute: _product_option_value,
              sizeChart: data.size_chart || [],
              sizeChartTable: data.size_chart || [],
              crossSellProducts: data.relates || [],
              size_stage: data.id ? true : false
            });
            if (data.wholesale_settings) {
              let _wholesale_settings = [];
              if (this.state.getCustomersGroupPager) {
                data.wholesale_settings.forEach((v) => {
                  v[
                    "get_customers_group_list"
                  ] = this.state.getCustomersGroupPager;
                  _wholesale_settings.push(v);
                });
                this.setState({
                  wholesaledata: _wholesale_settings,
                });
              }
            }
            setTimeout(() => {
              this.setState({
                loading: false,
              });
            }, 300);
          }
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    }
  }
  /**
   * tab切换
   */
  changeTab = (activeKey) => {
    this.setState({
      activeKey: activeKey,
    });
  };
  onChange = () => {
  };
  // 共享 tool 和index
  toggleWin = (key = "visible", otherConfig) => {
    this.setState({
      [key]: !this.state[key],
      otherConfig,
    });
  };
  // 处理关联商品数据
  setSelectRows = (value, val) => {
    let isdata = []
    isdata = [...this.state.crossSellProducts, ...value]
    function unique(isdata) {
      return Array.from(new Set(isdata))
    }
    this.setState({
      crossSellProducts: unique(isdata),
    });
  }
  /**
   * 选择商品分类获取id请求属性值接口 搜索标签接口
   */
  getCcategoryOptionValuefn = (val) => {
    this.setState({
      getCategorySearchData: [],
      _category_id: val,
    });
    const parms = {
      category_id: val,
      product_id: val,
      class: 1,
    };
    if (val) {
      this.setState({
        isCategoryIds: true,
      });
    } else {
      this.setState({
        activeKey: "1",
      });
    }

    //分类-搜索标签
    post(api.get_search_list).then(res => {
      console.log(res)
      this.setState({
        getCategorySearchData: res.resultData
      })
    })

  };
  // 尺码信息渲染
  sizeChartBind = (row) => {
    this.setState({
      sizeChart: row,
      sizeChartTable: row
    })
  }
  //分类-属性/属性值

  /**
   * 批发设置数据
   * 新增会掉方法用于删除
   */
  wholesaleDelfn = (item, index) => {
    const { wholesaledata } = this.state;
    wholesaledata.splice(index, 1);
    this.setState({
      wholesaledata,
    });
  };
  /**
   * 添加商品分类数据
   */
  // visibleAddShops = (items) => {
  //   this.setState({
  //     crossSellProducts: [...this.state.crossSellProducts, ...items],
  //   });
  // };
  /**
   * 属性数据处理
   * 获取表单数据
   */
  attrIbutedataProcessing(_getFieldsValue) {
    const {
      dommodityAttribute,
      setAttrdata,
      editId,
    } = this.state;
    //一个对象中获取带有属性 attr_下标的数据 转换魏数组
    console.log(dommodityAttribute,'dommodityAttributedommodityAttributedommodityAttribute')
    if(!dommodityAttribute){
      message.error('请设置商品属性')
      return
    }
    let arr = WinObjeArr(
      dommodityAttribute.length,
      FormFieldsAttrName,
      _getFieldsValue
    );
    //把旧的数组[{attr_id_0:1}] 转换魏新数组  [{id:1}]  
    let arr_arr = WinArrSlice(
      dommodityAttribute.length,
      arr,
      FormFieldsAttrName
    );


    const istest = JSON.parse(JSON.stringify(arr_arr))
    let _a = WinArrVal(dommodityAttribute, istest, FormFieldsArrName);
    if (arr.length == 0) {
      WinMessage({
        type: "warning",
        content: "选择属性",
      });
      this.setState({
        activeKey: "2",
      });
      return;
    }
    if (arr_arr.length != 0) {
      let setAttArr = JSON.parse(JSON.stringify(setAttrdata));
      let _parms = {}, //重新组一个对象
        _parmsArr = []; //重新组的一个对象存入
      let imagWarr = []; // 获取属性表格数据

      for (var n = 0; n < arr_arr.length; n++) {
        if (arr_arr[n].id == "") {
          arr_arr[n]["id"] = 0
        }
        arr_arr[n]["name"] = _a[n]["name"];
        arr_arr[n]["status"] = arr[n]["attr_status_" + n] == false ? 0 : 1;
        if (arr_arr[n]["type_name"]) {
          delete arr_arr[n]["type_name"];
        }
        arr_arr[n]['option_name'] = 'Size'
        delete arr_arr[n]['name'];
        delete arr_arr[n]["option_value_id"];
        delete arr_arr[n]["option_id"];
        imagWarr.push(arr_arr[n]);
      }
      let color_name = ''
      //循环设置的属性 获取 值进行判断 
      setAttArr.forEach((v) => {
        v.option_name = v.name
        delete v.name;
        if (!color_name) {
          color_name = imagWarr[0]['color']
        }
        delete v["option_id"];
        v["class"] = 1
        v["type"] = 'select'
        v['required'] = 1
        if (v.option_name === "Size") {
          v["product_option_value"] = imagWarr;
          if (v.option_value_list) {
            delete v.option_value_list;
          }
          delete v.type_name;
          _parms = { ...v };
        } else if (v.option_name === "Color") {


          let colordata = imagWarr[0]
          console.log(imagWarr[0], 'imagWarr[0]=imagWarr[0]')
          colordata = JSON.parse(JSON.stringify(colordata))
          colordata['option_name'] = 'Color'
          colordata['option_value_name'] = color_name
          colordata['zsku'] = ''
          if (setAttrdata[1]) {
            if (!setAttrdata[1].option_value_list[0]) {
              message.error('请选择属性颜色')
              return false
            }
            colordata['id'] = setAttrdata[1].option_value_list[0].id || 0
          }
          v["product_option_value"] = []
          v["product_option_value"].push(colordata)

          if (v.option_value_list) {
            delete v.option_value_list;
          }
          delete v.type_name;
          _parms = { ...v };
        }
        imagWarr.map(item => {
          delete item['color'];
        })

        //把获取的新对象 存入数组中
        _parmsArr.push(_parms);
      });
      //返回数据
      return _parmsArr;
    }
  }
  /**
   * 批发设置数据处理
   */
  wholesaleSetupDataProcessing = (_getFieldsValue) => {

    const {
      wholesaledata
    } = this.state;
    if (wholesaledata.length) {
      let _wholeArr = WinObjeArr(
        wholesaledata.length,
        FormFieldsSettingsName,
        _getFieldsValue
      );
      let _wholeArr_arr = WinArrSlice(
        wholesaledata.length,
        _wholeArr,
        FormFieldsSettingsName
      );
      if (_wholeArr_arr.length != 0) {
        // let startTime = moment(value).format("YYYY-MM-DD");
        let _newWholeArr = [];
        _wholeArr_arr.forEach((v) => {
          v["date_start"] = moment(v["date_start"]).format("YYYY-MM-DD");
          v["date_end"] = moment(v["date_end"]).format("YYYY-MM-DD");
          _newWholeArr.push(v);
        });
        return _newWholeArr
      }
    }
  }
  /**
   * 获取需要表单的数据
   */
  formFieldsDispose = (values) => {
    const {
      id
    } = this.state;
    FormFields["id"] = id ? id : "";
    if (!FormFields["id"]) {
      delete FormFields["id"];
    };
    for (let key in values) {
      FormFields[key] = values[key];
      if (values.tags) {
        FormFields["tag_ids"] = values["tags"].toString();
        delete FormFields["tags"];
      }
    }
    return FormFields;
  }
  /**
   * 判断sku和 分类是否选择
   */
  decideEmpty = (_sku, _category_id) => {
    if (_category_id === "") {
      WinMessage({
        type: "warning",
        content: "选择商品分类",
      });
      this.setState({
        activeKey: "1",
      });
      return false;
    } else if (_sku === "") {
      WinMessage({
        type: "warning",
        content: "SKU不能为空",
      });
      this.setState({
        activeKey: "1",
      });
      return false;
    }
    return true;
  }
  /**
   * 处理 商品特性
   */
  productIdDispose = (_formfiel) => {
    let _keyObj = {
      is_out: 'is_out',
      is_hot: 'is_hot',
      is_launch: 'is_launch',
      is_publish: 'is_publish',
      is_special: 'is_special',
      is_new: 'is_new',
      is_big: 'is_big',
      minimum: 'minimum'
    };
    for (var key in _keyObj) {
      if (_formfiel[_keyObj[key]] == '' || _formfiel[_keyObj[key]] == false) {
        _formfiel[_keyObj[key]] = 0;
      } else {
        _formfiel[_keyObj[key]] = 1;
      }
    }
    return _formfiel;
  }
  /**
   * 保存
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      _sku,
      _category_id,
      sizeChart
    } = this.state;
    const { imagsAll } = this.props.shopinfo;
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('请填写必要数据')
        return false
      }
      if (!sizeChart) {
        message.error('请填写尺码信息')
        return false
      }
      //判断sku和分类是否为空
      if (!this.decideEmpty(_sku, _category_id)) {
        message.error('请填写sku和分类')
        return false;
      };


      //获取表单数据
      let _getFieldsValue = this.props.form.getFieldsValue();
      //商品属性
      let _attrIbutedataProcessing = this.attrIbutedataProcessing(_getFieldsValue);
      if (!_attrIbutedataProcessing) return;
      values["product_option"] = _attrIbutedataProcessing ? JSON.stringify(_attrIbutedataProcessing) : [];
      if (imagsAll) {
        values["images"] = imagsAll
      }
      // FormFields
      if (this.state.crossSellProducts) {
        //	string	否	关联商品,多个以逗号分隔
        values["related_id"] = this.state.crossSellProducts
          .map((v) => v.id)
          .join(",");
      };
      if (sizeChart) {
        values['size_chart'] = JSON.stringify(sizeChart);
      }
      // this.productIdDispose(values);
      //处理 商品特性 false true的问题
      this.productIdDispose(values);
      //批发设置数据
      let _wholesaleSetupDataProcessing = this.wholesaleSetupDataProcessing(_getFieldsValue);
      values["wholesale_settings"] = _wholesaleSetupDataProcessing ? JSON.stringify(_wholesaleSetupDataProcessing) : [];
      values["description"] = UE.getEditor("wapcontainer1")
        ? UE.getEditor("wapcontainer1").getContent()
        : "";
      //处理需要的表单数据
      let _formFieldsDispose = this.formFieldsDispose(values);
      let _formfiel = WinParmsObj(FormFieldsName, _formFieldsDispose);



      let images = []
      if (values.images) {
        values.images.map(item => {
          images.push({
            id: 0,
            image: item.image
          })
        })
      }
      let param = {
        name: values.name,
        sku: values.sku,
        model: values.model || values.spu,
        price: values.price,
        show_price: values.show_price,
        material: values.material,
        weight: values.weight,
        minimum: values.minimum,
        url: values.url,
        sort_order: values.sort_order,
        description: values.description,
        meta_title: values.meta_title,
        meta_keyword: values.meta_keyword,
        meta_description: values.meta_description,
        category_ids: values.category_ids,
        size_chart: values.size_chart,
        product_option: values.product_option,
        related_id: values.related_id,
        images: JSON.stringify(images),
        tag_ids: values.tag_ids.toString(),
        wholesale_settings: values.wholesale_settings,
      }
      param['id'] = this.state._parms.id ? this.state._parms.id : ''

      // if(!this.isValidateForm(_formfiel)){
      //   return;
      // }
      //有id新增 无id编辑
      if (!err) {
        post(api.save_product_basic, { ...param }, true).then((res) => {
          if (res.resultId == 200) {
            this.props.goBack();
            message.success(res.resultMsg);

          } else {
            message.warning(res.resultMsg);

          }
        });
      }
    });
  };
  // 回退到列表
  shopclose(type) {
    this.props.goBack();
  }
  /**
   * 验证表单那些字段不能为空
   */
  isValidateForm = (FormFields) => {
    let { name, category_ids, sku, spu } = FormFields;
    if (spu === "") {
      message.warning(FormFieldsMesg["sku"]);
      this.setState({
        activeKey: "1",
      });
      return false;
    } else if (sku == "") {
      message.warning(FormFieldsMesg["model"]);
      this.setState({
        activeKey: "1",
      });
      return false;
    } else if (name === "") {
      message.warning(FormFieldsMesg["name"]);
      this.setState({
        activeKey: "1",
      });
      return false;
    } else if (category_ids === "") {
      message.warning(FormFieldsMesg["category_ids"]);
      this.setState({
        activeKey: "1",
      });
      return false;
    }
    // return false;
  };
  // 修改state值渲染数据
  isSkufn = (val) => {
    if (!val) {
      this.setState({
        activeKey: "1",
        isSku: false,
      });
    } else {
      this.setState({
        isSku: true,
      });
    }
  };
  // 修改sku值
  isSkuVal = (val) => {
    this.setState({
      _sku: val,
    });
  };
  // 新增商品回调
  wholesaledatacall = (parms) => {
    this.setState({
      wholesaledata: [...this.state.wholesaledata, { ...parms }],
    });
  };
  // 设置属性回调
  issetAttributescall = (arr, color) => {
    let newArr = [],
      parms = {},
      parmsArr = [],
      arradata = [],
      state = true;
    let colorname = ''

    colorname = arr[1].option_value_list[0].option_value_name
    let newcolorname = arr[1].option_value_list[0].option_value_name
    if (colorname == newcolorname) {
      state = false
    } else {
      state = true
    }
    arr.forEach((v, index) => {
      if (v.name == "Color") {
      }
      if (v.name === "Size") {
        if (v.option_value_list) {
          v.option_value_list.forEach((n, index) => {
            let zsku_name = this.state._sku + '-' + n.option_value_name
            if (state) {
              n["option_value_id"] = n["id"];
              newArr.push({
                ...n,
                quantity: "",
                price: "",
                show_price: "",
                weight: "",
                zsku: zsku_name,
                status: true,
                sort_order: "",
                key: index,
              });
            } else {
              let sizedata = ''
              if (this.state.setAttrdata[0]) {
                sizedata = this.state.setAttrdata[0].option_value_list
              } else {
                sizedata = arr[0].option_value_list
              }
              let istest = {}
              sizedata.forEach((item, index) => {
                if (item.option_value_name == n.option_value_name) {
                  istest = item
                  return
                }
              })
              n["option_value_id"] = n["id"];
              newArr.push({
                ...n,
                quantity: istest.quantity || '',
                price: istest.price || '',
                show_price: istest.show_price || '',
                weight: istest.weight || '',
                zsku: istest.zsku || zsku_name,
                status: istest.status == 1 ? true : false,
                sort_order: istest.sort_order || '',
                key: index,
              });
            }

          });
        }
      }
      parmsArr.push(parms);
    });
    this.setState({
      dommodityAttribute: newArr,
      setAttrdata: arr,
    });
  };
  commodityimagesfn = (arr, index) => {
    let _arr = arr.filter(v => !v.base_img)
    if (index) {
      _arr.splice(index, 1)
    }
    this.setState({
      imagesArr: _arr,
    });
    let { imagsAll } = this.props.shopinfo
    if (index) {
      this.props.shopdeleImgAsync(_arr)
      imagsAll.splice(index, 1);
    } else {
      this.props.shopAddImgAsync(_arr)
    }

    this.setState({
      imagesArr: _arr
    });
    console.log(this.state.imagesArr, index, 'arr,index');
  };

  render() {
    let { loading, activeKey } = this.state;
    loading = false
    const { form, params } = this.props;
    const contextProps = {
      toggleWin: this.toggleWin,
      shoptype: this.state.shoptype, //判断是否为编辑
      visibleAddress: this.state.visibleAddress, //同步sku弹窗
      dommodityAttribute: this.state.dommodityAttribute, //商品属性
      dommodityAttributefn: this.dommodityAttributefn, //同步sku商品属性回调
      setAttrdata: this.state.setAttrdata, //设置商品属性数据
      issetAttributes: this.state.issetAttributes, //设置属性弹框
      issetAttributescall: this.issetAttributescall, //设置属性回调
      wholesaledata: this.state.wholesaledata, //批发设置数据
      crossSellProducts: this.state.crossSellProducts, //商品关联
      visibleAddShops: this.state.visibleAddShops, //添加商品弹窗
      addShopsfn: this.visibleAddShops, //添加商品分类 回调
      _parms: this.state._parms, //编辑回显的数据
      wholesaleDel: this.wholesaleDelfn,
      getCcategoryOptionValuefn: this.getCcategoryOptionValuefn, //选择商品分类 获取属性接口
      _category_id: this.state._category_id, //sku 子分类
      _sku: this.state._sku, //sku 子分类
      wholesaledatacall: this.wholesaledatacall, //新增商品点击修改回调
      categroyList: this.state.categroyList, //商品分类数据
      commodityimagescall: this.commodityimagesfn, //图片上传 回调
      formFields: this.state.formFields, //表单数据
      formFieldsName: this.state.formFieldsName, //表单数据字段
      getTreeCategorySimple: this.state.getTreeCategorySimple, //商品分类树形简单结构
      getCategorySearchData: this.state.getCategorySearchData, //商品标签数据
      getCustomersGroupPager: this.state.getCustomersGroupPager, //设置批量会员等级数据
      isSku: this.state.isSku, //为空
      isCategoryIds: this.state.isCategoryIds, //为空
      isSkufn: this.isSkufn,
      isSkuVal: this.isSkuVal,
      imagesArr: this.state.imagesArr,
    };
    // const onFinish = (values) => {
    // };
    const _sizeChartBind = this.sizeChartBind
    return (
      <div className="productEditWrap restTabStyle tabSwitching">
        <div className="header-tool">
          <p>商品详情</p>

        </div>
        {
          TabsConfig ? <Tabs
            type="card"
            activeKey={this.state.activeKey}
            onChange={(e) => this.changeTab(e)}
          >
            {
              TabsConfig.map((item) =>
                <TabPane tab={<span>{item.name}</span>} key={item.id}></TabPane>)
            }
          </Tabs> : ''
        }

        <ListContext.Provider value={contextProps}>
          <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
            <Form
              onFinish={this.shopclose}
              onSubmit={this.handleSubmit}
              style={{ marginBottom: "160px" }}
            >
              <div style={{ display: activeKey == 1 ? "block" : "none" }}>
                <Basicdata rowData={this.state._parms} type={params.type} form={form} sizeChartBind={_sizeChartBind}
                  sizeChartTable={this.state.sizeChartTable} size_stage={this.state.size_stage} />
                {/* 基本信息 */}
              </div>
              <div style={{ display: activeKey == 2 ? "block" : "none" }}>
                <Commodityattribute form={form} />
                {/* 商品属性 */}
              </div>
              <div style={{ display: activeKey == 3 ? "block" : "none" }}>
                <Commodityimages form={form} />
                {/* 商品图片 */}
              </div>
              <div style={{ display: activeKey == 4 ? "block" : "none" }}>
                <Seosettings form={form} />
                {/* SEO设置 */}
              </div>
              <div style={{ display: activeKey == 5 ? "block" : "none" }}>
                <Merchandiseassociated form={form} />
                {/* 商品关联 */}
              </div>
              <div style={{ display: activeKey == 6 ? "block" : "none" }}>
                <Wholesaleset form={form} />
                {/* 批发设置 */}
              </div>
              <div className="shop-footer-btn">
                <div>
                  <Button type="primary" htmlType="submit" className="saveForm">
                    保存
                  </Button>

                  <Button htmlType="button" onClick={() => this.shopclose()} className="close">
                    关闭
                  </Button>
                </div>
              </div>
            </Form>

            {this.state.visibleAddShops && <Addthegoods visibleAddShops={this.state.visibleAddShops} setSelectRowsadd={this.setSelectRows} toggleWin={this.toggleWin} />}
            {this.state.issetAttributes && <Setattrconfirm />}
          </Skeleton>
        </ListContext.Provider>

        {/* </Affix> */}
      </div>
    );
  }
}
export default Form.create()(connect((state) => {
  return state.Shops
}, { shopAddImgAsync, shopdeleImgAsync })(Shopinsert));



