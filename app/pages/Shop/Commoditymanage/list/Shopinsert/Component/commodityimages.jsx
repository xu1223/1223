import React, { Component } from "react";
import { ListContext } from "@/config/context";
import { Card, Icon, Upload, message, Checkbox } from "antd";
import { FormFieldsMesg } from "../Config/FormFields";
import { WinMessage } from "@/components/Confirm/index.js";
import { stringify } from "qs";
import { post } from "fetch/request";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import api from "fetch/api";
import Base from "util/base.js";
import "./setarrt.less";
// import Sortable from 'react-anything-sortable';
// import SortableItem from './SubPage/sortableItem';
import ImgModal from '../../../../../../components/ImgModal/index'
import dropIcon from '@/static/img/drop-icon.png';
import { shopAddImgAsync, shopdeleImgAsync } from '@/reduxsaga/saga/shopinfo';
/**
 * 商品图片
 */

class Commodityimages extends Component {
  static propTypes = {
    shopAddImgAsync: PropTypes.func,
    shopdeleImgAsync: PropTypes.func
  }
  static contextType = ListContext; //设置 上下文
  constructor(props, context) {
    super(props, context);

    this.state = {
      uploadLocalLoading: false,
      imgsAll: props.shopinfo.imagsAll || [],
      imgUpload: [], //上传图片获取的数据
      showImgMol: false,
      imgCurIndex: 0,
      imgArr: [], //最终返回的数据
    };
  }
  componentDidMount() {
    this.setState({
      imgsAll: this.props.shopinfo.imagesArr || []
    })
  }
  // 拖拽获取起始位置
  dragStart = (e, index) => {
    let tar = e.target;
    e.dataTransfer.setData("Text", index, tar.tagName);
    if (tar.tagName.toLowerCase() == "div") {

      console.log(tar.tagName);
    }
  };
  // 获取结束位置
  dragDrop = (e, index) => {
    e.preventDefault();
    let { imagsAll } = this.props.shopinfo;
    let arr = imagsAll.concat([]),
      dragIndex = e.dataTransfer.getData("Text");
    let temp = arr.splice(dragIndex, 1);
    arr.splice(index, 0, temp[0]);
    arr.forEach((v, index) => {
      if (v.base_img) {
        delete v['id']
        delete v['product_id']
      }
      v['store_id'] = index
    });
    this.props.shopdeleImgAsync(arr)
  };
  // 修改值
  deWeight = (arr) => {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].image == arr[j].image) {
          arr.splice(j, 1);
          //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
          j--;
        }
      }
    }
    return arr;
  }

  // 上传成功数据
  imagesFncall = () => {
    const { imgUpload, imgsAll } = this.state;
    let { imagsAll } = this.props.shopinfo;
    let _parms = [...imagsAll, ...imgsAll];
    this.props.shopdeleImgAsync(_parms)
  };
  // 删除图片
  imgDel = (_index, parms) => {
    let { imagesArr } = this.context;
    let { imgUpload, imgsAll } = this.state;
    let _parms = [...imgUpload, ...imgsAll];
    let { imagsAll } = this.props.shopinfo;
    imagsAll.splice(_index, 1);
    this.props.shopdeleImgAsync(imagsAll)
  }

  // 上传图片
  fileImgeFn = async (fileObj) => {
    this.setLoading(true);
    var formdata = new FormData();
    const { _category_id, _sku } = this.context;
    let file = fileObj.file;
    formdata.append("file", fileObj.file, fileObj.file.name);
    formdata.append("token", localStorage.getItem("USER_TOKEN"));
    formdata.append("access_token", localStorage.getItem("ACCESS_TOKEN"));
    formdata.append("sku", _sku);
    formdata.append("category_id", _category_id);
    const params = {
      token: localStorage.getItem("USER_TOKEN"),
      access_token: localStorage.getItem("ACCESS_TOKEN"),
      sku: _sku,
      category_id: _category_id,
    };
    let ret = await fetch(
      process.env['APP_HOST_URL_API_ADMIN'] + "/api/admin/product_image_upload",
      {
        method: "POST",
        redirect: "follow",
        body: formdata,
      }
    );
    let res = await ret.json();
    if (res.resultId == 200) {
      WinMessage({
        type: "success",
        content: "上传成功",
      });
      let _this = this;
      var reader = new FileReader();
      reader.onload = (function (file) {
        return function (ev) {

          _this.setState({
            imgsAll: [
              ..._this.state.imgsAll,
              {
                image: res.resultData,
                base_img: ev.target.result,
              },
            ],
          });
          _this.imagesFncall();
        };
      })(file);
      reader.readAsDataURL(file);
    }
  }
  //本地上传 属性
  fileProps = {
    name: "file",
    showUploadList: false,
    accept: ".jpg,.jpeg,.png",
    multiple: true,
    customRequest: (fileObj => {
      this.setState({
        imgsAll: []
      })
      this.fileImgeFn(fileObj)
    })

  };
  // 上传图片loading
  setLoading = (uploadLocalLoading) => {
    this.setState({
      uploadLocalLoading,
    });
  };
  // 切换
  isCategoryId = () => {
    const { isSku, isCategoryIds } = this.context;
    if (!isCategoryIds) {
      message.warning(FormFieldsMesg["category_ids"]);
      this.context.getCcategoryOptionValuefn(false);
      return false;
    } else if (!isSku) {
      message.warning(FormFieldsMesg["sku"]);
      this.context.isSkufn(false);
      return false;
    }
    if (isSku) {
      this.context.isSkufn(true);
    }
  };
  imgShow = (e, item, index) => {
    e.preventDefault();
    this.setState({
      showImgMol: true,
      imgCurIndex: index,
    })
  }
  closeImgModal() {
    this.setState({
      showImgMol: false,
    })
  }
  render() {

    const { isSku, isCategoryIds, imagesArr } = this.context;
    let { imgsAll, showImgMol, imgCurIndex } = this.state;
    // imgsAll = this.props.shopinfo.imagesArr

    // console.log(this.props.shopinfo.imagsAll, 'this.props.shopinfo', imgsAll, 'imgsAll')
    const dataArr = imgsAll.map(item => item.img_m || item.image ? item.img_m || item.image : item);
    const { imagsAll = [] } = this.props.shopinfo;
    console.log(imagsAll, 'imagsAllimagsAllimagsAllimagsAll')
    return (
      <div className="content-main-card">
        <Card
          className="dercription"
          title={
            <span>
              <Icon type="file-text" theme="filled" /> 商品图片
            </span>
          }
        >

          <div className="action-bar">
            <div className="shops-imgs-cont clearfix">
              <div className="shops-imgsall">
                <div className="ul">
                  {imagsAll.map((v, index) => {
                    return (
                      <div
                        className="t-imgcenter li"
                        key={index}
                        draggable="true"
                        onDragOver={(e) => e.preventDefault()}
                        onDragStart={(e) => this.dragStart(e, index)}
                        onDrop={(e) => this.dragDrop(e, index, v)}
                        data-id={v.id || index}
                      >
                        <Icon className="iconfont shop_ziyuan17 icon-del" type="close-circle" onClick={() => this.imgDel(index, v)} />
                        {index === 0 ? (
                          <div class="tag-main">
                            <span>主图</span>
                          </div>
                        ) : (
                            ""
                          )}
                        {index === 1 ? (
                          <div class="tag-main">
                            <span>翻转</span>
                          </div>
                        ) : (
                            ""
                          )}
                        <img src={v.base_img || v.img_m || v.image} onClick={(e) => this.imgShow(e, v, index)} />
                        <div class="img-drop-item" style={{ background: `url(${dropIcon})  50% no-repeat #108ee9` }}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="shops-imgs-cont-btns">
                <div
                  style={{ display: isSku && isCategoryIds ? "block" : "none" }}
                >
                  <Upload className="upload-shopimgall" {...this.fileProps}>
                    <a href="javascript:void(0)" className="shops-imgs-a">
                      本地图片
                    </a>
                  </Upload>
                </div>
                <a
                  href="javascript:void(0)"
                  onClick={() => this.isCategoryId()}
                  className="shops-imgs-a"
                  style={{
                    display: !isSku || !isCategoryIds ? "block" : "none",
                  }}
                >
                  本地图片
                </a>
                <div className="shops-imgs-msg">
                  <i className="iconfont shop_ziyuan23 remove"></i>
                  <span className="remove shops-imgs-text">
                    注:第一张图片为主图，支持拖动排序。像素至少为800*800的图片。配有多张高质量图片的产品往往销售情况最好
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        {/* {
          showImgMol ?
            <ImgModal
              visible={showImgMol}
              imgList={dataArr}
              curIndex={imgCurIndex}
              closePop={this.closeImgModal.bind(this)}
            /> : ''
        } */}
      </div>
    );
  }
}
export default connect((state) => {
  return state.Shops
}, { shopdeleImgAsync, shopAddImgAsync })(Commodityimages)