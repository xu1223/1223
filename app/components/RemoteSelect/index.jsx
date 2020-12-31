import React from 'react'
import {
	Select,
	Spin
} from 'antd';
import Base from '../../util/base.js'

import {
	post,
} from '../../fetch/request.js';

import debounce from 'lodash.debounce';
const Option = Select.Option;

export default class RemoteSelect extends React.Component {
	static defaultProps = {
		mode: '',
		requestUrl: '/home/member/getAllMemberListByName', //模糊搜索url
		requestKeyName: 'name', // 模糊搜索值对应的参数名
        // zkey:redux 存的下拉数据的名字
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			fetching: false,
			sel_data: [],
		}
		this.lastFetchId = 0;
		this.fetchUser = debounce(this.fetchUser, 800);
	}
	componentDidMount () {

	}

	fetchUser(value) {
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({
			fetching: true
		});
		let params = {};
		params[this.props.requestKeyName] = value;

		if (this.props.requestKeyId) {
			params[this.props.requestKeyId] = this.props.storeId;
		}

		post(this.props.requestUrl, params).then((data) => {
			if (fetchId !== this.lastFetchId) {
				return;
			}
			let sel_data = [];
			const _data = data.resultData.data.list;
			if (_data.length > 0)
				sel_data = _data.map(user => ({
					text: user.name || user.label || user.position_name,
					value: user.id || user.value,
				}));
			this.setState({
				sel_data,
				fetching: false
			});
		});
	}

	handleChange(sel_value) {
		this.setState({
			sel_data: [],
			fetching: false,
		});
		var obj = {}
		obj[this.props.zkey] = sel_value
		if (this.props.changeRemoteName)
			this.props.changeRemoteName(sel_value);
	}

	render() {
		const {
			fetching,
			sel_data,
		} = this.state;
		const {
            needAll
		} = this.props;
		return (
			<Select
				mode={this.props.mode}
				showSearch
				labelInValue
                allowClear={needAll ? true : false}
				value={this.props.ERP[this.props.zkey]}
				placeholder={this.props.initialValue ? this.props.initialValue : "输入搜索关键字"}
				notFoundContent={fetching ? <Spin size="small" /> : null}
				filterOption={false}
				onSearch={this.fetchUser.bind(this)}
				onChange={this.handleChange.bind(this)}
				size="large"
				disabled={this.props.disabled}
				style={{ width: '100%' }}
			>
				{sel_data.map(d => <Option key={d.value}>{d.text}</Option>)}
			</Select>
		)
	}
}


