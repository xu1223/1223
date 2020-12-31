import React from 'react'
import { Modal, notification, Button, message } from "antd";
import api from 'fetch/api'
import {
    post
} from '@/fetch/request'
import moment from 'moment';

const confirmImg = {
    confirm: 'info',
    error: 'del',
    success: 'success'
}

export default {
    modal(props = {}) {
        const {
            title = '系统提示',
            content = '确认操作后，不可修改',
            imgType,
            className = 'window-container',
            okText = '确认',
            cancelText = '取消',
            onOk,
            onCancel,
            icon,
            type = "confirm",
            imgSrc = '',
            show = false,
            ..._props
        }  = props
        if (icon) {
            _props.icon = <i className={`iconfont ${icon && icon}`}></i>;
        }
        Modal[type]({
            title,
            okText,
            cancelText,
            className,
            closable: true,
            destroyOnClose: true,
            onOk: onOk,
            onCancel: onCancel,
            ..._props,
            content:<>
                <div className="pos-img" style={{display: !!show ? 'block' : 'none' }}>
                    <img src={require(`../static/img/tip-${confirmImg[type] || imgSrc || 'info'}.png`)} />
                </div>
                { content }
            </>
        })
    },
    notify(props = {}) {
        const {
            title = '系统提示',
            content = '确认操作后，不可修改',
            type = "info",
            cancelText = '取消',
            okText = '确认',
            className = 'window-notifications',
            icon,
            duration = 3,
            placement = 'topRight',
            isbtn = false,
            onOk,
            ..._props
        }  = props
        if (icon) {
            _props.icon = <i className={`iconfont ${icon && icon}`}></i>;
        }
        if (isbtn) {
            _props.btn = <>
                <Button size="small" onClick={() => notification.close()}>
                    {cancelText}
                </Button>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                        onOk && onOk();
                        notification.close();
                    }}
                    >
                    {okText}
                </Button>
          </>
        }
        notification[type]({
            className,
            message: title,
            duration,
            description: content,
            placement,
            ..._props
        })
    },
    msg(props = {}){
        const {
            type = "warning",
            content = "内容提示",
            duration = 3,
            icon,
            iconColor = "#4486F7",
            ..._props
          } = props;
          if (icon) {
            _props.icon = (
              <i
                className={`iconfont  ${icon && icon}`}
                style={{ color: iconColor }}
              ></i>
            );
          }
          message[type]({
            content: content,
            duration,
            ..._props
          });
    }
}


//  获取返回结构的数据
export function getResultData(res) {
    return res.resultData.data || res.resultData
}

/**
 * 获取分页配置
 * @param {默认显示个数} num 
 */
export function getPageConfig(num = 20) {
    return {
        showTotal: function (total) {
            return `总计 ${total} 条记录`
        },
        // itemRender: function(current, type, originalElement) {
        //     if (type === 'prev') {
        //       return <a className="ant-pagination-item-link">《</a>;
        //     }
        //     if (type === 'next') {
        //       return <a className="ant-pagination-item-link">》</a>;
        //     }
        //     return originalElement;
        // },
        current: 1,
        total: 0,
        defaultPageSize: num,
        pageSize: num,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '100', '200', '500']
    }
}
/**
 * 请求参数如果存在undefined 情况 重置
 * @param {对象} reqParams 
 * @param {默认值} defaultValue 
 */
export function resetUndefined(reqParams, defaultValue = '') {
    for (var i in reqParams) {
        if (reqParams[i] == undefined) {
            reqParams[i] = defaultValue;
        }
    }
    return reqParams;
}

// 获取TOKEN
export function getToken() {
    return {
        
        token: localStorage.getItem("MEMBER_TOKEN"),
        user_id: localStorage.getItem('USER_ID'),
        access_token: localStorage.getItem("ACCESS_TOKEN"),
        member_token:  localStorage.getItem("MEMBER_TOKEN"),
        accessToken:  localStorage.getItem("accessToken"),
    }
}
// 防抖
export function throttle  (fn, delay){
    let last = 0;
    return (...args) => {
        const now = +Date.now();
        console.log("call", now, last, delay);
        if (now > last + delay) {
            last = now;
            fn.apply(this, args);
        }
    };
};


function httpRequest(paramObj,fun,errFun) {
	var xmlhttp = null;
	if(window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}else if(window.ActiveXObject) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(xmlhttp == null) {
		alert('你的浏览器不支持XMLHttp');
		return;
	}
	var httpType = (paramObj.type || 'GET').toUpperCase();
	var dataType = paramObj.dataType || 'json';
	var httpUrl = paramObj.httpUrl || '';
	var async = paramObj.async || false;
	var paramData = paramObj.data || [];
	var requestData = '';
	for(var name in paramData) {
		requestData += name + '='+ paramData[name] + '&';
	}
	requestData = requestData == '' ? '' : requestData.substring(0,requestData.length - 1);
	console.log(requestData)
	
	xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      fun(xmlhttp.responseText);
    }else{
    	errFun;
    }
	}			
	
	if(httpType == 'GET') {
		xmlhttp.open("GET",httpUrl,async);
	xmlhttp.send(null);
	}else if(httpType == 'POST'){
		xmlhttp.open("POST",httpUrl,async);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		xmlhttp.send(requestData); 
	}
}
// 获取ACCESS_TOKEN
export function getAccesstoken() {
    
     let _host = location.host;
     if (_host.indexOf("localhost") != -1)
     _host = "rlscartpanel.affectcloud.com"
     ;

    //  panel
    let domainUrl = _host;
    const nowTime = moment();
    const _date = nowTime.format('YYYYMMDD');
    const app_key = MD5(`panel${_date}`),
    app_value = MD5(`${domainUrl}${_date}`);

    var paramObj = {
        httpUrl : process.env['APP_HOST_URL_API_AUTH'],
        type : 'post',
        data : { 
            app_key: app_key,
            app_value: app_value
        }
    }
    /*请求调用*/
    httpRequest(paramObj,function(res) {
        res = JSON.parse(res)
        setItem('ACCESS_TOKEN', res.resultData.access_token)
        setItem('expired_at', res.resultData.expired_at)
    },function() {
        alert('网络错误')
    });
  
}

/**
 * 获取一个指定时区的日期 默认指定中国时区-正8区
 * @param fmt 格式
 * @param str_date 指定日期时间
 * @param timezone 时区
 * @returns {string}
 */
export function iDate (fmt = "yyyy-MM-dd hh:mm:ss", str_date = "", timezone = 8) {
    let date;
    if (str_date !== "") {
      date = new Date(str_date.replace(/\-/g, "/"));
    } else {
      date = new Date();
    }
    console.log(date,'date-qr')
    if (timezone !== false) {
      let offsetGMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
      let now = date.getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
      date = new Date(now + offsetGMT * 60 * 1000 + parseInt(timezone) * 60 * 60 * 1000);
    }
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds(), //毫秒
      "U": date.getTime() / 1000, //Unix时间戳
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ?
          o[k] :
          ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  };


// 获取HTML
export function getHtml(str) {
    return <span dangerouslySetInnerHTML={{ __html: str }} ></span>
}

// 深拷贝数据
export function deepClone(data) {
    return JSON.parse(JSON.stringify(data))
}

// 获取差集
export function difference(arra, arrb) {
    return Array.from(new Set([...arra].filter(x => !arrb.includes(x))))
}

// 获取交集
export function intersect(arra, arrb) {
    return Array.from(new Set([...arra].filter(x => arrb.includes(x))))
}

// 去重数据
export function duplicate(arr) {
    return Array.from(new Set(arr))
}

//设置
export function setItem(key, value) {
    if(value instanceof Object){
        value =JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

//获取
export function getItem(key) {
    return localStorage.getItem(key)
}

//获取对象
export function getJson(key) {
    return JSON.parse(getItem(key))
}
// 获取 type 和 url
export function getUrlType(method) {
    const [type, url] = method.split(" ").filter(item => item);
    if (!url) {
        // 默认get 请求去除
        return ['', type]
    } else {
        return [type, url]
    }
}

// 判断是时间格式
export function isDate(date) {
    return isNaN(date) && !isNaN(Date.parse(date))
}

export function isArray(data) {
    return data instanceof Array && data.constructor == Array
}

// 两个元素换位子
export function swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

//将13位时间戳转为年月日
export function dateLongString(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return year + "-" + month + "-" + day;
}

//将13位时间戳转为年月日时分秒
export function dateLongStringTime(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return year + "-" + month + "-" + day + ' ' + hours + ':' + minutes + ':' + seconds;
}

//递归生成sku 逻辑
export function pl(arr, splitstr = '-') {
    var count = arr.length - 1; //数组长度(从0开始)
    var tmp = [];
    var totalArr = []; // 总数组
    return doCombinationCallback(arr, 0); //从第一个开始
    //js 没有静态数据，为了避免和外部数据混淆，需要使用闭包的形式
    function doCombinationCallback(arr, curr_index) {
        if (arr && arr.length) {
            arr[curr_index].map(val => {
                tmp[curr_index] = val; //以curr_index为索引，加入数组
                //当前循环下标小于数组总长度，则需要继续调用方法
                if (curr_index < count) {
                    doCombinationCallback(arr, curr_index + 1); //继续调用
                } else {
                    totalArr.push(tmp.join(splitstr)); //(直接给push进去，push进去的不是值，而是值的地址)
                }
                const oldTmp = tmp;
                tmp = [];
                oldTmp.map(item => {
                    tmp.push(item)
                })
            })
        }
        return totalArr;
    }
}

//远程获取数据,调用的时候组件内部需要bind this,否则会报错
export function fetchUser(value) {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const {
        requestParams = {
            platform: 6
        },
        requestKey,
        romoteUrl
    } = this.props;
    const {
        ...otherParams
    } = Object.assign({}, requestParams);
    otherParams[requestKey] = value;
    this.setState({
        remoteData: [],
        fetching: true
    });
    post(romoteUrl, {
        ...otherParams
    }).then(res => {
        if (fetchId !== this.lastFetchId) {
            return;
        }
        this.setState({
            remoteData: res.resultData.data,
            fetching: false
        });
    });
};
//获取线上环境的url
export function baseUrl(method) {
    let pathArr = method.split('/')
    let rootName = !pathArr[0] ? pathArr[1] : pathArr[0];
    return process.env['APP_HOST_URL_' + rootName.toUpperCase()]
}



export function stringSame(str1, str2) {
    //计算两个字符串的长度。  
    var len1 = str1.length,
        len2 = str2.length,
        dif = [],//建立上面说的数组，比字符长度大一个空间
        temp, i, j, a;
    //赋初值，步骤B
    for (a = 0; a <= len1; a++) {
        dif[a] = [];
        dif[a][0] = a;
    }
    for (a = 0; a <= len2; a++) {
        dif[0][a] = a;
    }
    //计算两个字符是否一样，计算左上的值
    //var temp;
    for (i = 1; i <= len1; i++) {
        for (j = 1; j <= len2; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                temp = 0;
            } else {
                temp = 1;
            }
            dif[i][j] = Math.min(dif[i - 1][j - 1] + temp, dif[i][j - 1] + 1, dif[i - 1][j] + 1);
        }
    }
    //console.log("差异步骤：" + dif[len1][len2]);
    //计算相似度
    //var similarity = 1 - dif[len1][len2] / Math.max(str1.length, str2.length);
    return 1 - dif[len1][len2] / Math.max(len1, len2);
}

//获取最近多少天的时间字符串
export function timeForMat(count) {
    // 拼接时间
    let time1 = new Date()
    time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
    let Y1 = time1.getFullYear()
    let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
    let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
    let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
    let time2 = new Date()
    time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
    let Y2 = time2.getFullYear()
    let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
    let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
    let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
    return {
        t1: timer1,
        t2: timer2
    }
}
export function scrollAnimation(currentY, targetY) {
    let needScrollTop = targetY - currentY
    let _currentY = currentY
    setTimeout(() => {
      const dist = Math.ceil(needScrollTop / 10)
      _currentY += dist
      window.scrollTo(_currentY, currentY)
      if (needScrollTop > 10 || needScrollTop < -10) {
        scrollAnimation(_currentY, targetY)
      } else {
        window.scrollTo(_currentY, targetY)
      }
    }, 1)
   }


export function animateScroll(element, speed) {
    console.log(element,speed)
    let rect = element.getBoundingClientRect();
    //获取元素相对窗口的top值，此处应加上窗口本身的偏移
    let top = window.pageYOffset + rect.top - 120;
    let currentTop = window.pageYOffset;
    let requestId;
    //采用requestAnimationFrame，平滑动画
    function step(timestamp) {
        currentTop += speed;
        if (currentTop <= top) {
            window.scrollTo(0, currentTop);
            requestId = window.requestAnimationFrame(step);
        } else {
            scrollAnimation(currentTop,top)
            requestId = window.requestAnimationFrame(step);
            window.cancelAnimationFrame(requestId);
        }
    }
    window.requestAnimationFrame(step);
}

// 打印面单
export function printMask (params = {}){
    const {
        data = {},
        view = false //是否预览
    } = params
    // 是否自定义
    const is_nocustomize = Array.isArray(data) && data[0].type == 'print_png' || data.type == 'print_png'
    if (is_nocustomize) {
        let _pngPrint = [], imageSize = {};
        if(Array.isArray(data)) {
            _pngPrint = data.map(item => item.addresses).join(',').split(',')
            imageSize = JSON.parse(data[0].image_size)[0]
        } else {
            _pngPrint = data.addresses.split(',')
            imageSize = JSON.parse(data.image_size)[0]
        }
        let isFlag = data.sort_flag ? true : false, //isFlag 默认是false  如果需要特殊处理 为 true
            _heightSize = data.size ? data.size : 100,
            ratio = imageSize.height / imageSize.width,
            PageSize = isFlag ? parseInt(_heightSize) : 100 * ratio;

        LODOP.PRINT_INITA(0, 0, '100mm', (100 * ratio + 1.6) + 'mm', '');
        _pngPrint.forEach(item => {
            LODOP.SET_PRINT_PAGESIZE(0, '100mm', (PageSize + 1.6) + 'mm', '');
            LODOP.ADD_PRINT_IMAGE(0, 0, '100mm', 100 * ratio + 'mm', "<img border='0' src='" + item + "'/>");
            LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
            LODOP.NewPageA();
        })
        LODOP.SET_PRINTER_INDEX(-1);
        if (view) {
            LODOP.PREVIEW();
        } else {
            LODOP.PRINT();
        }
    } else {
        if (Array.isArray(data)) {
            data.forEach(item => {
                printData({
                    _data: item
                })
                LODOP.NewPageA();  // 切换下一页
            })
        } else {
            printData({
                _data: data,
            })
        }
        LODOP.SET_PRINTER_INDEX(-1);
        if (view) {
            LODOP.PREVIEW();
        } else {
            LODOP.PRINT();
        }
    }
}

//打印自定义
function printData({_data}) {
    const _content = _data.content;
    var _pWidth = _data.pageW,
        _pHeight = _data.pageH,
        _plimit = _data.product_row;  // 有种自定义面单A4类型 限制 里面表格的显示个数
    LODOP.PRINT_INITA(0, 0, _pWidth + 'mm', _pHeight + 'mm', '');
    LODOP.SET_PRINT_PAGESIZE(0, _pWidth + 'mm', _pHeight + 'mm', '');

    if (_data.molBg && _data.molBg.indexOf("html") == -1) {
        // 增加背景图片  容错 html 背景图 不添加
        LODOP.ADD_PRINT_IMAGE(0, 0, _pWidth + 'px', _pHeight + 'px', "<img src='" + _data.molBg + "'/>");
    }

    for (var i = 0, len = _content.length; i < len; i++) {
        var now = _content[i];
        const codeType = '128B'
        if (["barcode", "barcode_order", "agent_mailno", "temp_order_id", "tracking_no"].includes(now.type)){
            // var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
            LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width), parseInt(now.height), codeType, now.html);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
            LODOP.SET_PRINT_STYLEA(0, "AlignJustify", 2);
        } else if (now.type == "barcode_zipcode" || now.type == "ywsf_barcode") {
            // var codeType = /^[0-9]*$/.test(now.html) ? '128B' : '128B';
            LODOP.ADD_PRINT_BARCODE(now.top, now.left, parseInt(now.width) + 'px', parseInt(now.height - 6) + 'px', codeType, now.html + " ");
            LODOP.SET_PRINT_STYLEA(0, "ShowBarText", 0);
            var codestr = now.type == "barcode_zipcode" ? "ZIP" + now.html : now.html;
            LODOP.ADD_PRINT_HTM(now.top + now.height - 5, now.left, parseInt(now.width), parseInt(now.height) + 'px', '<div style="font-size:13;line-height:1;word-break:break-all;">' + codestr + '</div>')
        } else {
            if (typeof now.html == "object" && now.html != null) {
                var top = now.top;
                var destArr = now.html;

                if (!!_plimit && _plimit != "0") { //如果有限制的话  使用限制值
                    destArr = now.html.slice(0, _plimit);
                }
                destArr.forEach((item, index) => {
                    var _height = now.height * 2;
                    LODOP.ADD_PRINT_HTM(top, now.left, parseInt(now.width), _height, '<div style="font-size:8;line-height:1;text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000">' + item + '</div>')
                    top = top + _height - 1;
                })
            } else {
                LODOP.ADD_PRINT_HTM(now.top, now.left, parseInt(now.width), now.height, '<div style="font-size:' + now.fontSize + '; line-height:' + now.lineHeight + ';text-align:' + now.textAlign + ';border:' + now.borderWidth + ' solid #000000; font-weight:' + now.fontWeight + '">' + (now.html == null ? "" : now.html) + '</div>')
            }
        }
    }
}


