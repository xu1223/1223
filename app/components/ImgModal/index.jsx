import React from 'react'
import {
	is,
	fromJS
} from 'immutable';

import {
	Modal,
	Icon,
	Checkbox,
	Row,
	Col
} from 'antd';
import Base from '../../util/base.js'
const confirm = Modal.confirm;
class ImaModal extends React.Component {
	static defaultProps = {
		imgList: [],
		curIndex: 0,
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			curNum: 'isEmpty'
		}
	}

	componentDidMount() {}

	changeShow(type) {
		let {
			imgList,
			curIndex
		} = this.props, 
		{
			curNum
		} = this.state,
			_curIndex = curNum == 'isEmpty' ? curIndex : curNum;
		if (type == 'prev') {
			if (_curIndex == 0) {
				return;
			} else {
				_curIndex--;
			}
		} else {
			if (_curIndex == imgList.length - 1) {
				return;
			} else {
				_curIndex++;
			}
		}
		this.setState({
			curNum: _curIndex
		})
	}

	closePop() {
		this.props.closePop();
	}

	//控制图片大小的方法
	resizeImg(img, maxWidth, maxHeight) {
		var w = img.width,
			h = img.height;

		// 当图片比预览区域小时不做任何改变
		if (w < maxWidth && h < maxHeight) return;

		// 当实际图片比例大于预览区域宽高比例时
		// 缩放图片宽度，反之缩放图片宽度
		w / h > maxWidth / maxHeight ? img.width = maxWidth : img.height = maxHeight;
	}

	render() {
		const {
			visible,
			imgList,
			curIndex,
			domain,
			isShow,
			curImgType
		} = this.props;
		const {
			curNum
		} = this.state;
		let _imgList = curImgType != undefined ? [] : imgList;
		if(curImgType != undefined){
			_imgList = imgList[curImgType].map(item => { //兼容php下划线命名
				if(!item.imageUrl){
					item.imageUrl = item.image_url
				}
				return item
			})
		}
		const _curIndex = curNum == 'isEmpty' ? curIndex : curNum;
		let height = document.documentElement.clientHeight; //可见区域高度
		let width = document.documentElement.clientWidth; //可见区域宽度
		let height1 = document.body.clientHeight; //BODY对象高度
		let autoHeight = height - 140;
		let autoWidth = width - 640;
		const bodyStyle = {
			height: autoHeight,
		};

		let autoHeight1 = autoHeight - 150;
		return (
			<Modal 
			visible = {visible}
			// bodyStyle={bodyStyle}
			width={autoWidth}
			footer = {null}
			onCancel = {this.closePop.bind(this)} 
			>
				<div className="img-show-mol" >
					{
						_imgList.length>1?
						<Icon type="left" className={_curIndex > 0?"t-btn l-btn":"t-btn l-btn t-btn-disable"} onClick={this.changeShow.bind(this,'prev')} />:''
					}
					{
						_imgList.length>1?
						<Icon type="right" className={_curIndex < _imgList.length-1?"t-btn r-btn":"t-btn r-btn t-btn-disable"} onClick={this.changeShow.bind(this,'next')} />:''
					}
					{
							isShow == true ?
								<img alt="产品图片" className="img-w" style={{width:'100%',maxWidth:720}} src={domain ? domain + _imgList[_curIndex].imageUrl : _imgList[_curIndex].imageUrl} />
								:
								<img alt="产品图片" className="img-w" style={{width:'100%',maxWidth:720}} src={domain ? domain + _imgList[_curIndex] : _imgList[_curIndex]} />
						}

					{/* <img alt="产品图片"  className="img-w"  style={{height: autoHeight1}} src={domain? domain + imgList[_curIndex]:imgList[_curIndex] } />  */}
				</div>
			</Modal>
		)
	}
}

export default ImaModal