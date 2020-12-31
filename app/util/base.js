import {
	hashHistory
} from 'react-router'
import React from 'react'
import {
	Modal,
	message
} from 'antd';
import {
	USER_TOKEN
} from '../config/localStoreKey.js'
import api from 'fetch/api';
import {
	post
} from 'fetch/request'
// import * as Request from '../fetch/order/index.js'
import moment from 'moment'
const confirm = Modal.confirm;
const nowPowerData = {};
export default {
	tipForm: false,
	last30Day: moment().subtract(30, 'days').format('YYYY-MM-DD'),
	nowPowerData: {}, //当前权限的数据
	lastResetParams: {},
	getItem(key) {
		let value
		try {
			value = localStorage.getItem(key)
		} catch (ex) {
			// 开发环境下提示error
			if (__DEV__) {
				console.error('localStorage.getItem报错, ', ex.message)
			}
		} finally {
			return value
		}
	},
	setItem(key, value) {
		try {
			// ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
			localStorage.setItem(key, value)
		} catch (ex) {
			// 开发环境下提示 error
			if (__DEV__) {
				console.error('localStorage.setItem报错, ', ex.message)
			}
		}
	},
	//处理后台返回数据
	handleResult(result, success, err, isModalErr) {
		var that = this;
		if(result){
			const {
				resultId,
				resultMsg
			} = result;
			if (resultId == "1" || resultId == '109') { //成功
				success(result);
			} else if (resultId == "0" || resultId == "2") { //失败
				if (!!err) {
					err(result);
				}
				if (isModalErr == 'noMsg') {
					return;
				}
				Modal.error({
					title: '系统提示',
					content: <div dangerouslySetInnerHTML = {this.getHtmlStr(resultMsg)} ></div>
				});
			} else if (resultId == -10 || resultId == 5) {
				if (!this.tipForm) {
					//超时的情况
					if (resultId == -10) {
						this.setItem("OtherMsg", resultMsg);
					} else {
						//异常的情况
						Modal.error({
							title: '系统提示',
							content: <div dangerouslySetInnerHTML = {this.getHtmlStr(resultMsg)} ></div>,
							onOk: function() {
								location.reload();
								that.tipForm = false;
							}
						});
					}
					this.tipForm = true;
				}
			}
		}
	},
	//如果数据没有权限的时候 后台返回null  需要重置为[]
	restNoPowerData(data) {
		if (data.resultId == "0" && data.resultData.data == null) {
			return [];
		} else if (data.resultId == "1") {
			return data.resultData.data;
		}
	},
	//提交数据 含有undefined 的时候 删除掉非不要提交的值为undefined的字段
	delUndefinedCode(obj) {
		Object.keys(obj).forEach((item) => {
			if (obj[item] == undefined) {
				delete obj[item];
			}
		});
		return obj;
	},
	//对象数组深拷贝方法
	deepCloneArray(oldArr) {
		return oldArr && JSON.parse(JSON.stringify(oldArr))
	},
	getHostUrl(url) {
		if (__DEV__) {
			return this.baseUrl + url;
		} else {
			return url;
		}
	},
	/**
	 * 根据destID获取子JSON
	 * @param {[type]} jsonData [description]
	 * @param {[type]} destID   [description]
	 */
	getSubJson(jsonData, destID, json) {
		for (var i = 0; i < jsonData.length; i++) {
			if (jsonData[i].index == destID)
				json.push(jsonData[i]);
			else {
				if (jsonData[i].hasOwnProperty("child")) {
					this.getSubJson(jsonData[i].child, destID, json);
				}
			}
		}
		return json;
	},
	//设置当前页面的权限控制JSON
	setPowerJson(json) {
		json.map(item => {
			const key = item.index;
			this.nowPowerData[key] = {};
			if (item.child && item.child.length > 0) {
				item.child.map(inner => {
					if (inner.child && inner.child.length == 0) {
						this.nowPowerData[key][inner.index] = inner.title;
					} else {
						this.setPowerJson([inner]);
					}
				})
			}
		})
	},
	powerShow(key, action, string, delay) {
		if (!!delay) {
			setTimeout(() => {
				if (this.nowPowerData[key] != undefined && this.nowPowerData[key][action] != undefined)
					return string
			}, delay)
		} else {
			if (this.nowPowerData[key] != undefined && this.nowPowerData[key][action] != undefined)
				return string
		}

	},
	/**
	 * 将getMethod的函数请求的数据 渲染到stateName state变量中  
	 * @param  {[type]} getMethod [方法名]
	 * @param  {[type]} stateName [存入变量名]
	 * @param  {Object} params    [传递参数]
	 * @return {[type]}           [description]
	 */
	getSelectData(that, getMethod, stateName, params = {}, callBack) {
		let stateParam = {};
		getMethod(params).then(data => {
			if (data.resultId == "1") { //成功
				let Global = data.resultData;
				let stateParam = {};
				stateParam[stateName] = Global.data && Global.data.list ? Global.data.list : Global.data;
				that.setState(stateParam);
				if (!!callBack) {
					callBack(data);
				}
			} else {
				return false;
			}
		})
	},

	/**
	 * 获取各个模块的标签列表
	 * @param  tagTypeKey [ID的key]
	 */
	getTagListData(that, tagTypeKey) {
		let params = {
			type: TAG_TYPE_ID[tagTypeKey]
		}
		post(api.gettaglist,{params}).then(data => {
			if (data.resultId == "1") { //成功
				let dataList = data.resultData.data && data.resultData.data[0] ? data.resultData.data[0].list : [];
				that.setState({
					tagList: dataList
				});
			} else {
				return false;
			}
		})
	},

	//固定高度
	//mark luh  需要把最新的一次表格定义 缓存到lastResetParams变量中
	getHeight(obj, btListHeight) {
		let objdest = obj;
		let btListHeightdest = !!btListHeight ? btListHeight : 0;
		if (obj) {
			this.lastResetParams = {
				obj,
				btListHeight: btListHeightdest
			}
		} else {
			objdest = this.lastResetParams.obj;
			btListHeightdest = this.lastResetParams.btListHeight;
		}
		const tableHeight = window.innerHeight - 300 - (btListHeightdest ? -220 : 0);
		if (objdest != undefined)
			objdest.setState({
				tableHeight
			})
	},
	//获取打印code类型
	getCodeType(str) {
		return /^[0-9]*$/.test(str) ? '128B' : '128B';
	},
	//打印要用到的函数
	printData(LODOP, _data, isread, noPrint, printCode) {
		const _content = _data.content;
		/*var _pWidth = _data.pageW,
			_pHeight = _data.pageH;
		const mHeight = 100 * _pHeight / _pWidth;
		if (!noPrint) {
			LODOP.PRINT_INITA(0, 0, "100mm", mHeight + "mm", '');
		}
		LODOP.SET_PRINT_PAGESIZE(0, "100mm", mHeight + "mm", '');

		if (_data.molBg && _data.molBg.indexOf("html") == -1) {
			LODOP.ADD_PRINT_IMAGE(0, 0, "100mm", mHeight + "mm", "<img src='" + _data.molBg + "'/>");
			LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
		}*/
		var _pWidth = _data.pageW,
			_pHeight = _data.pageH,
			_plimit = _data.product_row;
		if (!noPrint) {
			LODOP.PRINT_INITA(0, 0, _pWidth + 'px', _pHeight + 'px', '');
		}
		LODOP.SET_PRINT_PAGESIZE(0, _pWidth + 'px', _pHeight + 'px', '');

		if (_data.molBg && _data.molBg.indexOf("html") == -1) {
			LODOP.ADD_PRINT_IMAGE(0, 0, _pWidth + 'px', _pHeight + 'px', "<img src='" + _data.molBg + "'/>");
		}


		for (var i = 0, len = _content.length; i < len; i++) {
			var now = _content[i];
			if (now.type == "barcode" || now.type == "barcode_order" || now.type == "agent_mailno" || now.type == "temp_order_id" || now.type == "tracking_no") {
				var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
				LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width), parseInt(now.height), codeType, now.html);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
				LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 2);
				//LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 2);
				/*
				LODOP.ADD_PRINT_HTM(parseInt(now.top) + parseInt(now.height) - 6, now.left, parseInt(now.width), 10, '<div style="text-align:center;font-family:Microsoft YaHei;line-height:1;font-size:10;font-weight:700;letter-spacing:5px;">' + now.html + '</div>')*/
			} else if (now.type == "barcode_zipcode" || now.type == "ywsf_barcode") {
				var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
				LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width) + 'px', parseInt(now.height - 6) + 'px', codeType, now.html + " ");
				LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
				var codestr = now.type == "barcode_zipcode" ? "ZIP" + now.html : getNum(now.html)[0];
				LODOP.ADD_PRINT_HTM(now.top + now.height - 5, now.left, parseInt(now.width), parseInt(now.height) + 'px', '<div style="font-size:13;line-height:1;word-break:break-all;">' + codestr + '</div>')
			} else {
				if (typeof now.html == "object" && now.html != null) {
					var top = now.top;
					var destArr = now.html;
					if (printCode == "ETK") {
						destArr = now.html.slice(0, 4); //如果是ETK 的话  只需要显示4个
					} else if (!!_plimit && _plimit != "0") { //如果有限制的话  使用限制值
						destArr = now.html.slice(0, _plimit);
					}
					destArr.map((item, index) => {
						var _height = now.height * 2;
						LODOP.ADD_PRINT_HTM(top, now.left, parseInt(now.width), _height, '<div style="font-size:8;line-height:1;text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000">' + item + '</div>')
						top = top + _height - 1;
					})
				} else {
					LODOP.ADD_PRINT_HTM(now.top, now.left, parseInt(now.width), now.height, '<div style="font-size:' + now.fontSize + '; line-height:' + now.lineHeight + ';text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000; font-weight:' + now.fontWeight + '">' + (now.html == null ? "" : now.html) + '</div>')
				}
			}
		}
		LODOP.NewPageA();
		if (!noPrint) {
			LODOP.SET_PRINTER_INDEX(-1);
			if (!isread) {
				LODOP.PRINT();
			} else {
				LODOP.PREVIEW();
			}
		}
	},

	printLogisticsMask(wrapDataID, wrapDataCode, _data, LODOP, isRead) {
		if (wrapDataCode == "TNT") {

			// Request.printOrderTnt({
			// 	id: wrapDataID
			// }).then(data => {
			// 	LODOP.PRINT_INITA(0, 0, '', '', '');
			// 	for (var j = 0; j < 4; j++) {
			// 		this.printData(LODOP, _data, isRead, true); //打印内容  打印4份面单
			// 	}

			// 	const TNTData = data.resultData.data[0];
			// 	for (var i = 0; i < 2; i++) { //打印 2份对账单
			// 		LODOP.SET_PRINT_PAGESIZE(0, '', '', 'A4')
			// 		var strStyle = "<style>table{border-collapse: collapse;margin-bottom:10px;} p{margin:0;padding:0;}td,th {border:1px solid #000; height:30px;line-height:1.2;} td span{display:inline-block;} </style>"
			// 		document.getElementById("J_printTableStr").innerHTML = TNTData;
			// 		LODOP.ADD_PRINT_HTM(30, "2%", "96%", "297mm", strStyle + TNTData);
			// 		LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
			// 		LODOP.ADD_PRINT_HTM(1100, 690, 300, 100, "<font color='#0000ff' format='ChineseNum'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
			// 		LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
			// 		LODOP.SET_PRINT_STYLEA(0, "Horient", 1);
			// 		//LODOP.PREVIEW();
			// 		LODOP.NewPageA();
			// 	}
			// 	LODOP.SET_PRINTER_INDEX(-1);
			// 	if (isRead) {
			// 		LODOP.PREVIEW();
			// 	} else {
			// 		LODOP.PRINT();
			// 	}
			// })
		} else if (_data.type == "print_png" || (_data instanceof Array && _data[0].type == "print_png")) {
			let _pngPrint = [],
				imageSize = {};
			if (_data instanceof Array) {
				var temp = [];
				_data.map(item => {
					temp.push(item.addresses);
				});
				_pngPrint = temp.join(',').split(','); // 构造要打印的图片
				imageSize = JSON.parse(_data[0].image_size)[0];
			} else {
				_pngPrint = _data.addresses.split(',');
				imageSize = JSON.parse(_data.image_size)[0];
			}
			let isFlag = _data.sort_flag ? true : false, //isFlag 默认是false  如果需要特殊处理 为 true
				_heightSize = _data.size ? _data.size : 100,
				ratio = imageSize.height / imageSize.width,
				PageSize = isFlag ? parseInt(_heightSize) : 100 * ratio

			LODOP.PRINT_INITA(0, 0, '100mm', (100 * ratio + 1.6) + 'mm', '');

			for (var i = 0, len = _pngPrint.length; i < len; i++) {
				LODOP.SET_PRINT_PAGESIZE(0, '100mm', (PageSize + 1.6) + 'mm', '');
				LODOP.ADD_PRINT_IMAGE(0, 0, '100mm', 100 * ratio + 'mm', "<img border='0' src='" + _pngPrint[i] + "'/>");
				LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
				LODOP.NewPageA();
			}
			LODOP.SET_PRINTER_INDEX(-1);
			if (isRead) {
				LODOP.PREVIEW();
			} else {
				LODOP.PRINT();
			}

		} else {
			var that = this;
			if (_data instanceof Array) {

				LODOP.PRINT_INITA(0, 0, '', '', '');

				for (var j = 0, len = _data.length; j < len; j++) {
					this.printData(LODOP, _data[j], isRead, true); //打印内容  打印4份面单
				}

				LODOP.SET_PRINTER_INDEX(-1);
				if (isRead) {
					LODOP.PREVIEW();
				} else {
					LODOP.PRINT();
				}

			} else {
				this.printData(LODOP, _data, isRead, '', wrapDataCode);
				// if (_data.molBg) {
				// 	var image = new Image();
				// 	image.src = _data.molBg;
				// 	image.onload = function() {
				// 		that.printData(LODOP, _data, isRead, '', wrapDataCode);
				// 	}
				// } else {
				// 	this.printData(LODOP, _data, isRead, '', wrapDataCode);
				// }
			}


		}
	},

	//打印需要用到的函数  --------------start
	needCLodop() {
		try {
			var ua = navigator.userAgent;
			if (ua.match(/Windows\sPhone/i) != null) return true;
			if (ua.match(/iPhone|iPod/i) != null) return true;
			if (ua.match(/Android/i) != null) return true;
			if (ua.match(/Edge\D?\d+/i) != null) return true;

			var verTrident = ua.match(/Trident\D?\d+/i);
			var verIE = ua.match(/MSIE\D?\d+/i);
			var verOPR = ua.match(/OPR\D?\d+/i);
			var verFF = ua.match(/Firefox\D?\d+/i);
			var x64 = ua.match(/x64/i);
			if ((verTrident == null) && (verIE == null) && (x64 !== null))
				return true;
			else
			if (verFF !== null) {
				verFF = verFF[0].match(/\d+/);
				if ((verFF[0] >= 42) || (x64 !== null)) return true;
			} else
			if (verOPR !== null) {
				verOPR = verOPR[0].match(/\d+/);
				if (verOPR[0] >= 32) return true;
			} else
			if ((verTrident == null) && (verIE == null)) {
				var verChrome = ua.match(/Chrome\D?\d+/i);
				if (verChrome !== null) {
					verChrome = verChrome[0].match(/\d+/);
					if (verChrome[0] >= 42) return true;
				};
			};
			return false;
		} catch (err) {
			return true;
		};
	},
	//打印需要用到的函数  --------------end
	getLodop(oOBJECT, oEMBED) {
		var strHtmInstall = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
		var strHtmUpdate = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
		var strHtm64_Install = "<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
		var strHtm64_Update = "<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
		var strHtmFireFox = "<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
		var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
		var strCLodopInstall = "<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
		var strCLodopUpdate = "<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
		var LODOP;
		try {
			var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
			if (this.needCLodop()) {
				try {
					LODOP = getCLodop();
				} catch (err) {};
				if (!LODOP && document.readyState !== "complete") {
					alert("C-Lodop没准备好，请稍后再试！");
					return;
				};
				if (!LODOP) {
					if (isIE) document.write(strCLodopInstall);
					else
						document.documentElement.innerHTML = strCLodopInstall + document.documentElement.innerHTML;
					return;
				} else {

					if (CLODOP.CVERSION < "2.1.0.2") {
						if (isIE) document.write(strCLodopUpdate);
						else
							document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
					};
					if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
					if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
				};
			} else {
				var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
				//=====如果页面有Lodop就直接使用，没有则新建:==========
				if (oOBJECT != undefined || oEMBED != undefined) {
					if (isIE) LODOP = oOBJECT;
					else LODOP = oEMBED;
				} else if (CreatedOKLodop7766 == null) {
					LODOP = document.createElement("object");
					LODOP.setAttribute("width", 0);
					LODOP.setAttribute("height", 0);
					LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
					if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
					else LODOP.setAttribute("type", "application/x-print-lodop");
					document.documentElement.appendChild(LODOP);
					CreatedOKLodop7766 = LODOP;
				} else LODOP = CreatedOKLodop7766;
				//=====Lodop插件未安装时提示下载地址:==========
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
					if (navigator.userAgent.indexOf('Chrome') >= 0)
						document.documentElement.innerHTML = strHtmChrome + document.documentElement.innerHTML;
					if (navigator.userAgent.indexOf('Firefox') >= 0)
						document.documentElement.innerHTML = strHtmFireFox + document.documentElement.innerHTML;
					if (is64IE) document.write(strHtm64_Install);
					else
					if (isIE) document.write(strHtmInstall);
					else
						document.documentElement.innerHTML = strHtmInstall + document.documentElement.innerHTML;
					return LODOP;
				};
			};
			if (LODOP.VERSION < "6.2.1.7") {
				if (this.needCLodop())
					document.documentElement.innerHTML = strCLodopUpdate + document.documentElement.innerHTML;
				else
				if (is64IE) document.write(strHtm64_Update);
				else
				if (isIE) document.write(strHtmUpdate);
				else
					document.documentElement.innerHTML = strHtmUpdate + document.documentElement.innerHTML;
				return LODOP;
			};
			//===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

			//===========================================================
			return LODOP;
		} catch (err) {
			alert("getLodop出错:" + err);
		};
	},

	getTableFont(data, title, sum, store_code, member_name) {
		const _header = !title ? "拣货单" : title;
		const arr = [];
		arr.push('<div style="text-align:center;line-height:24px; font-size:14px;"><strong>' + _header + '</strong></div>');
		arr.push('<table border=0 cellSpacing=0 cellPadding = 0 width="100%" style="font-size:12px; border-bottom:1px solid #000"><tbody><tr>');
		arr.push('<td width="200">制单人：<span>' + data.name + '</span></td>');
		arr.push('<td width="250">制单时间：<span>' + data.time + '</span></td>');

		if (!!member_name) {
			arr.push('<td width="150">申请人：<span>' + data.member_name + '</span></td>');
			arr.push('<td width="100">ID：<span>' + data.id + '</span></td>');
		}
		if (!!sum) {
			arr.push('<td width="200" >拣货总数：<span>' + sum + '</span></td>');
		}
		if (!!store_code) {
			arr.push('<td width="200" >店铺代码：<span>' + store_code + '</span></td>');
		}
		arr.push('</tr></tbody></table>');

		return arr.join('');
	},


	//表格行点击高亮事件
	tableRowClick(record, index, e) {
		let className = e.currentTarget.className,
			isActive = className.indexOf('table-tr-sel');
		if (isActive !== -1) {
			return;
		}
		let isSel = document.getElementsByClassName('table-tr-sel');
		if (isSel.length > 0) {
			let rowClass = isSel[0].className,
				rowClassArr = rowClass.split('table-tr-sel');
			isSel[0].className = rowClassArr[0];
		}
		e.currentTarget.className += ' table-tr-sel';
	},
	/**
	 * 根据表格storage中记忆的勾选值
	 * @param  {[type]} key [存储在storege中唯一的key]
	 * @return {[type]}     [description]
	 */
	getStoreTableSel(key) {
		if (!this.storeTableSel) {
			this.storeTableSel = !this.getItem("storeTableSel") ? {} : JSON.parse(this.getItem("storeTableSel"))
		}
		return this.storeTableSel[key] ? this.storeTableSel[key] : [];
	},

	getStoreTableSort(key) {
		if (!this.storeTableSort) {
			this.storeTableSort = !this.getItem("storeTableSort") ? {} : JSON.parse(this.getItem("storeTableSort"))
		}
		return this.storeTableSort[key] ? this.storeTableSort[key] : undefined;
	},

	//显示HTML的字符
	getHtmlStr(str) {
		return {
			__html: str
		};
	},

	//获取当前表格的索引
	getArrayKey(data) {
		const keyArr = [];
		data.map(item => {
			keyArr.push({
				label: item.title,
				value: item.key || item.dataIndex
			})
		})
		return keyArr;
	},
	/**
	 * 获取当前的表格列定义数组
	 * @param  {[type]} data    [完整的表格列定义]
	 * @param  {[type]} key     [存储在storege中唯一的key]
	 * @param  {[type]} userKey [用户自定义的列属性]
	 * @param  {[type]} sortObj [排序的对象]
	 * @return {[type]}         [description]
	 */
	getCurArrayCol(data, key, userKey, usersort) {
		const _userKey = this.getStoreTableSel(key);
		const _userSort = this.getStoreTableSort(key);
		let colKey = userKey || [...new Set(_userSort != undefined && !isNaN(_userKey.length) ? _userKey : [])],
			sortObj = usersort || [...new Set(_userSort != undefined && !isNaN(_userSort.length) ? _userSort : [])],
			sumWidth = 0, //总宽度
			arr = [];
		const arrObj = {};
		//如果他不是数组的话 直接渲染全部
		if (colKey.length > 0) {
			const allDataTable = {}; //所有数据的表格映射
			data.map(item => {
				allDataTable[item.key || item.dataIndex] = item;
			}) // 获取一个映射表
			if (typeof sortObj === 'object' && !isNaN(sortObj.length) && sortObj.length != 0) {
				sortObj.map(item => {
					//如果排序存在
					if (colKey.indexOf(item) != -1) { //如果存在于勾选值中
						const nowItem = allDataTable[item];
						if (nowItem != undefined) {
							arr.push(nowItem);
							if (nowItem.children) {
								nowItem.children.map(Iitem => {
									sumWidth += parseInt(Iitem.width);
								})
							} else {
								sumWidth += parseInt(nowItem.width);
							}
						}
					}
				});
			} else {
				data.map(item => {
					if (colKey.indexOf(item.key || item.dataIndex) != -1) { //如果存在于勾选值中
						arr.push(item);
						if (item.children) {
							item.children.map(Iitem => {
								sumWidth += parseInt(Iitem.width);
							})
						} else {
							sumWidth += parseInt(item.width);
						}
					}
				})
			}

		} else {
			data.map(item => {
				if (item.children) {
					item.children.map(Iitem => {
						sumWidth += parseInt(Iitem.width);
					})
				} else {
					sumWidth += parseInt(item.width);
				}
			})
			arr = data;
		}

		return {
			curColumn: arr,
			sumWidth: sumWidth
		};
	},
	gettdStr(arr, width, rowSpan = '1', align = 'center', ) {
		var str = "";
		str += '<td height="50" width="' + width + '" align="' + align + '" rowSpan = "' + rowSpan + '" >';
		arr.map(item => {
			const font = item.fontSize || '12px';
			str += '<div style="line-height:1;text-align:' + align + ';word-break:break-all;font-size:' + font + ';">';
			if (item.lable && item.value) {
				str += item.lable + ":";
			}
			str += item.value;
			str += '</div>';
		})
		str += '</td>';
		return str;
	},

	//获取头部信息
	getHeadStr(dataHeader) {
		var str = "";
		str += '<thead><tr>'
		dataHeader.map(item => {
			str += '<td width="' + item.width + '"><div align="center">' + item.title + '</div></td>';
		})
		str += '</tr></thead>';
		return str;
	},

	//获取底部信息
	getFootStr(dataHeader, specIndex) {
		var str = "";
		str += '<tfoot>';
		str += '<tr>';
		dataHeader.map((item, index) => {
			if (specIndex == index) {
				str += '<td align = "center" tdata="Sum" width="' + item.width + '">商品数量合计：###</td>';
			} else {
				str += '<td align = "center" width="' + item.width + '"></td>';
			}
		})
		str += '</tr>';
		str += '</tfoot>';
		return str;
	},
	trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},
	/**
	 * 比较两个版本号
	 * @param  {[type]} 当前的版本号 [description]
	 * @param  {[type]} 最新的版本号  [description]
	 * @return {[type]}      [description]
	 */
	versionCompare(ver1, ver2) {
		const version1pre = parseFloat(ver1),
			version2pre = parseFloat(ver2),
			version1next = ver1.replace(version1pre + ".", ""),
			version2next = ver2.replace(version2pre + ".", "");
		if (version1pre > version2pre) {
			return true;
		} else if (version1pre < version2pre) {
			return false;
		} else {
			if (version1next >= version2next) {
				return true;
			} else {
				return false;
			}
		}
	},
	//改变标题
	changeTitle(text) {
		let _title = document.title.split("-");
		document.title = _title[0] + "-" + text;
	},

	isSelect(listSelData, operType) { //判断列表是否选中
		if (!listSelData.length) {
			message.warning('请选择您要' + operType + '的项');
			return false;
		} else {
			return true;
		}
	},
	confirmFun(obj) { //确认操作提示框
		const {
			that,
			method, //确定执行的方法
			params, //确定执行的参数
			operType, //操作类型
			callBack // 可选
		} = obj;
		confirm({
			title: '确定要' + operType + '?',
			content: '确定不可撤销',
			width: '340px',
			onOk() {
				// Request[method](params).then(data => {
				// 	if (callBack) {
				// 		callBack(data)
				// 	}
				// 	that.resetSelectFunc();
				// 	that.getListSearch();
				// })
			}
		});
	},
	//从树中查找标题【递归】
	searchTreeLabel(options, searchVal) {
		var lev = null;

		function searchLabel(voptions, dirOpt) {
			for (let i = 0; i < voptions.length; i++) {
				if (lev !== null) {
					break //跳出循环的关键
				}
				if (voptions[i].value === dirOpt) {
					let label = voptions[i].label;
					lev = label //取值关键                           
				} else if (!!voptions[i].children && !!voptions[i].children.length) { //递归条件
					searchLabel(voptions[i].children, dirOpt);
				} else {
					continue
				}
			}
			return lev
		}

		return searchLabel(options, searchVal);
	}

}