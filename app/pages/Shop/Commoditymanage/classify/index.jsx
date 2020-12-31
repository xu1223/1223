import React, {
	Component
} from 'react';
import {
	Button,
	Input,
	message,
	Modal,
	Table,
	Spin
} from 'antd';
import './index.less'
import DataOper from '@/advanced/dataOper2';
import {
	ListContext
} from '@/config/context'
import api from '@/fetch/api';
import { post } from '@/fetch/request';
import SaveCategory from './SubPage/saveCategory';
import TransferProducts from './SubPage/transferProducts';
import BatOperation from '@/components/BatOperation';
import pageConfig from './Config';

@DataOper(pageConfig)

export default class ProductCateGoryPage extends Component {
	static defaultProps = {

	};
	constructor(props, context) {
		super(props, context);
		this.state = {
			inpValu: '',
			loading: true
		}
		this.flag = false;
		const _batProps = (rowData) => {
			return {
				config: [{
					title: '转移商品',
					noCheck: true,
					ghost: true,
					onClick: () => { this.toggleWin('visibleTransfer', { rowData }) }
				}, {
					title: '编辑',
					noCheck: true,
					ghost: true,
					onClick: () => { this.toggleWin('visibleCategory', { rowData }) }
				}, {
					title: '删除',
					noCheck: true,
					type: 'danger',
					ghost: true,
					onClick: () => { this.deleteButton(rowData) }
				}],
				method: '',
				unicode: 'ids|id',
				batConfig: this.props.batConfig,
				rowData
			}
		};
		this.columns = [{
			dataIndex: "name",
			title: "商品分类",
			width: '25%',
			key: 'name',
		}, {
			dataIndex: "name_cn",
			title: "商品中文名",
			width: '15%',
			key: 'name_cn',
		}, {
			dataIndex: "total_product",
			title: "商品数量",
			width: '15%',
			key: 'total_product',
		}, {
			dataIndex: "sort_order",
			title: "排序",
			width: '15%',
			key: 'sort_order',
			render: (text, record, index) => {
				return <span><Input defaultValue={text} onChange={(e) => { this.onChange(e) }} onBlur={() => this.onblur(record)} style={{ width: 80 }} /></span>
			}
		}, {
			dataIndex: "id",
			key: 'id',
			title: "操作",
			width: '27%',
			render: (text, record, index) => {
				return <div className="operatingButton">
					<BatOperation {..._batProps(record)} />
				</div>
			}
		}]
	}



	componentDidMount() {
		this.getproductCategorySelectAll()
		//获取筛选器列表
		post(api.get_filter_list).then(res => {
			this.setState({
				get_filter_list: res.resultData,
			})
		})

	}

	// 存取排序值
	onChange = (e) => {
		this.setState({
			inpValu: e.target.value
		})
	}

	// 修改排序值
	onblur = (e) => {
		post(api.save_category_list, {
			category_id: e.id,
			sort_order: this.state.inpValu
		}).then(res => {
			if (res.resultId == 200) {
				message.success('修改成功');
			}

		})
	}



	//获取数据
	getproductCategorySelectAll = () => {  //获取分类数据
		post(api.get_categorys_pager).then(res => {
			const ProductCategoryDataList = res.resultData
			this.setState({
				ProductCategoryDataList,
				loading: false

			})
		})
	}


	//  删除按钮
	deleteButton = (value) => {
		let params = {
			id: value.id,
		};
		Modal.confirm({
			title: '操作提示?',
			content: '是否确认删除？删除将导致产品引用部分全部失效',
			onOk: () => {
				post(api.category_del, {
					...params
				}).then(res => {
					if (res.resultId == 200) {
						message.success(res.resultMsg);
						this.getproductCategorySelectAll();
					} else {
						message.error(res.resultMsg);
					}
				})
			},
		});
	}
	// 共享 tool 和index 
	toggleWin = (key = 'visible', otherConfig) => {
		console.log(otherConfig, 'oth')
		this.setState({
			[key]: !this.state[key],
			otherConfig
		})
	}
	render() {
		const {
			ProductCategoryDataList,
		} = this.state;
		const contextProps = {
			...this.state.otherConfig,
			toggleWin: this.toggleWin,
			visibleCategory: this.state.visibleCategory,
			visibleTransfer: this.state.visibleTransfer,
			batConfig: { ...this.props.batConfig, changeSearch: this.getproductCategorySelectAll },
			changeSearch: this.props.changeSearch,             //搜索方法
			ProductCategoryDataList: ProductCategoryDataList,  //分类数据
			getproductCategorySelectAll: this.getproductCategorySelectAll,  //获取分类数据

		};

		return (
			<div className='userStyle'>
				<ListContext.Provider value={contextProps}>
					<div className="header-tool">
						<p>商品分类</p>
						<div className='action-bar'>
							<Button type="primary" shape="round" onClick={() => this.toggleWin('visibleCategory', {})}>新增商品</Button>
						</div>
					</div>
					<Spin spinning={this.state.loading}>
						<div className='content-main overflowHidden'>

							<div className='content-table'>
								<Table childrenColumnName={'children'} columns={this.columns} pagination={false} dataSource={ProductCategoryDataList} />,
					</div>

						</div>
					</Spin>
					{/* 新增编辑弹窗 */}
					{this.state.visibleCategory && <SaveCategory get_filter_list={this.state.get_filter_list} />}
					{/* 转移商品弹窗 */}
					{this.state.visibleTransfer && <TransferProducts />}
				</ListContext.Provider>
			</div>
		)
	}
}