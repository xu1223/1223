import React from 'react'
import {
	DrawerComp as Drawer
} from '@/components/ModalComp2'
import {
	Icon,
	message,
	Row,
	Col,
	Input,
	Skeleton,
	Empty,
	Button
} from 'antd';
const {
	Search
} = Input;
import {
	post
} from 'fetch/request';
import {
	CONFIG
} from './Config'
import Immutable from 'immutable';
export default class ProductClassify extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.num = 1
		this.state = {
			obj: {
				1: [],
				2: [],
				3: [],
				4: [],
				5: [],
				6: []
			},
			cacheData: {},
			activeId: '',
			cateType: {
				1: 'common',
				2: 'platform',
				3: 'platform',
				4: 'platform',
				5: 'platform',
				6: 'platform'
			},
			loading: false,
			commonCategoryData: [],
			value: {
				1: '',
				2: '',
				3: '',
				4: '',
				5: '',
				6: ''
			}
		}
		const {
			modal = 'configPub'
		} = props;
		this.config = CONFIG[modal]
	}

	componentDidMount() {
		let {
			categoryData,
			type,
			cacheData,
			commonCategoryData
		} = this.props;
		const {
			obj,
			cateType
		} = this.state;
		this.setState({
			obj: {
				...obj,
				...{
					1: categoryData
				}
			},
			cacheData,
			commonCategoryData,
			cateType: {
				...cateType,
				...{
					1: type
				}
			},
		})
	}

	selectCategory = data => {
		const {
			getCateMethod,
			storeId,
			setCateResult,
			otherParams,
			handleCancel,
			modalParams,
			beforeCallback
		} = this.props;
		const {
			obj,
			cacheData,
			cateType
		} = this.state;
		const {
			childKey,
			childArrKey,
			nodeKey,
			storeKey,
			parentNodeKey,
			nodeNameKey,
			addId
		} = this.config;
		if (data[childKey] + '' == 1 || data[childKey] === false || (data[childArrKey] && data[childArrKey].length > 0) || (childKey == 'comment' && data[childKey] !== '0')) {
			this.num++;
			if (!data[childArrKey]) {
				if (cacheData[data[nodeKey]]) {
					this.setState({
						obj: {
							...obj,
							...{
								[this.num]: cacheData[data[nodeKey]].map(item => {
									delete item.active
									return item
								})
							}
						},
						cateType: {
							...cateType,
							...{
								[this.num]: 'platform'
							}
						}
					})
				} else {
					this.setState({
						loading: true
					})
					post(getCateMethod, {
						...otherParams,
						...modalParams,
						// [storeKey]: storeId,
						//[storeKey]: 1934, //测试亚马逊店铺id
						//[storeKey]: 617, //测试ebay店铺id
						[nodeKey]: data[nodeKey],
						level: this.num,
						// categoryLevel: this.num - 1, //ebay额外参数
						[parentNodeKey]: data[parentNodeKey]
					}).then(res => {
						let jsObj = Immutable.fromJS(res)
						let resultData = jsObj.getIn(['resultData', 'data', 'list']) ? res.resultData.data.list : jsObj.getIn(['resultData', 'data', 'children']) ? res.resultData.data.children : jsObj.getIn(['resultData', 'data']) ? res.resultData.data : res.resultData
						cacheData[data[nodeKey]] = resultData
						this.setState({
							obj: {
								...obj,
								...{
									[this.num]: resultData
								}
							},
							cacheData,
							cateType: {
								...cateType,
								...{
									[this.num]: 'platform'
								}
							},
							loading: false
						})
					})
				}
			} else {
				this.setState({
					obj: {
						...obj,
						...{
							[this.num]: data[childArrKey]
						}
					}
				})
			}
			obj[this.num - 1].map(item => {
				if (item[nodeKey] == data[nodeKey]) {
					item.active = true
				} else {
					item.active = false
				}
			})
		} else {
			this.setState({
				activeId: data[nodeKey]
			})

			if (beforeCallback && !beforeCallback(data)) {
				return false
			}
			message.success(`分类${data[nodeNameKey]}选择成功`)
			handleCancel()
			let cateStr = ''
			for (let i = 1; i < this.num; i++) {
				let activeItem = obj[i].find(j => j.active)
				if (addId) {
					cateStr += `${activeItem[nodeNameKey]} (${activeItem[nodeKey]})  >> `
				} else {
					cateStr += `${activeItem[nodeNameKey]} >> `
				}
			}
			if (addId) {
				cateStr += `${data[nodeNameKey]}(${data[nodeKey]})`
			} else {
				cateStr += `${data[nodeNameKey]}`
			}
			setCateResult && setCateResult(data, cateStr)
		}
	}

	closeModal = () => {
		const {
			handleCancel
		} = this.props;
		const {
			obj
		} = this.state;
		this.setState({
			obj: {
				...obj,
				...{
					[this.num]: []
				}
			}
		})
		if (this.num > 1) {
			this.num--
		} else {
			handleCancel()
		}
	}

	//获取定位样式
	getStyle = key => {
		return (this.num - key) * 440 - 180 - (this.num - key) * 30 + 'px'
	}

	openDrawer = (type, num) => {
		const {
			cateType
		} = this.state;
		this.setState({
			cateType: {
				...cateType,
				...{
					[num]: type
				}
			},
		})
	}

	//改变state
	setPropsData = obj => {
		this.setState({
			...obj
		})
	}
	//搜索当前分类
	searchCategory = e => {
		const {
			obj
		} = this.state;
		const {
			nodeNameKey,
			nodeKey
		} = this.config;
		const cpTxt = e.toLowerCase()
		this.setState({
			obj: {
				...obj,
				...{
					[this.num]: obj[this.num].map(item => {
						if (item[nodeNameKey].toLowerCase().indexOf(cpTxt) < 0 && (item[nodeKey] + '').toLowerCase().indexOf(cpTxt) < 0) {
							item.flag = true
						} else if (!e) {
							item.flag = false
						}
						return item
					})
				}
			}
		})
	}

	//双向绑定值
	changeNumValue = (e, num) => {
		const { value } = this.state;
		value[num] = e.target.value;
		this.setState({
			value,
		})
	}

	//重置值
	resetSearch = num => {
		const { value } = this.state;
		value[num] = '';
		this.setState({
			value,
		})
		this.searchCategory('')
	}
	//渲染搜索组件
	renderSelect = num => {
		return <Row><Col span={19}><Search
			placeholder="请输入关键字进行搜索"
			onSearch={value => this.searchCategory(value)}
			value={this.state.value[num]}
			onChange={e => this.changeNumValue(e, num)}
			style={{ width: '100%' }}
		/></Col><Col span={2} offset={1} style={{ marginTop: '3px' }}><Button size='small' onClick={() => this.resetSearch(num)}>重置</Button></Col></Row>
	}
	//分类的tab渲染
	renderTab = (type, num) => {
		const {
			cateType,
		} = this.state;
		return <Col span={12} style={{ background: cateType[num] == type ? 'rgba(219,238,253,1)' : '#fff' }} className={type == 'common' ? 'categoryTitle commonTab' : 'categoryTitle'} onClick={() => this.openDrawer(type, num)}>
			<Icon type="appstore" style={{ color: cateType[num] == type ? '#4AAAF3' : null }} />
			<span className='categoryTitleText' style={{ color: cateType[num] == type ? '#4AAAF3' : null }}>{type == 'common' ? '常用分类' : '平台分类'}</span>
		</Col>
	}

	//渲染tab
	renderTitle = (num) => {
		return <Row>
			{this.renderTab('common', num)}
			{this.renderTab('platform', num)}
		</Row>
	}

	//渲染常用分类
	renderCommonDom = (num) => {
		const {
			cateType,
			commonCategoryData
		} = this.state;
		const {
			nodeNameKey
		} = this.config;

		return <div style={{ display: cateType[num] == 'common' ? 'block' : 'none' }}>
			{commonCategoryData.length > 0 ? commonCategoryData.map(item => (<Row type='flex' justify='space-between' style={{ color: item.active ? '#4AAAF3' : null }} className="restTabStyleModal" key={item.id} onClick={() => this.selectCategory(item)}>
				<span>{item[nodeNameKey]}</span>
			</Row>)) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
		</div>
	}

	//渲染平台分类
	renderPlatformDom = num => {
		const modalProp = {
			className: 'cateModal',
			title: '',
			width: 440,
			footer: null,
			placement: "right",
			style: {
				opcity: 0.5
			},
			visible: visibleClassify,
			onClose: () => this.closeModal(),
		};
		const {
			cateType,
			obj,
			loading
		} = this.state;
		const {
			visibleClassify,
			userSpace
		} = this.props;
		const {
			childKey,
			nodeKey,
			nodeNameKey,
			childArrKey,
			addId
		} = this.config;
		return <Drawer {...modalProp} visible={this.num >= num}
			title={!userSpace ?
				this.renderTitle(num) :
				<Row className='categoryTitle' style={{ background: '#fff' }}>
					<Icon type="appstore" />
					<span className='categoryTitleText'>选择分类</span>
				</Row>
			} style={{ right: this.num == num ? 0 : this.getStyle(num) }}>
			{
				!loading || this.num != num ?
					<div style={{ display: cateType[num] == 'platform' ? 'block' : 'none' }}>
						{!userSpace && this.renderSelect(num)}
						{Array.isArray(obj[num]) && obj[num].filter(k => !k.flag).length > 0 ? obj[num].filter(k => !k.flag).map(item => (
							<Row type='flex' justify='space-between' style={{ color: item.active ? '#4AAAF3' : null }} className="restTabStyleModal" key={item.id} onClick={() => this.selectCategory(item)}>
								{addId ? <span>{`${item[nodeNameKey]} (${item[nodeKey]})`}</span> : <span>{`${item[nodeNameKey]}`}</span>}
								{
									item[childKey] + '' == 1 || item[childKey] === false || (item[childArrKey] && item[childArrKey].length > 0 || (childKey == 'comment' && item[childKey] != '0')) ?
										<Icon type="right-square" /> : null
								}
							</Row>
						)) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
						}
						{obj[num + 1] && this.renderPlatformDom(num + 1)}
					</div> : <Skeleton active paragraph={{ rows: 30 }} />
			}
			{this.renderCommonDom(num)}
		</Drawer>
	}

	render() {
		return this.renderPlatformDom(1)
	}
}