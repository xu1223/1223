import React, { Component } from 'react';
import api from '@/fetch/api'
import { getPageConfig } from '@/util/index'
import { get, post } from 'fetch/request'
import update from 'immutability-helper';

const dataOper = ($CONFIG = {}) => (WrappedComponent => {
	return class extends Component {
		constructor(props, context) {
			super(props, context)
			const pageKey = location.hash.split("/")[1]
			const { storeData } = props
			this.cacheSelRow = []; //缓存勾选的函数
			this.state = {
				dataSource: [],  //数据源
				listSelData: [], //勾选值
				selectedRows: [], //勾选行
				values: {}, //查询条件
				summary: {},  //合计
				pagination: getPageConfig(),
				loading: false,
				$pageKey: pageKey,
				activeKey: storeData && storeData.activeKey ? storeData.activeKey[pageKey] : '',
				storeKey: pageKey,
				param: {}
			}

			// params  请求参数  
			// toolConfig: {
			// 	"list": {
			// 		action: "getPublishDraftsList",
			// 		params: {
			// 			platform: 16,
			// 		}
			// 	}
			// },

			// 通过方法 同台设置的
			this.$CONFIG = $CONFIG
			this.api = api
			this.initListParam()
		}

		initListParam = (dyConfig) => {
			try {
				if (!dyConfig) {
					const { pageConfig = {}, api: wapi } = this.props  //从上级 传递的配置
					const api = wapi || this.$CONFIG.api || this.api
					const { list } = { ...this.$CONFIG.toolConfig, ...pageConfig.toolConfig } //配置合并
					let method = ''
					if (typeof list == "string") {
						method = api[list]
					} else {
						method = api[list.action]
					}
					this.method = method  // 得到请求URL
					this.defParams = list.params || {}  // 得到请求参数
					this.listConfig = list
				} else {
					const { action, params = {} } = dyConfig
					this.method = action
					this.defParams = params
					this.listConfig = dyConfig
				}
				// 切换到时候清空数据
				this.setState({
					dataSource: [],
				})
			} catch (e) {
				console.log(e, 'error')
			}

		}

		//比较两个对象是否相等
		compare = (object1, object2) => {
			let flag = true
			for (var key in object1) {
				if (['p', 'pagesize', 'page', 'pageno'].includes(key)) {
					// 需要把 这四个参数 弄出来 跟new_values 进行比较
					continue
				}
				if (!flag) //跳出整个循环
					break;
				if (!object2.hasOwnProperty(key)) {
					flag = false;
					break;
				}
				if (object2[key] != object1[key]) {
					flag = false;
					break;
				}
			}
			return flag
		}

		hasCache = (activeKey) => {
			const { storeData, curMenu } = this.props
			const { $pageKey: pageKey } = this.state;
			activeKey = activeKey || this.state.activeKey || ''  //如果没有传值的时候 从 内存中读取
			const storeKey = !!activeKey ? (pageKey + '#_#' + activeKey) : pageKey
			return (storeKey != this.state.storeKey || storeKey.indexOf('#_#') == -1) && storeData && storeData.searchValue[curMenu] && storeData.searchValue[curMenu][storeKey]
		}

		/**
		 * _values 查询需要用的参数
		 */
		changeSearch = (_values, activeKey) => {
			const { pagination, $pageKey: pageKey } = this.state;
			const { storeData, curMenu } = this.props
			let { values } = this.state
			activeKey = activeKey || activeKey == 0 ? activeKey :  this.state.activeKey || ''  //如果没有传值的时候 从 内存中读取
			const storeKey = !!activeKey ? (pageKey + '#_#' + activeKey) : pageKey
			let curValues = { ...values, ..._values }
			// 缓存值 按照 当前大类 来 进行读取
			if (this.hasCache(activeKey)) {
				// 如果切换到时候values  state 的值 要进行重置
				values = storeData.searchValue[curMenu][storeKey]
				if (storeKey.indexOf('#_#') != -1) {
					curValues = values
				} else {
					curValues = { ...values, ..._values }
				}
			}
			const { p, pagesize, page, pageno, ...new_values } = curValues
			const isChangeSearch = !this.compare(values, new_values)  // 

			pagination.current = isChangeSearch ? 1 : parseInt(p || page || pageno || pagination.current);
			pagination.total = 0 // 要进行重置  否则 分页回显 会有bug
			pagination.pageSize = pagesize || '20';
			this.setState({
				values: new_values,
				storeKey,
				activeKey,
				pagination,
				isChangeSearch,
			}, () => {
				this.getData();
			})
		}

		// 筛选 的函数
		useTableTool = ({ current, pageSize }, filters, sorter = {}) => {
			const { pagination, values, dataSource, listSelData } = this.state;
			if (!pageSize) {
				// 如果不是手动触发的不请求
				return
			}
			listSelData.forEach(item => {
				// TODO 一般是id 唯一
				const searhObj = this.cacheSelRow.find(fitem => fitem ? fitem.id == item : false)
				if (!searhObj) {
					this.cacheSelRow.push(dataSource.find(fitem => fitem.id == item))
				}
			})

			const { field, order } = sorter
			const new_sorter = {
				field: field && order != true ? field : this.state.field,
				sort: order && order != true ? (order == "ascend" ? "asc" : "desc") : this.state.sort
			}

			this.setState({
				pagination: update(pagination, {
					current: { $set: current },
					pageSize: { $set: pageSize }
				}),
				values: { ...values, ...new_sorter },
				isChangeSearch: false,
				...new_sorter
			}, () => {
				this.getData();
			})
		}

		// 获取请求参数
		getAjaxParams() {
			const { pagination: { current, pageSize }, values } = this.state;
			const params = {
				...this.defParams,
				...values,
				pagesize: pageSize,
				// p: current,
				// pageno: current,
				page: current
			}
			delete params.restDataSource
			return params
		}

		//获取请求
		getFetch(_params) {
			const url = this.method
			let _fetch
			if (url.indexOf('productcenter') != -1 || url.indexOf('erp') != -1 || url.indexOf('publishamazon') != -1) {
				_fetch = post(url, _params)
			} else {
				_fetch = get(url, _params)
			}
			return _fetch
		}

		//根据查询和分页条件获取 数据
		getData = () => {
			const { pagination, isChangeSearch, isFirstRenderData } = this.state;
			const { listConfig, method } = this

			// TODO 这里做数据的缓存处理
			const _params = this.getAjaxParams() //获取请求参数
			if (this.props.storeSearchData) {
				this.props.storeSearchData({
					data: _params,
					key: this.state.storeKey,
					type: 'value'
				})
			}

			this.setState({ loading: true })
			this.getFetch(_params).then(res => {
				if (res) {
					
					const _res = !!res.resultData ? res.resultData : (res.data ? res.data : {});
					const { data = {} } = _res;
					let { count = 0, summary = {}, total  } = data;
					let dataSource = [];
					let otherSource
					console.log(_res,'_res_res_res_res')
					
					if (!!this.$CONFIG.restDataSource) {
						dataSource = this.params.restDataSource(_res.data);
					} else {
						if (_res instanceof Array) {
							dataSource = _res
							total = res.total ? res.total :''
						} else if (_res.data instanceof Array) {
							
							const {
								data,
								total: _total,
								..._otherSource
							} = _res
							total = _total
							dataSource = data
							otherSource = _otherSource
						} else if (_res.list ? _res.list.data : '' instanceof Array) {
							dataSource = _res.list.data
							const {
								data,
								count,
								total: _total,
								..._otherSource
							} = res.resultData.list
							total = _total
							console.log(res.resultData, 'res.resultData.res.resultData.')
							let param = {}
							if (res.resultData.total_num) {
								param['total_num'] = res.resultData.total_num
							}
							if (res.resultData.total_price) {
								param['total_price'] = res.resultData.total_price
							}
							if (res.resultData.total_weight) {
								param['total_weight'] = res.resultData.total_weight
							}
							this.setState({
								param: param
							})
							otherSource = _otherSource
						} else if (_res.data.list instanceof Array) {
							dataSource = _res.data.list
							const {
								list,
								count,
								total: _total,
								..._otherSource
							} = res.resultData.data
							otherSource = _otherSource
							total = _total
						}
					}

					if (isChangeSearch) {
						// 如果请求发生改变了 制空
						this.cacheSelRow = []
					}
					console.log(total,pagination,'totaltotaltotaltotaltotaltotaltotal')
					this.setState({
						loading: false,
						dataSource,
						listSelData: isChangeSearch ? [] : this.state.listSelData, //重置 勾选数据
						summary,
						otherSource,
						pagination: update(pagination, { total: { $set: dataSource.length && !listConfig.CountParam ? parseInt(total) : 0 } })
					}, () => {
						const { CountParam } = listConfig;
						// 存在 需要分离 统计 
						if (dataSource.length == 0 && _params.p > 1) {
							// 最后一页没有数据  并且不是第一页的情况
							const { pagination: { current, pageSize } } = this.state;
							this.useTableTool({ current: current - 1, pageSize })
						} else if (CountParam && (isChangeSearch || !isFirstRenderData)) {
							this.getFetch({ ..._params, ...CountParam }, method).then(res => {
								const { count, summary } = res.resultData.data;
								this.setState({
									summary,
									isFirstRenderData: true,
									pagination: update(pagination, {
										total: { $set: parseInt(count) }
									})
								})
							})
						}
					})
				} else {
					this.setState({
						loading: false
					})
				}

			})
		}


		//type : check 选中传进来的数据 ， unCheck去除勾选
		setSelectRows = (listSelDataKeys, type) => {
			const {
				listSelData,
				selectedRows
			} = this.state;
			let keys = [], rows = []
			if (type == 'unCheck') {
				keys = listSelData.filter(_item => !listSelDataKeys.includes(_item))
				rows = selectedRows.filter(_item => !listSelDataKeys.includes(_item.id))
			}
			this.setState({
				listSelData: keys,
				selectedRows: rows
			})
		}

		// 获取勾选的函数 2020/02/21 增加获取函数
		getSelectRows = () => {
			return this.state.listSelData.map(item => {
				return [...this.cacheSelRow, ...this.state.dataSource].find(fitem => fitem.id == item)
			})
		}

		_setSelectRows = (listSelData, selectedRows) => {
			this.setState({
				listSelData,
				selectedRows
			})
		}

		render() {
			const { listSelData } = this.state;

			// seach 相关
			const searchConfig = {
				changeSearch: (values, activeKey) => this.changeSearch(values, activeKey, true),
				loading: this.state.loading,
			}

			// 表格相关
			const tableConfig = {
				onChange: this.useTableTool,
				getData: this.getData,
				dataSource: this.state.dataSource,
				pagination: this.state.pagination,
				rowKey: (record) => record.id || record.key,
				...searchConfig,
				rowSelection: {
					selectedRowKeys: listSelData,
					onChange: (selectedRowKeys, selectedRows) => {
						this._setSelectRows(selectedRowKeys, selectedRows)
					}
				}
			}

			// 批量相关
			const batConfig = {
				changeSearch: this.changeSearch,
				listSelData: this.state.listSelData,
				selectedRows: this.state.selectedRows,
			}

			return <WrappedComponent
				{...this.props}
				{...this.state}
				{...tableConfig}
				tableConfig={tableConfig}
				searchConfig={searchConfig}
				batConfig={batConfig}
				param={this.state.param}
				hasCache={this.hasCache}
				initListParam={this.initListParam}
				getSelectRows={this.getSelectRows}
				setSelectRows={this._setSelectRows}
				ref={wrapComponent => this.ComponentWrap = wrapComponent}
			/>
		}
	}
})

export default dataOper