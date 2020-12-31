import React from 'react';

import {
	Form,
	Icon,
	Col,
	Select,
	Input,
	InputNumber,
	TreeSelect,
	Radio,
	DatePicker,
	Spin,
	Checkbox
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;

const {
	MonthPicker,
	RangePicker
} = DatePicker;


//下拉控件

export const SelectItem = ({
	data = [],
	getFieldDecorator,
	formItemLayout,
	labelConf,
	span,
	renderOption,
	styleExtra = true,
	itemConf,
	addonAfter,
	noLabel = false,
	noSearch = false,
	allConf,
	...props
}) => {
	let _formItem = {};

	if (!noLabel) {
		_formItem = {
			...formItemLayout,
			label: labelConf.name
		}
	} else {
		props.placeholder = "请选择" + labelConf.name
	}

	let renderData = []
	if (!noSearch && props.mode && props.mode != "multiple") {
		if (allConf == undefined) {
			renderData = [{
				id: "0",
				name: "全部"
			}]
		} else {
			renderData = [{
				id: allConf.key,
				name: allConf.name
			}]
		}
	}
	if (!!data)
		renderData = [...renderData, ...data]


	return <Col span={span} className={addonAfter?'restHeight':''} key={labelConf.key} style={{"display":styleExtra? "block":"none","padding":!noLabel ? "0" : "0 10px"}}>
			<FormItem {..._formItem} >
				{getFieldDecorator(labelConf.key,{
					...itemConf
					})(<Select
						style={{width: '100%','padding':0}}
						{...props}
					>
						{
							renderData.map((item)=>{
								if(renderOption != undefined){
								return renderOption(item);
								}else{
								return <Option 
									key={item.id || item.value || item.key}
									value={item.id || item.value || item.key}>
									{item.name || item.label || item.member_name}
								</Option>
								}
							}) 
						}
					</Select>)
				}
				{addonAfter && addonAfter()}
		</FormItem>
		</Col>
}

//模拟搜索框
export const RemoteSelect = ({
	remoteData,
	fetching,
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	renderOption,
	styleExtra = true,
	noLabel = false,
	getData,
	itemConf,
	extraData = [],
	...props
}) => {
	let _formItem = {};

	if (!noLabel) {
		_formItem = {
			...formItemLayout,
			label: labelConf.name
		}
	} else {
		props.placeholder = "请选择" + labelConf.name
	}
	const _destData = !remoteData.length ? extraData : remoteData ; //如果有模糊搜索的值 则使用 否则使用拓展的值
	return <Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none","padding":!noLabel ? "0" : "0 10px"}}>
	<FormItem {..._formItem} >
		{
			getFieldDecorator(labelConf.key,{
				...itemConf
			})(
				<Select
					placeholder="请输入"
					notFoundContent={fetching ? <Spin size="small" /> : null}
					filterOption={false}
					onSearch={getData}
					allowClear ={true}
					style={{ width: '100%' }}
					{...props}
				>
					{
						_destData.map((item)=>{
							if(renderOption != undefined){
								return renderOption(item);
							}else{
								return <Option 
									key={item.id || item.value} 
									value={item.id || item.value}>
									{item.name || item.label}
								</Option>
							}
						}) 
					}
				</Select>
			)
		}
	</FormItem>
</Col>
}



export const TreeItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
		<FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(
					<TreeSelect
						showSearch
						style={{ width: '100%' }}
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						treeData={props.data || []}
						{...props}
					/>
				)
			}
		</FormItem>
	</Col>
)

//输入框控件
export const InputItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	noLabel = false,
	...props
}) => {
	let _formItem = {};

	if (!noLabel) {
		_formItem = {
			...formItemLayout,
			label: labelConf.name
		}
	} else {
		props.placeholder = "请输入" + labelConf.name
	}
	return <Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none","padding":!noLabel ? "0" : "0 10px"}}>
		<FormItem {..._formItem}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(<Input 
					{...props}
					size="large"
					style={{width: '100%'}}
				/>)
			}
		</FormItem>
	</Col>
}

//数字的控件
export const NumberItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
        <FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(<InputNumber 
					{...props}
					style={{width: '100%'}}
				/>)
			}
		</FormItem>
	</Col>
)

//时间选择的控件
export const RangeItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
		<FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(<RangePicker
					style={{width: '100%'}}
					{...props}
				/>)
			}
		</FormItem>
	</Col>

)

export const DateItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
		<FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(
					<DatePicker
						style={{width: '100%'}}
						{...props}
					/>
				)
			}
		</FormItem>
	</Col>

)


export const MonthItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
		<FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(
					<MonthPicker
						style={{width: '100%'}}
						{...props}
					/>
				)
			}
		</FormItem>
	</Col>

)

//选择
export const RangeInput = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	noLabel = false,
	itemConf,
	...props
}) => {
	let _formItem = {};

	if (!noLabel) {
		_formItem = {
			...formItemLayout,
			label: labelConf.name
		}
	}

	return <Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none","padding":!noLabel ? "0" : "0 10px"}}>
		<FormItem {..._formItem} >
			<InputGroup compact style={{"display":'flex'}}>
				{
					getFieldDecorator(labelConf.key)(
						<Input style={{ flex:1, textAlign: 'center' }} placeholder={!noLabel? "最小" : `最小${labelConf.name}`} />
					)
				}
				<Input placeholder="~" disabled
					style={{
						width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff',
					}}
				/>
				{
					getFieldDecorator(labelConf.key2)(
						<Input style={{ flex:1, textAlign: 'center', borderLeft: 0 }} placeholder={!noLabel? "最大" : `最大${labelConf.name}` } />
					)
				}
			</InputGroup>
		</FormItem>
	</Col>
}


//复选框
export const CheckItem = ({
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	noLabel = false,
	itemConf,
	...props
}) => {
	let _formItem = {};

	if (!noLabel) {
		_formItem = {
			...formItemLayout,
		}
	}

	return <Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none","padding":!noLabel ? "0" : "0 10px"}}>
		<FormItem {..._formItem}>
			{
				getFieldDecorator(labelConf.key,{
					valuePropName: 'checked',
					...itemConf
				})(
					<Checkbox {...props}>
						{
							labelConf.name
						}
					</Checkbox>
				)
			}
		</FormItem>
	</Col>
}


//单选框
export const RadioItem = ({
	data = [],
	getFieldDecorator,
	span,
	labelConf,
	formItemLayout,
	styleExtra = true,
	renderOption,
	itemConf,
	...props
}) => (
	<Col span={span} key={labelConf.key} style={{"display":styleExtra? "block":"none"}}>
		<FormItem {...formItemLayout} label={labelConf.name}>
			{
				getFieldDecorator(labelConf.key,{
					...itemConf
				})(
					<RadioGroup {...props}>
						{
							data.map((item)=>{
								if(renderOption != undefined){
									return renderOption(item);
								}else{
									return <Radio 
										key={item.id || item.value} 
										value={item.id || item.value}>
										{item.name || item.label}
									</Radio>
								}
							}) 
						}
					</RadioGroup>
				)
			}
		</FormItem>
	</Col>
)