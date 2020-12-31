import {
	stringify
} from 'qs'
import React from 'react'

require("isomorphic-fetch");
import {
	resetUndefined,
	getToken,
	getHtml,
	getUrlType,
	getAccesstoken,
	iDate,
	throttle
} from '@/util/index'
import {
	Button,
	notification,
	Modal,
	message,
	Typography
} from 'antd';
const { confirm } = Modal;
const {
	Paragraph
} = Typography;
import debounce from 'lodash.debounce';



// 超时方案
var oldFetchfn = fetch; //拦截原始的fetch方法
window.fetch = function (url, opts) { //定义新的fetch方法，封装原有的fetch方法
	opts = {
		timeout: 15000,
		...opts
	}
	var fetchPromise = oldFetchfn(url, {
		...opts
	});
	var timeoutPromise = new Promise(function (resolve, reject) {
		setTimeout(() => {
			reject(new Error(`${url} 请求超时`))
			// controller.abort();
		}, opts.timeout)
	});
	return Promise.race([fetchPromise, timeoutPromise])
}

// 超时重试代码
function fetchRetry(url, opts, retry = 2) {
	let p = fetch(url, opts);
	if (retry > 0) {
		retry--;
		return new Promise((resolve, reject) => {
			p.then(resolve).catch(() => {
				resolve(fetchRetry(url, opts, retry))
			})
		})
	}
	return p;
}

//临时
function obj2params(obj) {
	var result = '';
	var item;
	for (item in obj) {
		result += '&' + item + '=' + encodeURIComponent(obj[item]);
	}
	if (result) {
		result = result.slice(1);
	}
	return result;
}

function isOldRoot(rootName) {
	return ['erp', 'order', 'home', 'base'].includes(rootName)
}

 function  getResetReqUrl(_reqUrl,isForm) {
	let [type, reqUrl] = _reqUrl ? getUrlType(_reqUrl) : ['get', '']

	let headers = {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json', //默认
	}


	const {
		token,
		access_token,
	} = getToken()

	headers.Authorization = 'Bearer ' + access_token


	const pathArr = reqUrl.split('/') //如果第一个元素 为空字符串 则含有 / 否则没有
	let defaultFetch = true
	const isVaild = !pathArr[0] ? true : false

	let rootName = isVaild ? pathArr[1] : pathArr[0]
	if (reqUrl.indexOf('http') != -1) {
		reqUrl = reqUrl
	} else {
		if (pathArr[2] == 'admin') {
			rootName = pathArr[2]
			reqUrl = process.env['APP_HOST_URL_API_ADMIN'] + reqUrl
		}  else {
			reqUrl = process.env['APP_HOST_URL_API_USER'] + reqUrl
		}

	}

	return {
		restReqUrl: reqUrl,
		defaultFetch,
		headers,
		method: type
	}
}

export function post(reqUrl, reqParams = {}, isForm = false) {
	return fetchData(reqUrl, reqParams, 'post', isForm)
}
export function put(reqUrl, reqParams = {}, isForm = false) {
	return fetchData(reqUrl, reqParams, 'put', isForm)
}
export function deletes(reqUrl, reqParams = {}, isForm = false) {
	return fetchData(reqUrl, reqParams, 'delete', isForm)
}

export function get(reqUrl, reqParams = {}) {
	return fetchData(reqUrl, reqParams)
}

export function request(type = 'post', reqUrl, reqParams = {},isForm=false) {
	type = type ? type : 'post'
	return fetchData(reqUrl, reqParams, type,isForm)
}

const failCode = [0, 2, 400, 500]
// const unVaildCode = [-10, 5, 1100]
const unVaildCode = [1100,1103,1104,1204]
const errorCode = [...failCode, ...unVaildCode]
const debounceTime = 1500

async function fetchData(reqUrl, reqParams, method = 'get', isForm) {
	//  获取请求的URL
	let {
		restReqUrl,
		defaultFetch,
		headers,
		method: _method //获取url 中的method
	} = getResetReqUrl(reqUrl,isForm)
	let expired_at=iDate('U',localStorage.getItem('expired_at') ? localStorage.getItem('expired_at') :  '0',false) 
    if( !isForm  && (!localStorage.getItem('ACCESS_TOKEN') || expired_at<iDate('U') )){
		await	throttle( getAccesstoken(),1000)
		const {
			access_token,
		} = getToken()
		headers.Authorization = 'Bearer ' + access_token
	}
	reqUrl = restReqUrl
	method = !!_method ? _method.toLowerCase() : method
	const otherConfig = {}
	let otherparams = {};


	const {
		token,
	} = getToken()

	reqParams = {
		token,
		...resetUndefined(reqParams),
	}

	if (method == 'get') {
		const reqArray = [];
		Object.keys(reqParams).forEach(key => reqArray.push(key + '=' + reqParams[key]))
		reqUrl = reqUrl + (reqUrl.search(/\?/) === -1 ? '?' : '&') + reqArray.join('&')
	} else {
		if (defaultFetch) {
			reqParams = JSON.stringify(reqParams)
		} else {
			reqParams = obj2params(reqParams);
		}
		otherConfig.body = reqParams
	}
	// }


	return fetchRetry(reqUrl, {
		method,
		...otherConfig,
		headers,
		credentials: 'omit',
		...otherparams
	}).then((response) => {
		return handleResponse(response)
	}).catch(error => {
		openModal(error, {
			reqUrl,
			reqParams,
			method
		})
		// const {
		// 	resultId,
		// 	resultMsg
		// } = error
		// if (unVaildCode.includes(resultId)) {
		// 	openModal(error)
		// } else {
		// 	openNotification(resultMsg)
		// }
	})
}
function handleResponse(response, isJson = true) {
	let contentType = response.headers.get('content-type')
	if (contentType.includes('application/json') || contentType.includes('text/html') || contentType.includes('text/plain;charset=UTF-8')) {
		return handleJSONResponse(response)
	} else {
		return Promise.reject(Object.assign({}, {
			resultId: '1201',
			resultMsg: `content-type ${contentType} 类型不支持！`
		}))
	}
}

function handleJSONResponse(response) {
	return response.json()
		.then(json => {
			if (response.ok) {
				// errorCode.includes(parseInt(json.resultId))
				if (json.resultId != 200) {
					if(json.resultId == '1100'){
						getAccesstoken()
						confirm({
							content: <p>加载超时，请刷新页面</p>,
							onOk() {
						
							},
							onCancel() {
						
							},
						})
                        
					}
					return Promise.reject(json)
				} else {
					return json
				}
			} else {
				return Promise.reject(Object.assign({}, json, {
					resultId: response.status,
					resultMsg: response.statusText
				}))
			}
		})
}

const openModal = debounce((error, requestObj) => {
	const {
		resultMsg,
		resultId
	} = error
	if (unVaildCode.includes(resultId)) {
		message.error(resultMsg)
		// location.href = process.env.APP_HOST_LOGIN_URL
		// $store.dispatch(userLogout({isout: true}))
	} else {
		Modal.error({
			title: '系统提示',
			content: < >
				<
				Paragraph copyable = {
					{
						text: `${requestObj.method} ${requestObj.reqUrl} ${JSON.stringify(requestObj.reqParams)}`
					}
				} > {
					getHtml(resultMsg || error.message)
				} < /Paragraph> < / > ,
			onOk() {
				setTimeout(() => {
					document.body.style.overflow = "auto";
				}, 300);
			},
		})
	}
}, debounceTime)

// function handleTextResponse(response) {
// 	return response.text()
// 		.then(text => {
// 			if (response.ok) {
// 				return text
// 			} else {
// 				return Promise.reject({
// 					resultId: response.status,
// 					resultMsg: response.statusText,
// 					err: text
// 				})
// 			}
// 		})
// }



// // 对请求
// const openNotification = debounce((resultMsg) => {
// 	const key = `open${Date.now()}`;
// 	notification.error({
// 		message: '系统提示:',
// 		description: resultMsg,
// 		btn: <Button type="primary" size="small" onClick={() => { notification.close(key) }}>确认</Button>,
// 		key,
// 		duration: null
// 	});
// }, debounceTime)